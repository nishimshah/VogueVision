"""
Image Similarity Comparison Module for VogueVision
Uses OpenCV cv2.compareHist to calculate color histogram correlation between
an uploaded fashion item and products in the local catalog.
"""

import os
import json
import numpy as np
import cv2

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_JSON = os.path.join(BASE_DIR, "data", "products.json")

def load_catalog():
    """Loads catalog products with precomputed histograms."""
    if not os.path.exists(PRODUCTS_JSON):
        return []
    with open(PRODUCTS_JSON, "r") as f:
        return json.load(f)

BOTTOM_CATEGORIES = {"jeans", "trousers", "skirts"}

def find_similar_products(query_hist: list, query_primary_color: str = None, category_filter: str = None, top_k: int = 5, exclude_id: int = None):
    """
    Ranks catalog products by HSV color histogram correlation against the query image.
    Uses OpenCV cv2.compareHist with cv2.HISTCMP_CORREL:
    Pearson correlation r in [-1.0, 1.0], where 1.0 indicates identical color distribution.

    Parameters:
    - query_hist: 512-dim normalized HSV histogram list
    - query_primary_color: detected primary color name (e.g. 'white', 'black', 'beige')
    - category_filter: optional category filter ('tops', 'jeans', 'trousers', 'skirts', 'dresses')
    - top_k: number of results to return (default 5)
    - exclude_id: product ID to exclude (e.g., self)
    """
    catalog = load_catalog()
    if not catalog:
        return []

    q_hist_np = np.array(query_hist, dtype=np.float32)

    # Determine acceptable categories for filtering
    target_categories = None
    if category_filter and category_filter.lower() != "all":
        filt = category_filter.lower()
        if filt in BOTTOM_CATEGORIES or filt in ["bottoms", "jeans_trousers"]:
            target_categories = BOTTOM_CATEGORIES
        else:
            target_categories = {filt}

    results = []
    for item in catalog:
        # Exclude self
        if exclude_id is not None and item.get("id") == exclude_id:
            continue

        item_cat = item.get("category", "").lower()
        # Category filter check: group bottoms together so 'jeans' or 'skirts' never yields empty matches
        if target_categories is not None and item_cat not in target_categories:
            continue

        item_hist_np = np.array(item.get("histogram", []), dtype=np.float32)
        if len(item_hist_np) != len(q_hist_np):
            continue

        # 1. OpenCV Histogram Correlation: cv2.HISTCMP_CORREL
        corr = cv2.compareHist(q_hist_np, item_hist_np, cv2.HISTCMP_CORREL)

        # 2. OpenCV Histogram Intersection
        intersection = cv2.compareHist(q_hist_np, item_hist_np, cv2.HISTCMP_INTERSECT)

        # Mathematical similarity measure:
        # Positive Pearson correlation maps directly to similarity percentage [0% to 100%]
        # Correlation <= 0 represents negative or zero correlation (uncorrelated color spaces)
        raw_corr = round(float(corr), 4)
        pct_score = max(0.0, round(float(corr) * 100.0, 1)) if raw_corr > 0 else 0.0

        results.append({
            "id": item["id"],
            "name": item["name"],
            "category": item["category"],
            "subCategory": item.get("subCategory", ""),
            "primary_color": item.get("primary_color", ""),
            "color_family": item.get("color_family", []),
            "occasions": item.get("occasions", []),
            "price": item.get("price", ""),
            "description": item.get("description", ""),
            "image": item["image"],
            "imageUrl": f"/catalog/{item['image']}",
            "dominant_colors": item.get("dominant_colors", []),
            "similarity_score": pct_score,
            "raw_correlation": raw_corr,
            "intersection": round(float(intersection), 2)
        })

    # Sort descending by raw Pearson correlation
    results.sort(key=lambda x: x["raw_correlation"], reverse=True)

    return results[:top_k]
