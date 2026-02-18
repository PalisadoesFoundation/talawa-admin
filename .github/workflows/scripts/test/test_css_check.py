#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""Comprehensive unit tests for css_check.py with 100% code coverage."""

import unittest
import tempfile
import os
import sys
from unittest.mock import patch
from io import StringIO
import shutil

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

from css_check import (
    check_embedded_styles,
    process_typescript_file,
    check_files,
    validate_directories_input,
    format_violation_output,
    DetailedViolation,
    CSSCheckResult,
    main,
)


class TestCheckEmbeddedStyles(unittest.TestCase):
    """Test suite for check_embedded_styles function."""

    def test_detects_hex_color(self):
        """Test detection of 6-digit hex color codes."""
        content = "const bgColor = '#ff0000';"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "hex_color")
        self.assertEqual(violations[0].code_snippet, "#ff0000")

    def test_detects_multiple_hex_colors(self):
        """Test detection of multiple hex colors in one line."""
        content = (
            "const colors = { primary: '#ff0000', secondary: '#00ff00' };"
        )
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 2)
        self.assertTrue(
            all(v.violation_type == "hex_color" for v in violations)
        )

    def test_detects_rgb_color(self):
        """Test detection of RGB color codes."""
        content = "const color = 'rgb(255, 0, 0)';"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "rgb_color")

    def test_detects_rgba_color(self):
        """Test detection of RGBA color codes."""
        content = "const color = 'rgba(255, 0, 0, 0.5)';"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "rgb_color")

    def test_detects_hsl_color(self):
        """Test detection of HSL color codes."""
        content = "const color = 'hsl(120, 100%, 50%)';"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "hsl_color")

    def test_detects_inline_style_object(self):
        """Test detection of inline style objects."""
        content = "<div style={{ color: 'red' }}>Hello</div>"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "inline_style_object")

    def test_detects_inline_style_string_double_quotes(self):
        """Test detection of inline style strings with double quotes."""
        content = '<div style="color: red;">Hello</div>'
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "inline_style_string")

    def test_detects_inline_style_string_single_quotes(self):
        """Test detection of inline style strings with single quotes."""
        content = "<div style='color: red;'>Hello</div>"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "inline_style_string")

    def test_detects_camelcase_font_size(self):
        """Test detection of camelCase CSS property fontSize."""
        content = "const styles = { fontSize: '16px' };"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 2)
        self.assertEqual(
            violations[0].violation_type, "camelcase_css_property"
        )

    def test_detects_camelcase_margin_top(self):
        """Test detection of camelCase CSS property marginTop."""
        content = "const styles = { marginTop: '10px' };"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 2)
        self.assertEqual(
            violations[0].violation_type, "camelcase_css_property"
        )

    def test_detects_camelcase_padding_left(self):
        """Test detection of camelCase CSS property paddingLeft."""
        content = "const styles = { paddingLeft: '5px' };"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 2)
        self.assertEqual(
            violations[0].violation_type, "camelcase_css_property"
        )

    def test_detects_pixel_value(self):
        """Test detection of pixel values in style context."""
        content = "const style = { width: '100px' };"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "pixel_value")

    def test_detects_rem_value(self):
        """Test detection of rem values in style context."""
        content = "const style = { margin: '1rem' };"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].violation_type, "pixel_value")

    def test_ignores_single_line_comment_with_hex(self):
        """Test that hex colors in single-line comments are ignored."""
        content = "// const color = '#ff0000';"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_ignores_block_comment_with_styles(self):
        """Test that styles in block comments are ignored."""
        content = "/* const color = '#ff0000'; */"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_ignores_multiline_block_comment(self):
        """Test that multiline block comments with styles are ignored."""
        content = """/*
        const color = '#ff0000';
        const bg = 'rgb(255, 0, 0)';
        */"""
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_handles_block_comment_spanning_lines(self):
        """Test proper handling of block comments spanning multiple lines."""
        content = """const valid = 'test';
        /* comment with #ff0000 */
        const color = '#00ff00';"""
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].code_snippet, "#00ff00")
        self.assertEqual(violations[0].line_number, 3)

    def test_ignores_import_statements(self):
        """Test that import statements are ignored."""
        content = "import { colors } from './colors';"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_ignores_dynamic_import(self):
        """Test that dynamic import() statements are ignored."""
        content = "const module = import('./module');"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_ignores_hex_in_url(self):
        """Test that hex codes in URLs are ignored."""
        content = "const imageUrl = 'url(#ff0000)';"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_ignores_hex_in_href(self):
        """Test that hex codes in href attributes are ignored."""
        content = '<a href="/page#ff0000">Link</a>'
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_ignores_hex_in_src(self):
        """Test that hex codes in src attributes are ignored."""
        content = '<img src="/image#ff0000.png" />'
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_whitespace_only_content(self):
        """Test handling of whitespace-only content."""
        content = "   \n  \t  \n   "
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 0)

    def test_camelcase_requires_style_context(self):
        """Test that camelCase properties need style context to be flagged."""
        content = "const backgroundColor = 'someValue';"
        violations = check_embedded_styles(content, "test.tsx")
        # Should not flag variable names, only in style objects
        camelcase_violations = [
            v
            for v in violations
            if v.violation_type == "camelcase_css_property"
        ]
        self.assertEqual(len(camelcase_violations), 0)

    def test_camelcase_in_object_with_brace(self):
        """Test camelCase detection in object context."""
        content = "{ backgroundColor: 'red' }"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertEqual(len(violations), 1)
        self.assertEqual(
            violations[0].violation_type, "camelcase_css_property"
        )

    def test_pixel_value_without_style_context_ignored(self):
        """Test that pixel values without style context are ignored."""
        content = "const version = '100px';"
        violations = check_embedded_styles(content, "test.tsx")
        # Should not flag without style context
        pixel_violations = [
            v for v in violations if v.violation_type == "pixel_value"
        ]
        self.assertEqual(len(pixel_violations), 0)

    def test_pixel_value_with_width_keyword(self):
        """Test pixel value detection with 'width' keyword."""
        content = "const width: '100px',"
        violations = check_embedded_styles(content, "test.tsx")
        self.assertGreaterEqual(len(violations), 1)

    def test_multiple_violation_types_in_one_line(self):
        """Test detection of multiple violation types in a single line."""
        content = (
            "const style = { backgroundColor: '#ff0000', fontSize: '16px' };"
        )
        violations = check_embedded_styles(content, "test.tsx")
        self.assertGreaterEqual(len(violations), 3)  # hex, camelcase, pixel
        violation_types = {v.violation_type for v in violations}
        self.assertIn("hex_color", violation_types)
        self.assertIn("camelcase_css_property", violation_types)


class TestProcessTypescriptFile(unittest.TestCase):
    """Test suite for process_typescript_file function."""

    def setUp(self):
        """Create temporary directory for test files."""
        self.test_dir = tempfile.mkdtemp()

    def tearDown(self):
        """Clean up temporary directory."""
        shutil.rmtree(self.test_dir)

    def test_processes_valid_file(self):
        """Test processing of a valid TypeScript file."""
        file_path = os.path.join(self.test_dir, "test.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        violations = []
        process_typescript_file(file_path, violations)
        self.assertEqual(len(violations), 1)
        self.assertEqual(violations[0].file_path, file_path)

    def test_processes_empty_file(self):
        """Test processing of an empty file."""
        file_path = os.path.join(self.test_dir, "empty.tsx")
        with open(file_path, "w") as f:
            f.write("")

        violations = []
        process_typescript_file(file_path, violations)
        self.assertEqual(len(violations), 0)

    def test_processes_file_with_no_violations(self):
        """Test processing of a file with no violations."""
        file_path = os.path.join(self.test_dir, "clean.tsx")
        with open(file_path, "w") as f:
            f.write("const name = 'test';\nimport React from 'react';")

        violations = []
        process_typescript_file(file_path, violations)
        self.assertEqual(len(violations), 0)

    def test_handles_file_not_found(self):
        """Test handling of non-existent file."""
        file_path = os.path.join(self.test_dir, "nonexistent.tsx")
        violations = []

        with patch("sys.stderr", new_callable=StringIO) as mock_stderr:
            process_typescript_file(file_path, violations)
            self.assertIn("Error reading file", mock_stderr.getvalue())

        self.assertEqual(len(violations), 0)

    def test_handles_unicode_decode_error(self):
        """Test handling of files with encoding issues."""
        file_path = os.path.join(self.test_dir, "bad_encoding.tsx")
        # Create a file with invalid UTF-8
        with open(file_path, "wb") as f:
            f.write(b"\xff\xfe")

        violations = []
        with patch("sys.stderr", new_callable=StringIO) as mock_stderr:
            process_typescript_file(file_path, violations)
            output = mock_stderr.getvalue()
            self.assertIn("Error reading file", output)

        self.assertEqual(len(violations), 0)

    def test_appends_to_existing_violations_list(self):
        """Test that violations are appended to existing list."""
        file_path = os.path.join(self.test_dir, "test.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        existing_violation = DetailedViolation(
            file_path="other.tsx",
            line_number=1,
            violation_type="test",
            code_snippet="test",
            description="test",
        )
        violations = [existing_violation]

        process_typescript_file(file_path, violations)
        self.assertEqual(len(violations), 2)
        self.assertEqual(violations[0], existing_violation)


class TestCheckFiles(unittest.TestCase):
    """Test suite for check_files function."""

    def setUp(self):
        """Create temporary directory structure for tests."""
        self.test_dir = tempfile.mkdtemp()
        self.subdir = os.path.join(self.test_dir, "subdir")
        os.makedirs(self.subdir)

    def tearDown(self):
        """Clean up temporary directory."""
        shutil.rmtree(self.test_dir)

    def test_scans_directory_for_tsx_files(self):
        """Test scanning directory for .tsx files."""
        file_path = os.path.join(self.test_dir, "test.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        result = check_files([self.test_dir], [], [], [])
        self.assertEqual(len(result.violations), 1)

    def test_scans_directory_for_ts_files(self):
        """Test scanning directory for .ts files."""
        file_path = os.path.join(self.test_dir, "test.ts")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        result = check_files([self.test_dir], [], [], [])
        self.assertEqual(len(result.violations), 1)

    def test_scans_nested_directories(self):
        """Test scanning nested directories."""
        file_path = os.path.join(self.subdir, "nested.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        result = check_files([self.test_dir], [], [], [])
        self.assertEqual(len(result.violations), 1)

    def test_excludes_test_files_with_test_in_name(self):
        """Test that .test. files are excluded."""
        file_path = os.path.join(self.test_dir, "component.test.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        result = check_files([self.test_dir], [], [], [])
        self.assertEqual(len(result.violations), 0)

    def test_excludes_tests_directory(self):
        """Test that files in tests/ directory are excluded."""
        tests_dir = os.path.join(self.test_dir, "tests")
        os.makedirs(tests_dir)
        file_path = os.path.join(tests_dir, "test.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        result = check_files([self.test_dir], [], [], [])
        self.assertEqual(len(result.violations), 0)

    def test_excludes_test_directory(self):
        """Test that files in test/ directory are excluded."""
        test_dir = os.path.join(self.test_dir, "test")
        os.makedirs(test_dir)
        file_path = os.path.join(test_dir, "component.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        result = check_files([self.test_dir], [], [], [])
        self.assertEqual(len(result.violations), 0)

    def test_processes_explicit_file_list(self):
        """Test processing explicit list of files."""
        file_path = os.path.join(self.test_dir, "explicit.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        result = check_files([], [file_path], [], [])
        self.assertEqual(len(result.violations), 1)

    def test_excludes_specific_files(self):
        """Test excluding specific files."""
        file1 = os.path.join(self.test_dir, "include.tsx")
        file2 = os.path.join(self.test_dir, "exclude.tsx")

        with open(file1, "w") as f:
            f.write("const color = '#ff0000';")
        with open(file2, "w") as f:
            f.write("const color = '#00ff00';")

        result = check_files([self.test_dir], [], [file2], [])
        self.assertEqual(len(result.violations), 1)
        self.assertIn("include.tsx", result.violations[0].file_path)

    def test_excludes_directories(self):
        """Test excluding entire directories."""
        exclude_dir = os.path.join(self.test_dir, "exclude")
        os.makedirs(exclude_dir)

        file1 = os.path.join(self.test_dir, "include.tsx")
        file2 = os.path.join(exclude_dir, "exclude.tsx")

        with open(file1, "w") as f:
            f.write("const color = '#ff0000';")
        with open(file2, "w") as f:
            f.write("const color = '#00ff00';")

        result = check_files([self.test_dir], [], [], [exclude_dir])
        self.assertEqual(len(result.violations), 1)
        self.assertIn("include.tsx", result.violations[0].file_path)

    def test_ignores_non_typescript_files(self):
        """Test that non-TypeScript files are ignored."""
        js_file = os.path.join(self.test_dir, "test.js")
        py_file = os.path.join(self.test_dir, "test.py")

        with open(js_file, "w") as f:
            f.write("const color = '#ff0000';")
        with open(py_file, "w") as f:
            f.write("color = '#00ff00'")

        result = check_files([self.test_dir], [], [], [])
        self.assertEqual(len(result.violations), 0)

    def test_combines_directory_and_file_results(self):
        """Test combining results from directories and explicit files."""
        dir_file = os.path.join(self.test_dir, "dir.tsx")
        explicit_file = os.path.join(self.test_dir, "explicit.tsx")

        with open(dir_file, "w") as f:
            f.write("const color = '#ff0000';")
        with open(explicit_file, "w") as f:
            f.write("const bg = '#00ff00';")

        result = check_files([self.test_dir], [explicit_file], [], [])
        self.assertGreaterEqual(len(result.violations), 2)

    def test_returns_css_check_result(self):
        """Test that function returns CSSCheckResult object."""
        result = check_files([self.test_dir], [], [], [])
        self.assertIsInstance(result, CSSCheckResult)
        self.assertIsInstance(result.violations, list)

    def test_handles_absolute_paths(self):
        """Test that function handles absolute paths correctly."""
        file_path = os.path.join(self.test_dir, "test.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        abs_path = os.path.abspath(file_path)
        result = check_files([], [abs_path], [], [])
        self.assertEqual(len(result.violations), 1)


class TestValidateDirectoriesInput(unittest.TestCase):
    """Test suite for validate_directories_input function."""

    def setUp(self):
        """Create temporary directory and file for tests."""
        self.test_dir = tempfile.mkdtemp()
        self.test_file = os.path.join(self.test_dir, "test.tsx")
        with open(self.test_file, "w") as f:
            f.write("test")

    def tearDown(self):
        """Clean up temporary directory."""
        shutil.rmtree(self.test_dir)

    def test_validates_existing_directory(self):
        """Test validation of existing directory."""
        result = validate_directories_input([self.test_dir])
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0], self.test_dir)


class TestFormatViolationOutput(unittest.TestCase):
    """Test suite for format_violation_output function."""

    def test_empty_violations_returns_empty_string(self):
        """Test that empty violations list returns empty string."""
        result = format_violation_output([])
        self.assertEqual(result, "")

    def test_single_violation_output_format(self):
        """Test output format for single violation."""
        violation = DetailedViolation(
            file_path="/path/to/file.tsx",
            line_number=10,
            violation_type="hex_color",
            code_snippet="#ff0000",
            description="Hex color found",
        )
        result = format_violation_output([violation])

        self.assertIn("EMBEDDED CSS VIOLATIONS FOUND", result)
        self.assertIn("/path/to/file.tsx", result)
        self.assertIn("Line 10", result)
        self.assertIn("[hex_color]", result)
        self.assertIn("#ff0000", result)
        self.assertIn("Hex color found", result)
        self.assertIn("Total violations: 1", result)
        self.assertIn("Files affected: 1", result)

    def test_multiple_violations_same_file(self):
        """Test output format for multiple violations in same file."""
        violations = [
            DetailedViolation(
                file_path="/path/to/file.tsx",
                line_number=5,
                violation_type="hex_color",
                code_snippet="#ff0000",
                description="Hex color found",
            ),
            DetailedViolation(
                file_path="/path/to/file.tsx",
                line_number=10,
                violation_type="rgb_color",
                code_snippet="rgb(255,0,0)",
                description="RGB color found",
            ),
        ]
        result = format_violation_output(violations)

        self.assertIn("Total violations: 2", result)
        self.assertIn("Files affected: 1", result)
        self.assertIn("Line 5", result)
        self.assertIn("Line 10", result)

    def test_multiple_violations_different_files(self):
        """Test output format for violations across multiple files."""
        violations = [
            DetailedViolation(
                file_path="/path/to/file1.tsx",
                line_number=5,
                violation_type="hex_color",
                code_snippet="#ff0000",
                description="Hex color found",
            ),
            DetailedViolation(
                file_path="/path/to/file2.tsx",
                line_number=10,
                violation_type="rgb_color",
                code_snippet="rgb(255,0,0)",
                description="RGB color found",
            ),
        ]
        result = format_violation_output(violations)

        self.assertIn("Total violations: 2", result)
        self.assertIn("Files affected: 2", result)
        self.assertIn("file1.tsx", result)
        self.assertIn("file2.tsx", result)


class TestMain(unittest.TestCase):
    """Test suite for main function."""

    def setUp(self):
        """Set up test directory."""
        self.test_dir = tempfile.mkdtemp()

    def tearDown(self):
        """Clean up test directory."""
        shutil.rmtree(self.test_dir)

    def test_exits_with_code_0_when_no_violations(self):
        """Test that main exits with code 0 when no violations found."""
        file_path = os.path.join(self.test_dir, "clean.tsx")
        with open(file_path, "w") as f:
            f.write("const name = 'test';")

        test_args = ["css_check.py", "--directories", self.test_dir]

        with patch("sys.argv", test_args):
            with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
                with self.assertRaises(SystemExit) as cm:
                    main()
                self.assertEqual(cm.exception.code, 0)
                self.assertIn(
                    "No embedded CSS violations found", mock_stdout.getvalue()
                )

    def test_exits_with_code_1_when_violations_found(self):
        """Test that main exits with code 1 when violations found."""
        file_path = os.path.join(self.test_dir, "violation.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        test_args = ["css_check.py", "--directories", self.test_dir]

        with patch("sys.argv", test_args):
            with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
                with self.assertRaises(SystemExit) as cm:
                    main()
                self.assertEqual(cm.exception.code, 1)
                output = mock_stdout.getvalue()
                self.assertIn("EMBEDDED CSS VIOLATIONS FOUND", output)

    def test_requires_directories_or_files_argument(self):
        """Test that main requires at least one of --directories or --files."""
        test_args = ["css_check.py"]

        with patch("sys.argv", test_args):
            with patch("sys.stderr", new_callable=StringIO):
                with self.assertRaises(SystemExit) as cm:
                    main()
                self.assertEqual(cm.exception.code, 2)

    def test_accepts_files_argument(self):
        """Test that main accepts --files argument."""
        file_path = os.path.join(self.test_dir, "test.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        test_args = ["css_check.py", "--files", file_path]

        with patch("sys.argv", test_args):
            with patch("sys.stdout", new_callable=StringIO):
                with self.assertRaises(SystemExit) as cm:
                    main()
                self.assertEqual(cm.exception.code, 1)

    def test_handles_invalid_directory_input(self):
        """Test that main handles invalid directory input."""
        invalid_dir = os.path.join(self.test_dir, "nonexistent")
        test_args = ["css_check.py", "--directories", invalid_dir]

        with patch("sys.argv", test_args):
            with patch("sys.stderr", new_callable=StringIO) as mock_stderr:
                with self.assertRaises(SystemExit) as cm:
                    main()
                self.assertEqual(cm.exception.code, 1)
                self.assertIn("Error", mock_stderr.getvalue())

    def test_prints_formatted_output(self):
        """Test that main prints formatted violation output."""
        file_path = os.path.join(self.test_dir, "test.tsx")
        with open(file_path, "w") as f:
            f.write("const color = '#ff0000';")

        test_args = ["css_check.py", "--directories", self.test_dir]

        with patch("sys.argv", test_args):
            with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
                with self.assertRaises(SystemExit):
                    main()
                output = mock_stdout.getvalue()
                self.assertIn("EMBEDDED CSS VIOLATIONS FOUND", output)
                self.assertIn("Total violations:", output)
                self.assertIn("Files affected:", output)


class TestNamedTuples(unittest.TestCase):
    """Test suite for namedtuple definitions."""

    def test_detailed_violation_creation(self):
        """Test DetailedViolation namedtuple creation."""
        violation = DetailedViolation(
            file_path="/test.tsx",
            line_number=10,
            violation_type="hex_color",
            code_snippet="#ff0000",
            description="Test description",
        )

        self.assertEqual(violation.file_path, "/test.tsx")
        self.assertEqual(violation.line_number, 10)
        self.assertEqual(violation.violation_type, "hex_color")
        self.assertEqual(violation.code_snippet, "#ff0000")
        self.assertEqual(violation.description, "Test description")

    def test_css_check_result_creation(self):
        """Test CSSCheckResult namedtuple creation."""
        violations = [
            DetailedViolation(
                file_path="/test.tsx",
                line_number=10,
                violation_type="hex_color",
                code_snippet="#ff0000",
                description="Test",
            )
        ]

        result = CSSCheckResult(violations=violations)
        self.assertEqual(len(result.violations), 1)
        self.assertEqual(result.violations[0].file_path, "/test.tsx")


if __name__ == "__main__":
    unittest.main()
