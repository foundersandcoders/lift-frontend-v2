#!/usr/bin/env python3
import os

# Directories to exclude (won't be recursed into) - comparison done case-insensitively.
EXCLUDE_DIRS = {"node_modules", ".git", ".github", "dist"}

# Files to exclude (by exact name, case-insensitive)
EXCLUDE_FILES = {
    ".gitignore",
    "package.json",
    "tsconfig.json",
    "tailwind.config.js",
    "tailwind.config.ts",
    "vite.config.js",
    "vite.config.ts",
    ".prettierrc",
    ".prettierrc.json",
    ".prettierrc.js",
    ".env.development",
    "package-lock.json",
    "allcode.py",
    "readme.md",
    "allcode.txt",
    ".env.development",
    "vite-env.d.ts",
}


def is_excluded_file(filename):
    """
    Check if a file should be excluded.
    - Matches the exclusion list (case-insensitive)
    - Ignores any file whose name contains 'config' (case-insensitive)
    """
    lower_name = filename.lower()
    if lower_name in EXCLUDE_FILES:
        return True
    if "config" in lower_name:
        return True
    return False


def main():
    output_filename = "allcode.txt"
    with open(output_filename, "w", encoding="utf-8") as outfile:
        # Walk the project starting at the current directory ('.')
        for root, dirs, files in os.walk("."):
            # Exclude specified directories (case-insensitive)
            dirs[:] = [d for d in dirs if d.lower() not in EXCLUDE_DIRS]

            for file in files:
                if is_excluded_file(file):
                    continue  # Skip excluded files

                full_path = os.path.join(root, file)
                # Get the relative path with forward slashes for consistency
                relative_path = os.path.relpath(full_path, ".").replace(os.sep, "/")

                # Write the file header.
                outfile.write(f"{relative_path}:\n")

                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        # Check if this is a JSON file inside a 'data' folder.
                        path_parts = os.path.normpath(relative_path).split(os.sep)
                        is_data_json = file.lower().endswith(".json") and any(
                            part.lower() == "data" for part in path_parts[:-1]
                        )

                        if is_data_json:
                            # Read only the first 10 lines.
                            lines = []
                            for i in range(10):
                                line = f.readline()
                                if not line:
                                    break
                                lines.append(line.rstrip("\n"))
                            content = "\n".join(lines)
                            # If there's more content, append an ellipsis.
                            if f.readline():
                                content += "\n..."
                        else:
                            content = f.read()
                except UnicodeDecodeError:
                    content = "[Error reading file: binary or non-UTF-8 content]"
                except Exception as e:
                    content = f"[Error reading file: {e}]"

                # Indent each line of the content by 4 spaces.
                indented_content = "\n".join(
                    "    " + line for line in content.splitlines()
                )
                outfile.write(indented_content + "\n\n")

    print(f"All code has been collected into '{output_filename}'.")


if __name__ == "__main__":
    main()
