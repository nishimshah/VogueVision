import os
import sys
import json
import cv2
import numpy as np

sys.path.append("/Users/Nishra/Desktop/voguevision/backend")
from cv.color_analysis import extract_dominant_colors, detect_primary_color

BASE_DIR = "/Users/Nishra/Desktop/voguevision"
CATALOG_DIR = os.path.join(BASE_DIR, "backend", "catalog", "product_images")
PRODUCTS_JSON = os.path.join(BASE_DIR, "backend", "data", "products.json")

with open(PRODUCTS_JSON) as f:
    products = json.load(f)

print(f"Recomputing features for {len(products)} products from local images...")

updated_products = []

for p in products:
    img_name = p["image"]
    img_path = os.path.join(CATALOG_DIR, img_name)
    bgr = cv2.imread(img_path)
    if bgr is None:
        raise ValueError(f"Could not load image: {img_path}")
    
    # Standardize to 256x256 for consistent analysis
    bgr_resized = cv2.resize(bgr, (256, 256), interpolation=cv2.INTER_AREA)
    
    # 1. 512-D HSV Histogram (Hue: 8 bins, Saturation: 8 bins, Value: 8 bins)
    hsv = cv2.cvtColor(bgr_resized, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv], [0, 1, 2], None, [8, 8, 8], [0, 180, 0, 256, 0, 256])
    cv2.normalize(hist, hist, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    hist_flattened = hist.flatten().tolist()
    
    # 2. Dominant colors via K-Means
    rgb = cv2.cvtColor(bgr_resized, cv2.COLOR_BGR2RGB)
    dom_colors = extract_dominant_colors(rgb, k=4)
    detected_primary = detect_primary_color(dom_colors)
    
    item = dict(p)
    item["histogram"] = hist_flattened
    item["dominant_colors"] = dom_colors
    
    # Retain existing assigned primary_color if it matches the item color family,
    # or align if appropriate
    # Ensure category is strictly preserved
    updated_products.append(item)
    
    top_c = dom_colors[0]
    p_name = p["name"][:32]
    p_cat = p["category"]
    p_col = p["primary_color"]
    top_hex = top_c["hex"]
    top_pct = top_c["percentage"]
    print(f"#{p['id']:2d} [{p_cat:8s}] {p_name:32s} | Pri:{p_col:7s} | Dom:{top_hex} ({top_pct:4.1f}%) | Det:{detected_primary}")

with open(PRODUCTS_JSON, "w") as f:
    json.dump(updated_products, f, indent=2)

print("\nSuccessfully updated backend/data/products.json with recalculations.")
