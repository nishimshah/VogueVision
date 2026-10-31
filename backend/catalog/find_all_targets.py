import subprocess
import re
import requests
import json
import os

queries = {
    "top_pink_floral_puff": "pink-floral-crop-top",
    "top_cream_botanical": "floral-blouse-white",
    "top_dusty_rose_ruched": "pink-ruched-top",
    "top_crimson_floral": "red-floral-blouse",
    "top_white_embroidered": "white-embroidered-blouse",
    "top_lavender_ribbed": "purple-crop-top",
    "top_sage_linen_shirt": "sage-green-shirt",
    "top_sky_blue_ruffle": "blue-blouse-women",
    "bottom_light_blue_jeans": "light-blue-jeans",
    "bottom_ecru_pleated_trousers": "beige-pleated-trousers",
    "bottom_dark_indigo_jeans": "dark-blue-jeans-women",
    "bottom_ivory_pleated_skirt": "white-pleated-skirt",
    "bottom_rose_satin_skirt": "pink-satin-skirt",
    "dress_blush_floral_midi": "pink-floral-dress",
    "bag_ivory_structured": "white-leather-handbag",
    "bag_blush_crossbody": "pink-crossbody-bag",
    "bag_natural_straw_circle": "round-straw-bag",
    "bag_plum_burgundy_crescent": "burgundy-bag",
    "shoes_beige_block_sandals": "beige-block-heel-sandals",
    "shoes_lilac_pastel_mules": "lilac-heels"
}

def get_photos(query, count=4):
    cmd = ["curl", "-s", "-L", f"https://unsplash.com/s/photos/{query}"]
    try:
        out = subprocess.check_output(cmd, timeout=12).decode("utf-8")
    except Exception as e:
        return []
    matches = re.findall(r"https://images\.unsplash\.com/photo-([0-9a-zA-Z_-]+)\?", out)
    seen = set()
    res = []
    for m in matches:
        if m not in seen and len(m) > 10:
            seen.add(m)
            res.append(f"https://images.unsplash.com/photo-{m}")
            if len(res) >= count:
                break
    return res

results = {}
for key, q in queries.items():
    photos = get_photos(q, 3)
    results[key] = photos
    print(f"{key} ({q}): found {len(photos)}")
    for p in photos:
        print(f"  {p}")

with open("backend/catalog/search_results.json", "w") as f:
    json.dump(results, f, indent=2)
