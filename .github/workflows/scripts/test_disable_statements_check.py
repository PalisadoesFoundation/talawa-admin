#!/usr/bin/env python3
"""Test suite for disable_statements_check.py."""

import os
import re
import sys
import tempfile
import unittest
from unittest.mock import patch
from io import StringIO

# Add the script directory to path for imports
sys.path.insert(0, os.path.dirname(__file__))
from disable_statements_check import DisableStatementsChecker, arg_parser_resolver, main


class TestDisableStatementsChecker(unittest.TestCase):
    """Test cases for DisableStatementsChecker class."""

    def setUp(self):
        """Set up test fixtures."""
        self.checker = DisableStatementsChecker()

    def test_init(self):
        """Test checker initialization."""
        self.assertFalse(self.checker.violations_found)

    def test_eslint_disable_detection(self):
        """Test eslint-disable pattern detection."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
            f.write('// eslint-disable-next-line\nconst x = 1;')
            f.flush()
            temp_name = f.name
            
        try:
            with patch('builtins.print') as mock_print:
                self.checker.check_eslint_disable(temp_name)
                
            self.assertTrue(self.checker.violations_found)
            mock_print.assert_called_once()
        finally:
            os.unlink(temp_name)

    def test_istanbul_ignore_detection(self):
        """Test istanbul ignore pattern detection."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
            f.write('/* istanbul ignore next */\nconst x = 1;')
            f.flush()
            temp_name = f.name
            
        try:
            with patch('builtins.print') as mock_print:
                self.checker.check_istanbul_ignore(temp_name)
                
            self.assertTrue(self.checker.violations_found)
            mock_print.assert_called_once()
        finally:
            os.unlink(temp_name)

    def test_it_skip_detection(self):
        """Test it.skip pattern detection."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
            f.write('  it.skip("test", () => {});')
            f.flush()
            temp_name = f.name
            
        try:
            with patch('builtins.print') as mock_print:
                self.checker.check_it_skip(temp_name)
                
            self.assertTrue(self.checker.violations_found)
            mock_print.assert_called_once()
        finally:
            os.unlink(temp_name)

    def test_it_skip_at_start_of_line(self):
        """Test it.skip at column 0."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
            f.write('it.skip("test", () => {});')
            f.flush()
            temp_name = f.name
            
        try:
            with patch('builtins.print') as mock_print:
                self.checker.check_it_skip(temp_name)
                
            self.assertTrue(self.checker.violations_found)
            mock_print.assert_called_once()
        finally:
            os.unlink(temp_name)

    def test_clean_file(self):
        """Test file with no violations."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
            f.write('const x = 1;\nfunction test() { return x; }')
            f.flush()
            temp_name = f.name
            
        try:
            self.checker._run_all_checks(temp_name)
            
            self.assertFalse(self.checker.violations_found)
        finally:
            os.unlink(temp_name)

    def test_is_typescript_file(self):
        """Test TypeScript file detection."""
        self.assertTrue(self.checker._is_typescript_file('file.ts'))
        self.assertTrue(self.checker._is_typescript_file('file.tsx'))
        self.assertFalse(self.checker._is_typescript_file('file.test.ts'))
        self.assertFalse(self.checker._is_typescript_file('file.spec.tsx'))
        self.assertFalse(self.checker._is_typescript_file('file.js'))

    def test_auto_discovery(self):
        """Test automatic method discovery."""
        import inspect
        methods = [
            name for name, _ in inspect.getmembers(self.checker, predicate=inspect.ismethod)
            if name.startswith('check_') and not name.startswith('check_files')
        ]
        
        expected_methods = ['check_eslint_disable', 'check_istanbul_ignore', 'check_it_skip']
        for expected in expected_methods:
            self.assertIn(expected, methods)

    def test_file_not_found_error(self):
        """Test handling of non-existent files."""
        pattern = re.compile(r"test")
        with patch('builtins.print') as mock_print:
            self.checker._check_pattern('nonexistent.ts', pattern, 'test')
            mock_print.assert_called_with('File not found: nonexistent.ts')

    def test_directory_processing(self):
        """Test directory processing."""
        with tempfile.TemporaryDirectory() as temp_dir:
            # Create test files
            ts_file = os.path.join(temp_dir, 'test.ts')
            with open(ts_file, 'w') as f:
                f.write('const x = 1;')
            
            test_file = os.path.join(temp_dir, 'test.test.ts')
            with open(test_file, 'w') as f:
                f.write('// eslint-disable')
            
            self.checker.check_files_or_directories([temp_dir])
            
            # Should not find violations (test files are excluded)
            self.assertFalse(self.checker.violations_found)


class TestArgParser(unittest.TestCase):
    """Test cases for argument parser."""

    def test_default_args(self):
        """Test default argument parsing."""
        with patch('sys.argv', ['script.py']):
            args = arg_parser_resolver()
            self.assertEqual(args.files, [])
            self.assertEqual(args.directory, [os.getcwd()])

    def test_files_arg(self):
        """Test files argument parsing."""
        with patch('sys.argv', ['script.py', '--files', 'file1.ts', 'file2.ts']):
            args = arg_parser_resolver()
            self.assertEqual(args.files, ['file1.ts', 'file2.ts'])

    def test_directory_arg(self):
        """Test directory argument parsing."""
        with patch('sys.argv', ['script.py', '--directory', 'src', 'test']):
            args = arg_parser_resolver()
            self.assertEqual(args.directory, ['src', 'test'])


class TestMainFunction(unittest.TestCase):
    """Test cases for main function."""

    def test_main_success(self):
        """Test main function with no violations."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
            f.write('const x = 1;')
            f.flush()
            temp_name = f.name
            
        try:
            with patch('sys.argv', ['script.py', '--files', temp_name]):
                with patch('sys.stdout', new_callable=StringIO) as mock_stdout:
                    main()
                    
            self.assertIn('completed successfully', mock_stdout.getvalue())
        finally:
            os.unlink(temp_name)

    def test_main_failure(self):
        """Test main function with violations."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
            f.write('// eslint-disable')
            f.flush()
            temp_name = f.name
            
        try:
            with patch('sys.argv', ['script.py', '--files', temp_name]):
                with self.assertRaises(SystemExit) as cm:
                    main()
                    
            self.assertEqual(cm.exception.code, 1)
        finally:
            os.unlink(temp_name)


if __name__ == '__main__':
    unittest.main()
