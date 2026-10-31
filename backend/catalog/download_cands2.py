import json
import os
import requests
import cv2
import numpy as np

with open("backend/catalog/search_results.json") as f:
    search_results = json.load(f)

# Add straw bag
search_results["bag_natural_straw_circle"] = [
    "https://images.unsplash.com/photo-1524679813234-66a389fe1a42",
    "https://images.unsplash.com/photo-1694766942127-3c26783c4888"
]

os.makedirs("backend/catalog/cands2", exist_ok=True)

headers = {"User-Agent": "Mozilla/5.0"}

for key, urls in search_results.items():
    print(f"Downloading {key} ({len(urls)} items)...")
    for i, u in enumerate(urls):
        fname = f"backend/catalog/cands2/{key}_{i}.jpg"
        if os.path.exists(fname):
            continue
        try:
            r = requests.get(f"{u}?w=600&auto=format&fit=crop&q=80", headers=headers, timeout=8)
            if r.status_code == 200:
                with open(fname, "wb") as f:
                    f.write(r.content)
                print(f"  Saved {fname}")
        except Exception as e:
            print(f"  Error on {u}: {e}")

print("Done downloading cands2.")
