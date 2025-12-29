"""Unit tests for check_python_deps.py."""

import unittest
from pathlib import Path
from unittest.mock import patch
from io import StringIO
import importlib.util


SCRIPT_DIR = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "check_python_deps",
    SCRIPT_DIR / "check_python_deps.py",
)

if SPEC is None or SPEC.loader is None:
    raise ImportError("Failed to load check_python_deps.py")

check_python_deps = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(check_python_deps)


class TestGetMissingDependencies(unittest.TestCase):
    """Tests for get_missing_dependencies()."""

    def test_returns_list(self):
        """Function should always return a list."""
        with patch("importlib.metadata.distributions") as mock_dist:
            # Mock some installed packages
            mock_pkg = unittest.mock.MagicMock()
            mock_pkg.metadata = {"Name": "existing-package"}
            mock_dist.return_value = [mock_pkg]
            with patch.object(
                check_python_deps,
                "REQUIREMENTS_FILE",
                unittest.mock.MagicMock(
                    exists=lambda: True, read_text=lambda: "test-package\n"
                ),
            ):
                result = check_python_deps.get_missing_dependencies()
                self.assertIsInstance(result, list)

    def test_exits_when_requirements_file_not_found(self):
        """Should exit with code 1 if requirements file doesn't exist."""
        with patch.object(
            check_python_deps, "REQUIREMENTS_FILE", Path("/nonexistent/path")
        ):
            with self.assertRaises(SystemExit) as cm:
                check_python_deps.get_missing_dependencies()
            self.assertEqual(cm.exception.code, 1)

    def test_skips_comments_and_blank_lines(self):
        """Should ignore comments and blank lines in requirements."""
        with patch("importlib.metadata.distributions", return_value=[]):
            with patch.object(
                check_python_deps,
                "REQUIREMENTS_FILE",
                unittest.mock.MagicMock(
                    exists=lambda: True,
                    read_text=lambda: "# comment\n\npackage==1.0\n",
                ),
            ):
                result = check_python_deps.get_missing_dependencies()
                self.assertEqual(result, ["package"])

    def test_extracts_package_name_from_version_specifier(self):
        """Should extract package name from lines with version specs."""
        with patch("importlib.metadata.distributions", return_value=[]):
            with patch.object(
                check_python_deps,
                "REQUIREMENTS_FILE",
                unittest.mock.MagicMock(
                    exists=lambda: True,
                    read_text=lambda: "requests>=2.0.0\nnumpy==1.21.0",
                ),
            ):
                result = check_python_deps.get_missing_dependencies()
                self.assertIn("requests", result)
                self.assertIn("numpy", result)

    def test_handles_package_extras(self):
        """Should extract base package name from extras syntax."""
        with patch("importlib.metadata.distributions", return_value=[]):
            with patch.object(
                check_python_deps,
                "REQUIREMENTS_FILE",
                unittest.mock.MagicMock(
                    exists=lambda: True,
                    read_text=lambda: "requests[security]>=2.0\n",
                ),
            ):
                result = check_python_deps.get_missing_dependencies()
                self.assertIn("requests", result)


class TestMain(unittest.TestCase):
    """Tests for main()."""

    def test_exits_with_error_when_dependencies_missing(self):
        """main() should exit with code 1 if deps are missing."""
        with patch.object(
            check_python_deps,
            "get_missing_dependencies",
            return_value=["fake-package"],
        ):
            with self.assertRaises(SystemExit) as cm:
                check_python_deps.main()
            self.assertEqual(cm.exception.code, 1)

    def test_exits_with_error_when_multiple_dependencies_missing(self):
        """main() should exit with code 1 if multiple deps are missing."""
        with patch.object(
            check_python_deps,
            "get_missing_dependencies",
            return_value=["fake-package", "another-package", "third-package"],
        ):
            with self.assertRaises(SystemExit) as cm:
                check_python_deps.main()
            self.assertEqual(cm.exception.code, 1)

    def test_does_not_exit_when_no_dependencies_missing(self):
        """main() should not exit when all deps are installed."""
        with patch.object(
            check_python_deps,
            "get_missing_dependencies",
            return_value=[],
        ):
            try:
                check_python_deps.main()
            except SystemExit:
                self.fail(
                    "main() exited unexpectedly when no deps were missing"
                )

    def test_prints_error_message_when_missing(self):
        """Error message should be printed for missing dependencies."""
        with patch.object(
            check_python_deps,
            "get_missing_dependencies",
            return_value=["missing-lib"],
        ):
            with patch("sys.stdout", new_callable=StringIO) as mock_stdout:
                with self.assertRaises(SystemExit):
                    check_python_deps.main()
                output = mock_stdout.getvalue()
                self.assertIn("Missing required Python dependencies", output)
                self.assertIn("missing-lib", output)
                self.assertIn("pip install -r", output)


if __name__ == "__main__":
    unittest.main()
