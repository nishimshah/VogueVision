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

def find_similar_products(query_hist: list, query_primary_color: str = None, category_filter: str = None, top_k: int = 5, exclude_id: int = None):
    """
    Ranks catalog products by HSV color histogram correlation against the query image.

    cv2.compareHist with cv2.HISTCMP_CORREL:
    Range: [-1.0, 1.0] (1.0 = exact color distribution match).
    Converts to a normalized similarity percentage:
    score_pct = max(0.0, min(100.0, ((correlation + 1.0) / 2.0) * 100))

    Parameters:
    - query_hist: 512-dim normalized HSV histogram list
    - query_primary_color: detected primary color name (e.g. 'pink', 'blue')
    - category_filter: optional category filter ('tops', 'jeans', 'dresses', etc.)
    - top_k: number of results to return (default 5)
    - exclude_id: optional product ID to exclude from recommendations
    """
    catalog = load_catalog()
    if not catalog:
        return []

    q_hist_np = np.array(query_hist, dtype=np.float32)

    results = []
    for item in catalog:
        # Exclude self if requested
        if exclude_id is not None and item.get("id") == exclude_id:
            continue

        # Category filter check if specified
        if category_filter and category_filter.lower() != "all":
            if item.get("category", "").lower() != category_filter.lower():
                continue

        item_hist_np = np.array(item.get("histogram", []), dtype=np.float32)
        if len(item_hist_np) != len(q_hist_np):
            continue

        # 1. OpenCV Histogram Correlation: cv2.HISTCMP_CORREL
        corr = cv2.compareHist(q_hist_np, item_hist_np, cv2.HISTCMP_CORREL)

        # 2. OpenCV Histogram Intersection (secondary verification metric)
        intersection = cv2.compareHist(q_hist_np, item_hist_np, cv2.HISTCMP_INTERSECT)

        # Normalize correlation [-1, 1] to percentage [0, 100]
        # Correlation > 0 is positive relationship; correlation <= 0 is dissimilar
        normalized_pct = max(0.0, min(100.0, ((corr + 1.0) / 2.0) * 100.0))

        # Check color family alignment for tie-breaking
        color_bonus = 0.0
        if query_primary_color and query_primary_color in item.get("color_family", []):
            color_bonus = 3.5

        final_score = min(99.4, round(normalized_pct + color_bonus, 1))

        # Build clean result object (excluding raw 512-dim hist to keep payload lightweight)
        results.append({
            "id": item["id"],
            "name": item["name"],
            "category": item["category"],
            "subCategory": item.get("subCategory", ""),
            "primary_color": item.get("primary_color", ""),
            "color_family": item.get("color_family", []),
            "price": item.get("price", ""),
            "description": item.get("description", ""),
            "image": item["image"],
            "imageUrl": f"/catalog/{item['image']}",
            "dominant_colors": item.get("dominant_colors", []),
            "similarity_score": final_score,
            "raw_correlation": round(float(corr), 4),
            "intersection": round(float(intersection), 2)
        })

    # Sort descending by similarity score
    results.sort(key=lambda x: x["similarity_score"], reverse=True)

    return results[:top_k]
