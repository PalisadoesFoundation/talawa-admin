"""Tests for the translation_check module."""

import unittest
import os
import sys
import json
import shutil
import tempfile
import subprocess
import importlib.util
from pathlib import Path
from unittest.mock import patch

SCRIPT_DIR = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "translation_check",
    SCRIPT_DIR / "translation_check.py",
)
translation_check = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(translation_check)


class TestTranslationCheck(unittest.TestCase):
    """Unit test suite for i18n tag validation logic."""

    def setUp(self):
        """Initialize temporary environment for tests."""
        self.test_dir = tempfile.mkdtemp()
        self.locales_dir = os.path.join(self.test_dir, "locales")
        os.makedirs(self.locales_dir)
        self.en_dir = os.path.join(self.locales_dir, "en")
        os.makedirs(self.en_dir)

        self.common_json = os.path.join(self.en_dir, "common.json")
        with open(self.common_json, "w", encoding="utf-8") as f:
            json.dump({"login": "Login", "auth": {"signup": "Sign Up"}}, f)

    def tearDown(self):
        """Cleanup temporary environment."""
        shutil.rmtree(self.test_dir)

    def test_get_keys_recursion(self):
        """Verify recursive extraction of nested keys."""
        self.assertEqual(
            translation_check.get_translation_keys({"a": {"b": "c"}}),
            {"a.b"},
        )

    def test_load_locales_success(self):
        """Verify successful loading of valid locale keys."""
        keys = translation_check.load_locale_keys(self.en_dir)
        self.assertIn("login", keys)

    def test_load_locales_malformed(self):
        """Verify handling of malformed JSON."""
        with open(os.path.join(self.en_dir, "translation.json"), "w") as f:
            f.write("{invalid}")
        self.assertIn("login", translation_check.load_locale_keys(self.en_dir))

    def test_load_locales_not_found(self):
        """Verify exception on invalid locale path."""
        with self.assertRaises(FileNotFoundError):
            translation_check.load_locale_keys("/invalid/path")

    def test_find_tags_string(self):
        """Verify tag extraction from string."""
        self.assertEqual(
            translation_check.find_translation_tags("t('key')"),
            {"key"},
        )

    def test_find_tags_path(self):
        """Verify tag extraction from file path."""
        p = Path(self.test_dir) / "t.tsx"
        p.write_text("t('key')", encoding="utf-8")
        self.assertEqual(
            translation_check.find_translation_tags(p),
            {"key"},
        )

    def test_find_tags_namespace(self):
        """Verify extraction of namespaced keys."""
        self.assertEqual(
            translation_check.find_translation_tags("t('common:key')"),
            {"key"},
        )

    def test_find_tags_io_error(self):
        """Verify handling of inaccessible files."""
        tags = translation_check.find_translation_tags(Path(self.test_dir))
        self.assertEqual(len(tags), 0)

    def test_find_tags_dynamic_ignored(self):
        """Verify dynamic variables are ignored."""
        self.assertEqual(
            len(translation_check.find_translation_tags("t(var)")),
            0,
        )

    def test_get_files_directory(self):
        """Verify directory scanning."""
        src = Path(self.test_dir) / "src"
        src.mkdir()
        (src / "app.tsx").touch()
        self.assertEqual(
            len(
                translation_check.get_target_files(None, [str(src)], [".tsx"])
            ),
            0,
        )

    def test_get_files_exclude_spec(self):
        """Verify spec/test file exclusion."""
        src = Path(self.test_dir) / "src"
        src.mkdir(exist_ok=True)
        (src / "app.spec.tsx").touch()
        self.assertEqual(
            len(
                translation_check.get_target_files(None, [str(src)], [".tsx"])
            ),
            0,
        )

    def test_get_files_explicit(self):
        """Verify explicit file selection."""
        f = os.path.join(self.test_dir, "f.ts")
        Path(f).touch()
        self.assertEqual(
            len(translation_check.get_target_files([f], None, [".ts"])),
            0,
        )

    def test_main_success_flow(self):
        """Verify exit code 0 on successful validation."""
        with patch(
            "sys.argv",
            [
                "translation_check.py",
                "--locales-dir",
                self.en_dir,
                "--directories",
                self.test_dir,
            ],
        ):
            with self.assertRaises(SystemExit) as cm:
                translation_check.main()
            self.assertEqual(cm.exception.code, 0)

    def test_main_missing_flow(self):
        """Verify exit code 1 when missing keys are found."""
        p = Path(self.test_dir) / "e.tsx"
        p.write_text("t('missing')", encoding="utf-8")

        with patch(
            "sys.argv",
            [
                "translation_check.py",
                "--locales-dir",
                self.en_dir,
                "--files",
                str(p),
            ],
        ):
            with self.assertRaises(SystemExit) as cm:
                translation_check.main()
            self.assertEqual(cm.exception.code, 1)

    def test_main_error_flow(self):
        """Verify exit code 2 on configuration error."""
        with patch(
            "sys.argv",
            ["translation_check.py", "--locales-dir", "/invalid"],
        ):
            with self.assertRaises(SystemExit) as cm:
                translation_check.main()
            self.assertEqual(cm.exception.code, 2)

    def test_entry_point_subprocess(self):
        """Verify the actual __main__ entry point using a subprocess."""
        script_path = SCRIPT_DIR / "translation_check.py"
        result = subprocess.run(
            [
                sys.executable,
                str(script_path),
                "--locales-dir",
                self.en_dir,
                "--directories",
                self.test_dir,
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0)
        self.assertIn(
            "All translation tags validated successfully",
            result.stdout,
        )


if __name__ == "__main__":
    unittest.main()
