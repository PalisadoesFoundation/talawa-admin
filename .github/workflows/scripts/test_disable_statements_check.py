#!/usr/bin/env python3
"""
Comprehensive test suite for disable_statements_check.py
"""

import inspect
import os
import tempfile
import unittest
from disable_statements_check import DisableStatementsChecker


class TestDisableStatementsChecker(unittest.TestCase):
    """Test cases for DisableStatementsChecker class."""

    def setUp(self) -> None:
        """Set up test fixtures."""
        self.checker = DisableStatementsChecker()

    def test_eslint_disable_detection(self) -> None:
        """Test detection of eslint-disable comments."""
        disable_comment = "// eslint" + "-disable no-console"
        next_line_comment = "// eslint" + "-disable-next-line no-unused-vars"
        content = f"""
        {disable_comment}
        console.log('test');
        {next_line_comment}
        """
        violations = self.checker.check_eslint_disable(content, 'test.js')
        self.assertEqual(len(violations), 2)
        self.assertIn('test.js:2', violations[0])
        self.assertIn('test.js:4', violations[1])

    def test_istanbul_ignore_detection(self) -> None:
        """Test detection of istanbul ignore comments."""
        ignore_next = "/* istanbul" + " ignore next */"
        ignore_if = "/* istanbul" + " ignore if */"
        content = f"""
        {ignore_next}
        function uncovered() {{}}
        {ignore_if}
        """
        violations = self.checker.check_istanbul_ignore(content, 'test.js')
        self.assertEqual(len(violations), 2)

    def test_it_skip_detection(self) -> None:
        """Test detection of it.skip statements."""
        skip_statement = "it.s" + "kip('disabled test', () => {});"
        content = f"""
        it('should work', () => {{}});
        {skip_statement}
        """
        violations = self.checker.check_it_skip(content, 'test.spec.js')
        self.assertEqual(len(violations), 1)
        self.assertIn('test.spec.js:3', violations[0])

    def test_case_insensitive_detection(self) -> None:
        """Test case-insensitive pattern matching."""
        content = "// ESLINT" + "-DISABLE no-console"
        violations = self.checker.check_eslint_disable(content, 'test.js')
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
        violations = self.checker.check_istanbul_ignore(content, 'test.js')
        self.assertEqual(len(violations), 1)

    def test_no_violations(self) -> None:
        """Test files with no disable statements."""
        content = "console.log('clean code');"
        violations = self.checker.check_eslint_disable(content, 'test.js')
        self.assertEqual(len(violations), 0)

    def test_check_file_success(self) -> None:
        """Test successful file checking."""
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                temp_file = f.name
                disable_comment = '// eslint' + '-disable no-console'
                f.write(f'{disable_comment}\nconsole.log("test");')
            
            violations = self.checker.check_file(temp_file)
            self.assertEqual(len(violations), 1)
            self.assertIn('eslint' + '-disable', violations[0])
        finally:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)

    def test_check_file_error(self) -> None:
        """Test file reading error handling."""
        violations = self.checker.check_file('nonexistent_file.js')
        self.assertEqual(len(violations), 1)
        self.assertIn('Error reading file', violations[0])

    def test_check_multiple_files(self) -> None:
        """Test checking multiple files."""
        temp_files = []
        try:
            # Create first temp file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                temp_files.append(f.name)
                disable_comment = '// eslint' + '-disable no-console'
                f.write(disable_comment)
            
            # Create second temp file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                temp_files.append(f.name)
                skip_statement = 'it.s' + 'kip("test", () => {});'
                f.write(skip_statement)
            
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
            temp_file = os.path.join(temp_dir, 'test.js')
            
            with open(temp_file, 'w') as f:
                disable_comment = '// eslint' + '-disable no-console'
                f.write(disable_comment)
            
            violations = self.checker.check_directory(temp_dir)
            self.assertEqual(len(violations), 1)
        finally:
            if temp_file and os.path.exists(temp_file):
                os.unlink(temp_file)
            if temp_dir and os.path.exists(temp_dir):
                os.rmdir(temp_dir)

    def test_auto_discovery_mechanism(self) -> None:
        """Test that check methods are auto-discovered."""
        check_methods = [name for name, method in inspect.getmembers(self.checker, predicate=inspect.ismethod)
                        if name.startswith('check_') and name not in ('check_file', 'check_files', 'check_directory')]
        
        expected_methods = {'check_eslint_disable', 'check_istanbul_ignore', 'check_it_skip'}
        for method in expected_methods:
            self.assertIn(method, check_methods)
        
        # Verify orchestration methods are NOT in the auto-discovered list
        self.assertNotIn('check_file', check_methods)
        self.assertNotIn('check_files', check_methods)
        self.assertNotIn('check_directory', check_methods)

    def test_line_number_accuracy(self) -> None:
        """Test accurate line number reporting."""
        disable_comment = '// eslint' + '-disable no-console'
        content = f"""line 1
line 2
{disable_comment}
line 4"""
        violations = self.checker.check_eslint_disable(content, 'test.js')
        self.assertEqual(len(violations), 1)
        self.assertIn('test.js:3', violations[0])

    def test_multiple_violations_same_file(self) -> None:
        """Test multiple violations in the same file."""
        disable_comment = '// eslint' + '-disable no-console'
        ignore_comment = '/* istanbul ' + 'ignore next */'
        skip_statement = 'it.s' + 'kip(\'test\', () => {});'
        content = f"""
        {disable_comment}
        {ignore_comment}
        {skip_statement}
        """
        violations = self.check_file_content_for_testing(content, 'test.js')
        self.assertEqual(len(violations), 3)

    def check_file_content_for_testing(self, content: str, file_path: str) -> list:
        """Helper method to test file content directly."""
        violations = []
        for name, method in inspect.getmembers(self.checker, predicate=inspect.ismethod):
            if name.startswith('check_') and name not in ('check_file', 'check_files', 'check_directory'):
                violations.extend(method(content, file_path))
        return violations

    def test_empty_file(self) -> None:
        """Test handling of empty files."""
        violations = self.checker.check_eslint_disable('', 'empty.js')
        self.assertEqual(len(violations), 0)

    def test_whitespace_variations(self) -> None:
        """Test detection with various whitespace patterns."""
        disable1 = '//eslint' + '-disable'
        disable2 = '//  eslint' + '-disable  '
        content = f"{disable1}\n{disable2}\n"
        violations = self.checker.check_eslint_disable(content, 'test.js')
        self.assertEqual(len(violations), 2)


if __name__ == '__main__':
    unittest.main(verbosity=2)
