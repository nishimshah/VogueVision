"""
Color Feature Extraction & Dominant Color Analysis for VogueVision
Uses OpenCV cv2.calcHist, cv2.normalize, and cv2.kmeans to extract:
1. Normalized 3D HSV Color Histogram (512 features)
2. Top K Dominant Colors with Hex, RGB, and Area Percentage
3. Estimated Primary Color Family
"""

import cv2
import numpy as np

def extract_hsv_histogram(hsv_image: np.ndarray, bins=(8, 8, 8)) -> list:
    """
    Computes a 3D HSV color histogram using OpenCV.
    - Hue channel: 0..180 (8 bins)
    - Saturation channel: 0..256 (8 bins)
    - Value channel: 0..256 (8 bins)
    Total bins = 512.
    Normalized with cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX).
    """
    hist = cv2.calcHist(
        [hsv_image],
        [0, 1, 2],
        None,
        bins,
        [0, 180, 0, 256, 0, 256]
    )
    # MinMax normalization
    cv2.normalize(hist, hist, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    return hist.flatten().tolist()

def extract_dominant_colors(rgb_image: np.ndarray, k: int = 4) -> list:
    """
    Extracts K dominant colors using OpenCV cv2.kmeans on RGB pixel values.
    Returns list of dicts: {"hex": "#RRGGBB", "rgb": [r,g,b], "percentage": float, "name": str}
    """
    # Flatten the image pixels to Nx3
    pixels = rgb_image.reshape((-1, 3)).astype(np.float32)

    # K-Means termination criteria: max 20 iterations or epsilon 0.2
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.2)
    flags = cv2.KMEANS_RANDOM_CENTERS

    compactness, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, flags)

    # Count occurrences of each cluster label
    counts = np.bincount(labels.flatten())
    total_pixels = len(labels)

    # Sort descending by area coverage
    sorted_indices = np.argsort(counts)[::-1]

    dominant_colors = []
    for idx in sorted_indices:
        rgb_center = centers[idx].astype(int)
        r, g, b = int(rgb_center[0]), int(rgb_center[1]), int(rgb_center[2])
        # Clamp 0..255
        r = max(0, min(255, r))
        g = max(0, min(255, g))
        b = max(0, min(255, b))

        hex_code = f"#{r:02x}{g:02x}{b:02x}".upper()
        percentage = round((float(counts[idx]) / total_pixels) * 100, 1)
        color_name = approximate_color_name(r, g, b)

        dominant_colors.append({
            "hex": hex_code,
            "rgb": [r, g, b],
            "percentage": percentage,
            "name": color_name
        })

    return dominant_colors

def approximate_color_name(r: int, g: int, b: int) -> str:
    """Classifies an RGB color into a fashion color family name."""
    # Convert RGB to HSV for intuitive thresholding
    rgb_pixel = np.uint8([[[r, g, b]]])
    hsv_pixel = cv2.cvtColor(rgb_pixel, cv2.COLOR_RGB2HSV)[0][0]
    h, s, v = int(hsv_pixel[0]), int(hsv_pixel[1]), int(hsv_pixel[2])

    # Low brightness -> Black / Charcoal
    if v < 45:
        return "black"
    # Low saturation thresholding for pure neutrals
    if s < 18:
        if v > 200:
            return "white"
        return "grey"

    # Cream / Ivory (warm light desaturated)
    if 15 <= h < 38 and s < 40 and v > 180:
        return "cream"

    # H ranges 0 to 180 in OpenCV
    # Red/Pink wrap around 0 and 180
    if (h < 10 or h >= 170):
        if s < 120 and v > 150:
            return "pink"
        return "red"
    elif 10 <= h < 25:
        if v > 150 and s < 95:
            return "beige"
        return "orange"
    elif 25 <= h < 38:
        if s < 80:
            return "beige"
        return "yellow"
    elif 38 <= h < 88:
        return "green"
    elif 88 <= h < 135:
        return "blue"
    elif 135 <= h < 160:
        return "purple"
    elif 160 <= h < 170:
        return "pink"

    return "neutral"

def detect_primary_color(dominant_colors: list) -> str:
    """
    Selects the most representative foreground clothing color from dominant clusters,
    ignoring background white/grey if non-neutral colors exist.
    """
    if not dominant_colors:
        return "pink"

    # Filter out near-white or neutral canvas if there is a distinct colored cluster
    for c in dominant_colors:
        name = c["name"]
        if name not in ["white", "cream", "grey"] and c["percentage"] >= 15.0:
            return name

    # Otherwise take the highest percentage color
    return dominant_colors[0]["name"]
