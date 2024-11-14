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
NOTE:
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
from collections import namedtuple

# Named tuple for file and missing
#   translations combination
FileTranslation = namedtuple("FileTranslation",
                    ["file", "missing_translations"])


def compare_translations(default_translation,
    other_translation, default_file, other_file):
    """Compare two translations and return detailed info about missing/mismatched keys.

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

    # Check for missing keys in other_translation
    for key in default_translation:
        if key not in other_translation:
            error_msg = f"Missing Key: '{key}' - This key from '{default_file}' is missing in '{other_file}'."
            errors.append(error_msg)
    # Check for keys in other_translation that don't match any in default_translation
    for key in other_translation:
        if key not in default_translation:
            error_msg = f"Error Key: '{key}' - This key in '{other_file}' does not match any key in '{default_file}'."
            errors.append(error_msg)
    return errors

def flatten_json(nested_json, parent_key=""):
    """
    Flattens a nested JSON, concatenating keys to represent the hierarchy.

    Args:
        nested_json (dict): The JSON object to flatten.
        parent_key (str): The base key for recursion (used to track key hierarchy).

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
                default_translation, other_translation, f"en/{file}", f"{language}/{file}"
            )
            if errors:
                error_found = True
                print(f"File {language}/{file} has missing translations for:")
                for error in errors:
                    print(f"  - {error}")


    if error_found:
        sys.exit(1)  # Exit with an error status code
    else:
        print("All translations are present")
        sys.exit(0)


def main():
    """

    Parse command-line arguments, check for the existence of the specified directory 
    and call check_translations with the provided or default directory.

    """
    parser = argparse.ArgumentParser(
        description="Check and print missing translations for all non-default languages."
    )
    parser.add_argument(
        "--directory",
        type=str,
        nargs="?",
        default=os.path.join(os.getcwd(), "public/locales"),
        help="Directory containing translation files(relative to the root directory).",
    )
    args = parser.parse_args()

    if not os.path.exists(args.directory):
        print(f"Error: The specified directory '{args.directory}' does not exist.")
        sys.exit(1)

    check_translations(args.directory)


if __name__ == "__main__":
    main()
