import os
import glob

content_dir = "content"
md_files = glob.glob(f"{content_dir}/**/*.md", recursive=True)

print("Current MD files:")
for f in md_files:
    print(f)

# Files that should NOT be renamed to .es.md:
# 1. _index.md (usually Hugo needs it as _index.es.md if localized, but let's see)
# 2. Files already ending in .es.md or .en.md

to_rename = []
for f in md_files:
    if f.endswith(".es.md") or f.endswith(".en.md"):
        continue
    # skip _index.md unless it's supposed to be localized.
    # In Decap, blog, events, podcast, sponsors have i18n: true, so their files should be .es.md
    if f.endswith("_index.md"):
        # Let's check if the directory needs _index.es.md
        # If the user hasn't configured it in Decap, it might not matter.
        continue
    to_rename.append(f)

print("\nFiles to rename to .es.md:")
for f in to_rename:
    print(f)
