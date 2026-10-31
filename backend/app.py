"""
VogueVision Backend API Server
Flask + OpenCV Image Similarity and Rule-Based Fashion Outfit Recommendation Engine.
"""

import os
import uuid
import base64
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from cv.preprocessing import decode_image, preprocess_image
from cv.color_analysis import extract_hsv_histogram, extract_dominant_colors, detect_primary_color
from cv.similarity import find_similar_products, load_catalog
from cv.outfit_matching import get_complementary_items, generate_curated_outfits

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CATALOG_DIR = os.path.join(BASE_DIR, "catalog", "product_images")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint confirming OpenCV & Flask backend status."""
    catalog = load_catalog()
    return jsonify({
        "status": "healthy",
        "service": "VogueVision Computer Vision API",
        "catalog_size": len(catalog),
        "opencv_version": "4.10.0",
        "timestamp": time.time()
    }), 200

@app.route("/api/products", methods=["GET"])
def get_products():
    """Returns all products in the local catalog."""
    category = request.args.get("category")
    catalog = load_catalog()

    if category and category.lower() != "all":
        catalog = [p for p in catalog if p.get("category", "").lower() == category.lower()]

    clean_list = []
    for p in catalog:
        item = dict(p)
        if "histogram" in item:
            del item["histogram"] # Keep response payload small
        item["imageUrl"] = f"/catalog/{item['image']}"
        clean_list.append(item)

    return jsonify({
        "total": len(clean_list),
        "products": clean_list
    }), 200

@app.route("/api/analyze", methods=["POST"])
def analyze_image():
    """
    Main Computer Vision analysis endpoint:
    1. Decodes uploaded image (file or base64)
    2. Runs OpenCV preprocessing (resize 256x256, BGR to HSV/RGB)
    3. Computes normalized 3D HSV histogram (512 bins)
    4. Extracts top 4 dominant colors using cv2.kmeans
    5. Calculates histogram correlation against catalog products (cv2.compareHist)
    6. Generates rule-based outfit recommendations
    """
    try:
        raw_bytes = None
        filename = f"upload_{uuid.uuid4().hex[:8]}.jpg"
        category_hint = request.form.get("category", None) or (request.json.get("category") if request.is_json else None)

        # 1. Handle file upload (multipart/form-data)
        if "image" in request.files:
            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "No file selected."}), 400
            raw_bytes = file.read()

        # 2. Handle base64 upload (e.g. from camera capture or sample image)
        elif request.is_json and "image_data" in request.json:
            data_url = request.json["image_data"]
            if "," in data_url:
                header, encoded = data_url.split(",", 1)
            else:
                encoded = data_url
            raw_bytes = base64.b64decode(encoded)

        # 3. Handle sample image name reference
        elif request.is_json and "sample_name" in request.json:
            sample_name = request.json["sample_name"]
            sample_path = os.path.join(UPLOADS_DIR, sample_name)
            if not os.path.exists(sample_path):
                # Fallback to catalog image
                sample_path = os.path.join(CATALOG_DIR, sample_name)
            if os.path.exists(sample_path):
                with open(sample_path, "rb") as f:
                    raw_bytes = f.read()

        if not raw_bytes:
            return jsonify({"error": "No image provided. Please upload a JPG or PNG image."}), 400

        # Save to uploads directory
        saved_path = os.path.join(UPLOADS_DIR, filename)
        with open(saved_path, "wb") as f:
            f.write(raw_bytes)

        # Step 1: Image Preprocessing (OpenCV)
        decoded_bgr = decode_image(raw_bytes)
        preprocessed = preprocess_image(decoded_bgr)

        # Step 2: Color Feature Extraction (OpenCV)
        query_hist = extract_hsv_histogram(preprocessed["hsv"])
        dominant_colors = extract_dominant_colors(preprocessed["rgb"], k=4)
        detected_primary_color = detect_primary_color(dominant_colors)

        # Category mapping: default to "tops" or category hint
        detected_category = category_hint if category_hint and category_hint != "all" else "tops"

        # Step 3: Similarity Matching via cv2.compareHist
        similar_items = find_similar_products(
            query_hist=query_hist,
            query_primary_color=detected_primary_color,
            category_filter=category_hint,
            top_k=5
        )

        # Step 4: Rule-based Outfit Recommendations
        query_item_meta = {
            "name": "Uploaded Item",
            "category": detected_category,
            "primary_color": detected_primary_color,
            "imageUrl": f"/uploads/{filename}",
            "dominant_colors": dominant_colors
        }
        complementary_pieces = get_complementary_items(
            category=detected_category,
            primary_color=detected_primary_color
        )
        curated_outfits = generate_curated_outfits(
            main_item=query_item_meta,
            primary_color=detected_primary_color
        )

        return jsonify({
            "success": True,
            "uploaded_image": {
                "filename": filename,
                "url": f"/uploads/{filename}",
                "dimensions": preprocessed["original_dimensions"],
                "detected_category": detected_category,
                "primary_color": detected_primary_color
            },
            "dominant_colors": dominant_colors,
            "similar_products": similar_items,
            "complementary_pieces": complementary_pieces,
            "curated_outfits": curated_outfits,
            "cv_metrics": {
                "algorithm": "cv2.compareHist (HISTCMP_CORREL)",
                "color_space": "HSV (8x8x8 3D Histogram, 512 dimensions)",
                "clustering": "cv2.kmeans (K=4, RGB pixels)",
                "normalization": "cv2.NORM_MINMAX [0, 1]"
            }
        }), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal processing error: {str(e)}"}), 500

@app.route("/api/recommend-outfit", methods=["POST"])
def recommend_outfit():
    """
    Returns complementary outfit pieces for any specified catalog item or color.
    """
    data = request.get_json() or {}
    category = data.get("category", "tops")
    primary_color = data.get("primary_color", "pink")
    item_id = data.get("item_id")

    catalog = load_catalog()
    main_item = next((p for p in catalog if p["id"] == item_id), None)
    if not main_item:
        main_item = {
            "name": f"Selected {category.capitalize()}",
            "category": category,
            "primary_color": primary_color,
            "imageUrl": "/catalog/top_pink_floral_puff.jpg"
        }
    else:
        main_item["imageUrl"] = f"/catalog/{main_item['image']}"

    complementary = get_complementary_items(category, primary_color)
    outfits = generate_curated_outfits(main_item, primary_color)

    return jsonify({
        "success": True,
        "main_item": main_item,
        "complementary_pieces": complementary,
        "curated_outfits": outfits
    }), 200

@app.route("/api/products/<int:product_id>/styling", methods=["GET"])
def get_product_styling(product_id):
    """
    Core CV Styling Studio Endpoint:
    Given a selected catalog product:
    1. Loads its precomputed 512-D HSV histogram and dominant colors.
    2. Runs cv2.compareHist(HISTCMP_CORREL) across catalog items in the same category (excluding self).
    3. Retrieves color harmony complementary pieces (bottoms, shoes, bags).
    4. Generates 5 curated complete outfit combinations.
    """
    catalog = load_catalog()
    product = next((p for p in catalog if p["id"] == product_id), None)
    if not product:
        return jsonify({"error": f"Product with ID {product_id} not found."}), 404

    category = product.get("category", "tops")
    primary_color = product.get("primary_color", "pink")
    hist = product.get("histogram", [])

    # 1. OpenCV Histogram Correlation for visually similar styles (filter same category, exclude self)
    similar_items = find_similar_products(
        query_hist=hist,
        query_primary_color=primary_color,
        category_filter=category,
        top_k=5,
        exclude_id=product_id
    )

    # 2. Rule-based color harmony complementary pieces (prioritizing verified studio showroom companions)
    complementary_pieces = get_complementary_items(category, primary_color, main_item_id=product_id)

    # 3. 5 Curated complete stylized looks
    item_meta = dict(product)
    item_meta["imageUrl"] = f"/catalog/{item_meta['image']}"
    curated_outfits = generate_curated_outfits(item_meta, primary_color)

    # Format clean product object without raw 512-D array to keep response fast
    clean_product = dict(product)
    if "histogram" in clean_product:
        del clean_product["histogram"]
    clean_product["imageUrl"] = f"/catalog/{clean_product['image']}"

    return jsonify({
        "success": True,
        "product": clean_product,
        "similar_styles": similar_items,
        "complementary_pieces": complementary_pieces,
        "curated_outfits": curated_outfits,
        "cv_metrics": {
            "algorithm": "cv2.compareHist (HISTCMP_CORREL)",
            "histogram_bins": "8x8x8 HSV (512 dimensions)",
            "clustering": "cv2.kmeans (K=4, RGB pixels)",
            "normalization": "cv2.NORM_MINMAX [0, 1]",
            "category_filtered": category,
            "excluded_self_id": product_id
        }
    }), 200

# Static file routes for images
@app.route("/catalog/<path:filename>")
def serve_catalog_image(filename):
    return send_from_directory(CATALOG_DIR, filename)

@app.route("/uploads/<path:filename>")
def serve_upload_image(filename):
    return send_from_directory(UPLOADS_DIR, filename)

if __name__ == "__main__":
    print("Starting VogueVision Flask Server on http://127.0.0.1:5001")
    app.run(host="0.0.0.0", port=5001, debug=False)
