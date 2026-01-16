#!/usr/bin/env python3
"""Unit tests for sensitive_file_check.py."""

import unittest
import tempfile
import os
import sys
import shutil
from unittest.mock import patch, MagicMock
from io import StringIO

# Add parent directory to path to import script
sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

from sensitive_file_check import load_patterns, check_files, main


class TestSensitiveFileCheck(unittest.TestCase):
    """Test suite for sensitive_file_check.py."""

    def setUp(self):
        """Create temporary directory for test files."""
        self.test_dir = tempfile.mkdtemp()
        self.config_file = os.path.join(self.test_dir, "sensitive_files.txt")
        with open(self.config_file, "w") as f:
            f.write(".*secret.*\n")
            f.write("# This is a comment\n")
            f.write(r"config\.json" + "\n")

    def tearDown(self):
        """Clean up temporary directory."""
        shutil.rmtree(self.test_dir)

    def test_load_patterns_valid(self):
        """Test loading patterns from a valid configuration file."""
        patterns = load_patterns(self.config_file)
        self.assertIn(".*secret.*", patterns)
        self.assertIn(r"config\.json", patterns)
        self.assertNotIn("# This is a comment", patterns)
        self.assertEqual(len(patterns), 2)

    def test_load_patterns_file_not_found(self):
        """Test loading patterns from a non-existent file."""
        with self.assertRaises(SystemExit) as cm:
            load_patterns("non_existent_file.txt")
        self.assertEqual(cm.exception.code, 1)

    def test_check_files_sensitive_found(self):
        """Test detection of sensitive files."""
        patterns = [".*secret.*"]
        files = ["path/to/my_secret_file.txt", "path/to/normal_file.txt"]
        sensitive_files = check_files(files, [], patterns)
        self.assertIn("path/to/my_secret_file.txt", sensitive_files)
        self.assertNotIn("path/to/normal_file.txt", sensitive_files)
        self.assertEqual(len(sensitive_files), 1)

    def test_check_files_no_sensitive(self):
        """Test when no sensitive files are present."""
        patterns = [".*secret.*"]
        files = ["path/to/normal_file.txt"]
        sensitive_files = check_files(files, [], patterns)
        self.assertEqual(len(sensitive_files), 0)

    def test_check_directories_recursion(self):
        """Test directory recursion for checking files."""
        subdir = os.path.join(self.test_dir, "subdir")
        os.makedirs(subdir)
        secret_file = os.path.join(subdir, "secret_config.json")
        with open(secret_file, "w") as f:
            f.write("secret data")

        patterns = [".*secret.*"]
        sensitive_files = check_files([], [self.test_dir], patterns)

        # Normalize paths for comparison
        sensitive_files = [
            f.replace(os.path.sep, "/") for f in sensitive_files
        ]
        expected_file = secret_file.replace(os.path.sep, "/")

        self.assertIn(expected_file, sensitive_files)

    @patch("argparse.ArgumentParser.parse_args")
    def test_main_no_sensitive_files(self, mock_args):
        """Test main function when no sensitive files are found."""
        mock_args.return_value = MagicMock(
            config=self.config_file, files=["normal_file.txt"], directories=[]
        )

        with self.assertRaises(SystemExit) as cm:
            main()
        self.assertEqual(cm.exception.code, 0)

    @patch("argparse.ArgumentParser.parse_args")
    def test_main_sensitive_files_found(self, mock_args):
        """Test main function when sensitive files are found."""
        mock_args.return_value = MagicMock(
            config=self.config_file, files=["my_secret.txt"], directories=[]
        )

        # Capture stdout to verify error message
        with patch("sys.stdout", new=StringIO()) as fake_out:
            with self.assertRaises(SystemExit) as cm:
                main()
            self.assertEqual(cm.exception.code, 1)
            self.assertIn(
                "::error::Unauthorized changes detected", fake_out.getvalue()
            )


if __name__ == "__main__":
    unittest.main()
