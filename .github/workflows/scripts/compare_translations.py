"""Script to encourage more efficient coding practices.

Methodology:

    Utility for comparing translations between default and other languages.

    This module defines a function to compare two translations
    and print any missing keys in the other language's translation.

Attributes:
    FileTranslation : Named tuple to represent a combination
                        of file and missing translations.

        Fields:
            - file (str): The file name.
            - missing_translations (list): List of missing translations.

Functions:
    compare_translations(default_translation, other_translation):
        Compare two translations and print missing keys.

     load_translation(filepath):
        Load translation from a file.

    check_translations():
        Load the default translation and compare it with other translations.

     main():
        The main function to run the script.
        Parses command-line arguments, checks for the
        existence of the specified directory, and then
        calls check_translations with the provided or default directory.


Usage:
    This script can be executed to check and print missing
    translations in other languages based on the default English translation.

Example:
    python compare_translations.py

Note:
    This script complies with our python3 coding and documentation standards
    and should be used as a reference guide. It complies with:

        1) Pylint
        2) Pydocstyle
        3) Pycodestyle
        4) Flake8

"""

# standard imports
import argparse
import json
import os
import sys
import re
from collections import namedtuple

# Named tuple for file and missing
#   translations combination
FileTranslation = namedtuple(
    "FileTranslation", ["file", "missing_translations"]
)


def compare_translations(
    default_translation, other_translation, default_file, other_file
):
    """Compare two translations for missing and/or mismatched keys.

    Args:
        default_translation (dict): The default translation (en.json).
        other_translation (dict): The other language translation.
        default_file (str): The name of the default translation file.
        other_file (str): The name of the other
                            translation file.

    Returns:
        list: A list of detailed error messages for each missing/mismatched key.
    """
    errors = []

    # Extract and match interpolation vars (ex: {{name}})
    def _extract_interpolation_vars(text):
        """Extract interpolation variables like {{variable}} from text.

        Args:
            text (str): The text to extract variables from.

        Returns:
            set: A set of variable names found in the text.
        """
        return set(re.findall(r"\{\{(\w+)\}\}", text))

    def _check_interpolation_match(default_val, other_val, key):
        """Check if interpolation variables match between translations.

        Args:
            default_val (str): The default translation value.
            other_val (str): The other translation value.
            key (str): The translation key being checked.

        Returns:
            None: Modifies the errors list in outer scope.
        """
        default_vars = _extract_interpolation_vars(default_val)
        other_vars = _extract_interpolation_vars(other_val)

        if default_vars != other_vars:
            missing_vars = default_vars - other_vars
            extra_vars = other_vars - default_vars

            if missing_vars:
                errors.append(
                    f"Missing interpolation variables in key '{key}' in "
                    f"'{other_file}': "
                    f"{', '.join('{{' + var + '}}' for var in missing_vars)}"
                )
            if extra_vars:
                errors.append(
                    f"Extra interpolation variables in key '{key}' in "
                    f"'{other_file}': "
                    f"{', '.join('{{' + var + '}}' for var in extra_vars)}"
                )

    # Get all unique keys from both translations
    all_keys = set(default_translation.keys()) | set(other_translation.keys())

    for key in all_keys:
        # Check if key is missing in other_translation
        if key not in other_translation:
            error_msg = f"""\
Missing Key: '{key}' - This key from '{default_file}' \
is missing in '{other_file}'."""
            errors.append(error_msg)
            continue

        # Check for missing keys in default_translation
        if key not in default_translation:
            error_msg = f"""\
Error Key: '{key}' - This key in '{other_file}' \
does not match any key in '{default_file}'."""
            errors.append(error_msg)
            continue

        # Check for empty/null values
        if default_translation[key] == "" or default_translation[key] is None:
            error_msg = f"""\
Empty value: '{key}' - This key in '{default_file}' \
has incorrect value."""
            errors.append(error_msg)

        if other_translation[key] == "" or other_translation[key] is None:
            error_msg = f"""\
Empty value: '{key}' - This key in '{other_file}' \
has incorrect value."""
            errors.append(error_msg)

        # Check interpolation match
        if (
            isinstance(default_translation[key], str)
            and default_translation[key]
            and isinstance(other_translation[key], str)
            and other_translation[key]
        ):
            _check_interpolation_match(
                default_translation[key], other_translation[key], key
            )

    return errors


def flatten_json(nested_json, parent_key=""):
    """Flattens a nested JSON, concatenating keys to represent the hierarchy.

    Args:
        nested_json (dict): The JSON object to flatten.
        parent_key (str): The base key for recursion to track key hierarchy.

    Returns:
        dict: A flattened dictionary with concatenated keys.
    """
    flat_dict = {}

    for key, value in nested_json.items():
        # Create the new key by concatenating parent and current key
        new_key = f"{parent_key}.{key}" if parent_key else key

        if isinstance(value, dict):
            # Recursively flatten the nested dictionary
            flat_dict.update(flatten_json(value, new_key))
        else:
            # Assign the value to the flattened key
            flat_dict[new_key] = value

    return flat_dict


def load_translation(filepath):
    """Load translation from a file.

    Args:
        filepath: Path to the translation file

    Returns:
        translation: Loaded translation
    """
    try:
        with open(filepath, "r", encoding="utf-8") as file:
            content = file.read()
            if not content.strip():
                raise ValueError(f"File {filepath} is empty.")
            translation = json.loads(content)
            flattened_translation = flatten_json(translation)
        return flattened_translation
    except json.JSONDecodeError as e:
        raise ValueError(f"Error decoding JSON from file {filepath}: {e}")


def check_translations(directory):
    """Load default translation and compare with other translations.

    Args:
        directory (str): The directory containing translation files.

    Returns:
        None
    """
    default_language_dir = os.path.join(directory, "en")
    default_files = ["common.json", "errors.json", "translation.json"]
    default_translations = {}
    for file in default_files:
        file_path = os.path.join(default_language_dir, file)
        default_translations[file] = load_translation(file_path)

    languages = os.listdir(directory)
    languages.remove("en")  # Exclude default language directory

    error_found = False

    for language in languages:
        language_dir = os.path.join(directory, language)
        for file in default_files:
            default_translation = default_translations[file]
            other_file_path = os.path.join(language_dir, file)
            other_translation = load_translation(other_file_path)

            # Compare translations and get detailed error messages
            errors = compare_translations(
                default_translation,
                other_translation,
                f"en/{file}",
                f"{language}/{file}",
            )
            if errors:
                error_found = True
                print(f"File {language}/{file} has missing translations for:")
                for error in errors:
                    print(f"  - {error}")

    if error_found:
        sys.exit(1)  # Exit with an error status code
    else:
        print("All translations are present with correct interpolations.")
        sys.exit(0)


def main():
    """Compare translations.

    Parse command-line arguments, check for the existence of the specified
    directory and call check_translations with the provided or default
    directory.

    Args:
        None

    Returns:
        None

    """
    # Initialize key variables
    parser = argparse.ArgumentParser(description="""\
Check and print missing translations for all non-default languages.""")
    parser.add_argument(
        "--directory",
        type=str,
        nargs="?",
        default=os.path.join(os.getcwd(), "public/locales"),
        help="""\
Directory containing translation files(relative to the root directory).""",
    )
    args = parser.parse_args()

    if not os.path.exists(args.directory):
        print(
            f"Error: The specified directory '{args.directory}' does not exist."
        )
        sys.exit(1)

    check_translations(args.directory)


if __name__ == "__main__":
    main()
