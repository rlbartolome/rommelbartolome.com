#!/usr/bin/env python3
"""Download all images listed in images.json into the repo so the site is
fully self-contained. Run once (the vendor-images GitHub Action does this
automatically on first push)."""
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
manifest = json.load(open(os.path.join(ROOT, "images.json")))

failures = []
for local_path, url in manifest.items():
    dest = os.path.join(ROOT, local_path)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        print(f"skip (exists): {local_path}")
        continue
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as f:
            f.write(r.read())
        print(f"downloaded: {local_path}")
    except Exception as e:
        failures.append((local_path, str(e)))
        print(f"FAILED: {local_path}: {e}", file=sys.stderr)

if failures:
    print(f"\n{len(failures)} downloads failed.", file=sys.stderr)
    sys.exit(1)
print("\nAll images vendored.")
