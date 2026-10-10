"""Prepare GitHub Pages with content-based stylesheet and script filenames."""

import hashlib
import json
from pathlib import Path
import re
import shutil


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ("styles.css", "math.js", "theme.js", "landscape.js")


def build_site(destination):
    destination.mkdir(parents=True, exist_ok=True)
    for name in (
        "index.html", "writing.html", "favicon.svg",
        "robots.txt", "sitemap.xml", ".nojekyll",
    ):
        shutil.copy2(ROOT / name, destination / name)
    for name in ("posts", "profile-pic", "slides"):
        shutil.copytree(ROOT / name, destination / name, dirs_exist_ok=True)

    manifest = {}
    for name in ASSETS:
        # Normalize line endings so Windows and Linux produce identical assets.
        content = (ROOT / name).read_text(encoding="utf-8").encode("utf-8")
        digest = hashlib.sha256(content).hexdigest()[:12]
        asset = Path(name)
        versioned = f"{asset.stem}.{digest}{asset.suffix}"
        (destination / versioned).write_bytes(content)
        (destination / name).write_bytes(content)
        manifest[name] = versioned

    references = re.compile(
        r'(?P<prefix>\b(?:href|src)="(?:\.\./)*)'
        r'(?P<asset>' + "|".join(re.escape(name) for name in ASSETS) + r')'
        r'(?:\?[^"]*)?"'
    )
    for page in destination.rglob("*.html"):
        content = page.read_text(encoding="utf-8")
        content = references.sub(
            lambda match: match["prefix"] + manifest[match["asset"]] + '"',
            content,
        )
        page.write_text(content, encoding="utf-8", newline="\n")

    (destination / "asset-manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8", newline="\n"
    )
    return manifest


if __name__ == "__main__":
    manifest = build_site(ROOT / "_site")
    print(json.dumps(manifest, indent=2))
