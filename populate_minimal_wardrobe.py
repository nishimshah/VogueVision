import os
import sys
import json
import cv2
import numpy as np

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))
from cv.color_analysis import extract_dominant_colors, detect_primary_color

BASE_DIR = "/Users/Nishra/Desktop/voguevision/backend"
CATALOG_DIR = os.path.join(BASE_DIR, "catalog", "product_images")
PRODUCTS_JSON = os.path.join(BASE_DIR, "data", "products.json")

# 17 minimal curated wardrobe items requested by the user
raw_items = [
  # TOPS (5)
  {"id": 1, "name": "White Fitted T-Shirt", "category": "tops", "primary_color": "white", "price": "₹1,299", "image": "top_white_fitted_tee.jpg", "description": "Modern minimal solid white fitted crew-neck t-shirt in premium organic cotton."},
  {"id": 2, "name": "Black Fitted Top", "category": "tops", "primary_color": "black", "price": "₹1,499", "image": "top_black_fitted.jpg", "description": "Sleek solid black fitted short-sleeve top in soft modal rib."},
  {"id": 3, "name": "Beige Silky Blouse", "category": "tops", "primary_color": "beige", "price": "₹1,899", "image": "top_beige_blouse.jpg", "description": "Elegant solid beige silky blouse with draped high neckline and long sleeves."},
  {"id": 4, "name": "White Button-Down Shirt", "category": "tops", "primary_color": "white", "price": "₹2,199", "image": "top_white_button_down.jpg", "description": "Crisp solid white tailored cotton button-down dress shirt."},
  {"id": 5, "name": "Grey Scoop-Neck Tank Top", "category": "tops", "primary_color": "grey", "price": "₹999", "image": "top_grey_tank.jpg", "description": "Minimal solid heather grey scoop-neck sleeveless tank top."},

  # BOTTOMS (4)
  {"id": 6, "name": "Blue Straight-Leg Jeans", "category": "jeans", "primary_color": "blue", "price": "₹2,499", "image": "bottom_light_blue_jeans.jpg", "description": "Classic medium-wash blue straight-leg denim jeans."},
  {"id": 7, "name": "Black Wide-Leg Trousers", "category": "trousers", "primary_color": "black", "price": "₹2,699", "image": "bottom_charcoal_trousers.jpg", "description": "Tailored solid black wide-leg fluid trousers with belt loops."},
  {"id": 8, "name": "Beige Tailored Trousers", "category": "trousers", "primary_color": "beige", "price": "₹2,599", "image": "bottom_ecru_pleated_trousers.jpg", "description": "Refined beige high-waist tailored pleated trousers."},
  {"id": 9, "name": "Cream Pleated Midi Skirt", "category": "skirts", "primary_color": "cream", "price": "₹2,299", "image": "bottom_ivory_pleated_skirt.jpg", "description": "Accordian pleated cream ivory A-line midi skirt."},

  # DRESSES (2)
  {"id": 10, "name": "Black Tailored Midi Dress", "category": "dresses", "primary_color": "black", "price": "₹3,499", "image": "dress_black_velvet_sheath.jpg", "description": "Sophisticated minimal solid black sleeveless tailored sheath midi dress."},
  {"id": 11, "name": "Beige Sleeveless Midi Dress", "category": "dresses", "primary_color": "beige", "price": "₹3,299", "image": "dress_beige_sleeveless.jpg", "description": "Elegant solid minimal beige sleeveless crew-neck midi dress."},

  # SHOES (3)
  {"id": 12, "name": "Minimalist White Tennis Sneakers", "category": "shoes", "primary_color": "white", "price": "₹2,999", "image": "shoes_white_minimal_sneakers.jpg", "description": "Clean low-top minimalist white leather tennis sneakers."},
  {"id": 13, "name": "Polished Black Leather Loafers", "category": "shoes", "primary_color": "black", "price": "₹3,499", "image": "shoes_black_loafers.jpg", "description": "Classic polished black leather penny loafers."},
  {"id": 14, "name": "Nude Pointed Slingback Pumps", "category": "shoes", "primary_color": "nude", "price": "₹3,299", "image": "shoes_nude_slingback_pumps.jpg", "description": "Elegant nude beige pointed-toe slingback stiletto heels."},

  # BAGS (3)
  {"id": 15, "name": "Black Quilted Shoulder Bag", "category": "handbags", "primary_color": "black", "price": "₹3,899", "image": "bag_black_quilted_chain.jpg", "description": "Classic black leather diamond-quilted shoulder bag with gold chain strap."},
  {"id": 16, "name": "Structured Tan Leather Tote", "category": "handbags", "primary_color": "tan", "price": "₹4,299", "image": "bag_cognac_tan_shoulder.jpg", "description": "Modern structured tan cognac leather shoulder tote."},
  {"id": 17, "name": "Structured Minimal Cream Handbag", "category": "handbags", "primary_color": "cream", "price": "₹3,699", "image": "bag_ivory_structured.jpg", "description": "Structured top-handle cream ivory leather handbag with clean lines."}
]

processed = []
for item in raw_items:
    img_path = os.path.join(CATALOG_DIR, item["image"])
    bgr = cv2.imread(img_path)
    if bgr is None:
        raise ValueError(f"Could not load image: {img_path}")
    
    bgr_resized = cv2.resize(bgr, (256, 256), interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(bgr_resized, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv], [0, 1, 2], None, [8, 8, 8], [0, 180, 0, 256, 0, 256])
    cv2.normalize(hist, hist, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    
    rgb = cv2.cvtColor(bgr_resized, cv2.COLOR_BGR2RGB)
    dom_colors = extract_dominant_colors(rgb, k=4)
    detected_pri = detect_primary_color(dom_colors)
    
    d = dict(item)
    d["subCategory"] = item["category"]
    d["color_family"] = item["primary_color"]
    d["histogram"] = hist.flatten().tolist()
    d["dominant_colors"] = dom_colors
    processed.append(d)
    print(f"Processed ID {d['id']:2d} | {d['name']:32s} | Pri: {d['primary_color']:6s} | Det: {detected_pri}")

with open(PRODUCTS_JSON, "w") as f:
    json.dump(processed, f, indent=2)

print(f"\nSuccessfully populated {len(processed)} minimal curated items in backend/data/products.json with CV features.")
