#!/usr/bin/env python3
"""Comprehensive test suite for disable_statements_check.py."""

import inspect
import os
import sys
import tempfile
import unittest
from unittest.mock import patch

from disable_statements_check import DisableStatementsChecker, main


class TestDisableStatementsChecker(
    unittest.TestCase
):  # pylint: disable=too-many-public-methods
    """Test cases for DisableStatementsChecker class."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.checker = DisableStatementsChecker()

    def test_eslint_disable_detection(self) -> None:
        """Test detection of eslint-disable comments."""
        content = """
        // eslint-disable no-console
        console.log('test');
        // eslint-disable-next-line no-unused-vars
        """
        violations = self.checker.check_eslint_disable(content, "test.js")
        self.assertEqual(len(violations), 2)
        self.assertIn("test.js:2", violations[0])
        self.assertIn("test.js:4", violations[1])

    def test_istanbul_ignore_detection(self) -> None:
        """Test detection of istanbul ignore comments."""
        content = """
        /* istanbul ignore next */
        function uncovered() {}
        /* istanbul ignore if */
        """
        violations = self.checker.check_istanbul_ignore(content, "test.js")
        self.assertEqual(len(violations), 2)

    def test_it_skip_detection(self) -> None:
        """Test detection of it.skip statements."""
        content = """
        it('should work', () => {});
        it.skip('disabled test', () => {});
        """
        violations = self.checker.check_it_skip(content, "test.spec.js")
        self.assertEqual(len(violations), 1)
        self.assertIn("test.spec.js:3", violations[0])

    def test_case_insensitive_detection(self) -> None:
        """Test case-insensitive pattern matching."""
        content = "// ESLINT" + "-DISABLE no-console"
        violations = self.checker.check_eslint_disable(content, "test.js")
        self.assertEqual(len(violations), 1)

    def test_multi_line_istanbul_comments(self) -> None:
        """Test multi-line istanbul ignore comments."""
        ignore_comment = "istanbul" + " ignore next"
        content = f"""
        /*
         {ignore_comment}
        */
        function test() {{}}
        """
        violations = self.checker.check_istanbul_ignore(content, "test.js")
        self.assertEqual(len(violations), 1)

    def test_no_violations(self) -> None:
        """Test files with no disable statements."""
        content = "console.log('clean code');"
        violations = self.checker.check_eslint_disable(content, "test.js")
        self.assertEqual(len(violations), 0)

    def test_check_file_success(self) -> None:
        """Test successful file checking."""
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".js", delete=False
            ) as f:
                temp_file = f.name
                f.write('// eslint-disable no-console\nconsole.log("test");')

            violations = self.checker.check_file(temp_file)
            self.assertEqual(len(violations), 1)
            self.assertIn("eslint-disable", violations[0])
        finally:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)

    def test_check_file_error(self) -> None:
        """Test file reading error handling."""
        violations = self.checker.check_file("nonexistent_file.js")
        self.assertEqual(len(violations), 1)
        self.assertIn("Error reading file", violations[0])

    def test_check_multiple_files(self) -> None:
        """Test checking multiple files."""
        temp_files = []
        try:
            # Create first temp file
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".js", delete=False
            ) as f:
                temp_files.append(f.name)
                f.write("// eslint-disable no-console")

            # Create second temp file
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".js", delete=False
            ) as f:
                temp_files.append(f.name)
                f.write('it.skip("test", () => {});')

            violations = self.checker.check_files(temp_files)
            self.assertEqual(len(violations), 2)
        finally:
            for temp_file in temp_files:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)

    def test_check_directory(self) -> None:
        """Test directory checking functionality."""
        temp_dir = None
        temp_file = None
        try:
            temp_dir = tempfile.mkdtemp()
            temp_file = os.path.join(temp_dir, "test.js")

            with open(temp_file, "w", encoding="utf-8") as f:
                f.write("// eslint-disable no-console")

            violations = self.checker.check_directory(temp_dir)
            self.assertEqual(len(violations), 1)
        finally:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)
            if temp_dir and os.path.exists(temp_dir):
                os.rmdir(temp_dir)

    def test_auto_discovery_mechanism(self) -> None:
        """Test that check methods are auto-discovered."""
        check_methods = [
            name
            for name, method in inspect.getmembers(
                self.checker, predicate=inspect.ismethod
            )
            if name.startswith("check_")
            and name not in ("check_file", "check_files", "check_directory")
        ]

        expected_methods = {
            "check_eslint_disable",
            "check_istanbul_ignore",
            "check_it_skip",
        }
        for method in expected_methods:
            self.assertIn(method, check_methods)

        # Verify orchestration methods are NOT in the auto-discovered list
        self.assertNotIn("check_file", check_methods)
        self.assertNotIn("check_files", check_methods)
        self.assertNotIn("check_directory", check_methods)

    def test_line_number_accuracy(self) -> None:
        """Test accurate line number reporting."""
        content = """line 1
line 2
// eslint-disable no-console
line 4"""
        violations = self.checker.check_eslint_disable(content, "test.js")
        self.assertEqual(len(violations), 1)
        self.assertIn("test.js:3", violations[0])

    def test_multiple_violations_same_file(self) -> None:
        """Test multiple violations in the same file."""
        content = """
        // eslint-disable no-console
        /* istanbul ignore next */
        it.skip('test', () => {});
        """
        violations = self.check_file_content_for_testing(content)
        self.assertEqual(len(violations), 3)

    def check_file_content_for_testing(self, content: str) -> list:
        """Helper method to test file content directly.

        Args:
            content: File content to test.

        Returns:
            violations: List of violations found in the content.
        """
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".js", delete=False
            ) as f:
                temp_file = f.name
                f.write(content)
            return self.checker.check_file(temp_file)
        finally:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)

    def test_self_referential_skip(self) -> None:
        """Test that test_disable_statements_check.py is skipped."""
        violations = self.checker.check_file(
            "test_disable_statements_check.py"
        )
        self.assertEqual(len(violations), 0)

    def test_empty_file(self) -> None:
        """Test handling of empty files."""
        violations = self.checker.check_eslint_disable("", "empty.js")
        self.assertEqual(len(violations), 0)

    def test_whitespace_variations(self) -> None:
        """Test detection with various whitespace patterns."""
        content = "//eslint-disable\n//  eslint-disable  \n"
        violations = self.checker.check_eslint_disable(content, "test.js")
        self.assertEqual(len(violations), 2)

    def test_main_with_files_argument(self) -> None:
        """Test main() with --files argument."""
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".js", delete=False
            ) as f:
                temp_file = f.name
                f.write("// eslint-disable no-console")

            with patch.object(
                sys,
                "argv",
                ["disable_statements_check.py", "--files", temp_file],
            ):
                with patch("sys.exit") as mock_exit:
                    main()
                    mock_exit.assert_called_with(1)
        finally:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)

    def test_main_with_directory_argument(self) -> None:
        """Test main() with --directory argument."""
        temp_dir = None
        temp_file = None
        try:
            temp_dir = tempfile.mkdtemp()
            temp_file = os.path.join(temp_dir, "test.js")
            with open(temp_file, "w", encoding="utf-8") as f:
                f.write('it.skip("test", () => {});')

            with patch.object(
                sys,
                "argv",
                ["disable_statements_check.py", "--directory", temp_dir],
            ):
                with patch("sys.exit") as mock_exit:
                    main()
                    mock_exit.assert_called_with(1)
        finally:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)
            if temp_dir and os.path.exists(temp_dir):
                os.rmdir(temp_dir)

    def test_main_no_violations_exit_zero(self) -> None:
        """Test main() exits 0 when no violations found."""
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".js", delete=False
            ) as f:
                temp_file = f.name
                f.write('console.log("clean code");')

            with patch.object(
                sys,
                "argv",
                ["disable_statements_check.py", "--files", temp_file],
            ):
                # Should return normally (no sys.exit call) when no violations
                main()  # Will raise SystemExit if exit code != 0
        finally:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)


if __name__ == "__main__":
    unittest.main(verbosity=2)
