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

# Complete Curated Wardrobe across Casual, Formal, Party, Dresses, and Boots
raw_items = [
  # CASUAL & FORMAL TOPS
  {"id": 1, "name": "White Fitted T-Shirt", "category": "tops", "primary_color": "white", "price": "₹1,299", "image": "top_white_fitted_tee.jpg", "occasions": ["Casual"], "description": "Minimal solid white fitted crew-neck t-shirt in organic cotton."},
  {"id": 2, "name": "Black Fitted Top", "category": "tops", "primary_color": "black", "price": "₹1,499", "image": "top_black_fitted.jpg", "occasions": ["Casual", "Formal"], "description": "Sleek solid black fitted top in soft modal rib."},
  {"id": 3, "name": "Beige Silky Blouse", "category": "tops", "primary_color": "beige", "price": "₹1,899", "image": "top_beige_blouse.jpg", "occasions": ["Formal"], "description": "Elegant solid beige silky blouse with draped neckline."},
  {"id": 4, "name": "White Button-Down Shirt", "category": "tops", "primary_color": "white", "price": "₹2,199", "image": "top_white_button_down.jpg", "occasions": ["Formal", "Casual"], "description": "Crisp solid white tailored cotton button-down dress shirt."},
  {"id": 5, "name": "Grey Scoop-Neck Tank Top", "category": "tops", "primary_color": "grey", "price": "₹999", "image": "top_grey_tank.jpg", "occasions": ["Casual"], "description": "Solid heather grey scoop-neck sleeveless tank top."},
  
  # PARTY TOPS
  {"id": 18, "name": "Black Satin Corset Top", "category": "tops", "primary_color": "black", "price": "₹2,499", "image": "top_black_silk_cami.jpg", "occasions": ["Party"], "description": "Structured black satin corset top with boning detail and clean lines."},
  {"id": 19, "name": "Burgundy Off-Shoulder Top", "category": "tops", "primary_color": "burgundy", "price": "₹2,299", "image": "top_crimson_floral.jpg", "occasions": ["Party"], "description": "Dramatic rich burgundy off-the-shoulder evening top in stretch jersey."},
  {"id": 20, "name": "Champagne Satin Camisole", "category": "tops", "primary_color": "champagne", "price": "₹1,799", "image": "top_dusty_rose_ruched.jpg", "occasions": ["Party"], "description": "Lustrous champagne gold satin camisole with delicate shoulder straps."},

  # BOTTOMS
  {"id": 6, "name": "Blue Straight-Leg Jeans", "category": "jeans", "primary_color": "blue", "price": "₹2,499", "image": "bottom_light_blue_jeans.jpg", "occasions": ["Casual"], "description": "Classic medium-wash blue straight-leg denim jeans."},
  {"id": 7, "name": "Black Wide-Leg Trousers", "category": "trousers", "primary_color": "black", "price": "₹2,699", "image": "bottom_charcoal_trousers.jpg", "occasions": ["Formal", "Party"], "description": "Tailored solid black wide-leg fluid trousers with clean crease."},
  {"id": 8, "name": "Beige Tailored Trousers", "category": "trousers", "primary_color": "beige", "price": "₹2,599", "image": "bottom_ecru_pleated_trousers.jpg", "occasions": ["Formal"], "description": "Refined beige high-waist tailored pleated trousers."},
  {"id": 9, "name": "Cream Pleated Midi Skirt", "category": "skirts", "primary_color": "cream", "price": "₹2,299", "image": "bottom_ivory_pleated_skirt.jpg", "occasions": ["Casual"], "description": "Accordion pleated cream ivory A-line midi skirt."},
  {"id": 21, "name": "Black Satin Maxi Skirt", "category": "skirts", "primary_color": "black", "price": "₹2,799", "image": "bottom_rose_satin_skirt.jpg", "occasions": ["Party"], "description": "High-waist bias-cut solid black satin maxi skirt with fluid drape."},

  # DRESSES
  {"id": 10, "name": "Black Cocktail Dress", "category": "dresses", "primary_color": "black", "price": "₹3,499", "image": "dress_black_velvet_sheath.jpg", "occasions": ["Party", "Formal"], "description": "Architectural minimal black cocktail sheath dress."},
  {"id": 11, "name": "Beige Sleeveless Midi Dress", "category": "dresses", "primary_color": "beige", "price": "₹3,299", "image": "dress_beige_sleeveless.jpg", "occasions": ["Casual", "Formal"], "description": "Minimal solid beige sleeveless crew-neck midi dress."},
  {"id": 22, "name": "Burgundy Evening Dress", "category": "dresses", "primary_color": "burgundy", "price": "₹3,899", "image": "dress_emerald_satin_slip.jpg", "occasions": ["Party"], "description": "Refined fluid burgundy satin evening slip dress with cowl neck."},

  # SHOES (Fixed complements in preview)
  {"id": 12, "name": "Minimalist White Tennis Sneakers", "category": "shoes", "primary_color": "white", "price": "₹2,999", "image": "shoes_white_minimal_sneakers.jpg", "occasions": ["Casual"], "description": "Low-top minimalist white leather tennis sneakers."},
  {"id": 13, "name": "Polished Black Leather Loafers", "category": "shoes", "primary_color": "black", "price": "₹3,499", "image": "shoes_black_loafers.jpg", "occasions": ["Formal", "Casual"], "description": "Classic polished black leather penny loafers."},
  {"id": 14, "name": "Nude Pointed Slingback Pumps", "category": "shoes", "primary_color": "nude", "price": "₹3,299", "image": "shoes_nude_slingback_pumps.jpg", "occasions": ["Formal", "Party"], "description": "Nude beige pointed-toe slingback stiletto heels."},
  {"id": 27, "name": "Black Knee-High Leather Boots", "category": "shoes", "primary_color": "black", "price": "₹4,999", "image": "shoes_black_leather_boots.jpg", "occasions": ["Casual", "Party"], "description": "Structured black leather knee-high boots with block heel."},

  # BAGS (Fixed complements in preview)
  {"id": 15, "name": "Black Quilted Shoulder Bag", "category": "handbags", "primary_color": "black", "price": "₹3,899", "image": "bag_black_quilted_chain.jpg", "occasions": ["Formal", "Party"], "description": "Black leather diamond-quilted shoulder bag with chain strap."},
  {"id": 16, "name": "Structured Tan Leather Tote", "category": "handbags", "primary_color": "tan", "price": "₹4,299", "image": "bag_cognac_tan_shoulder.jpg", "occasions": ["Casual", "Formal"], "description": "Structured tan cognac leather shoulder tote."},
  {"id": 17, "name": "Structured Minimal Cream Handbag", "category": "handbags", "primary_color": "cream", "price": "₹3,699", "image": "bag_ivory_structured.jpg", "occasions": ["Formal", "Casual"], "description": "Structured top-handle cream ivory leather handbag."}
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
    d["color_family"] = [item["primary_color"]]
    d["histogram"] = hist.flatten().tolist()
    d["dominant_colors"] = dom_colors
    processed.append(d)
    print(f"ID {d['id']:2d} | {d['name']:32s} | Cat: {d['category']:8s} | Occ: {', '.join(d['occasions'])}")

with open(PRODUCTS_JSON, "w") as f:
    json.dump(processed, f, indent=2)

print(f"\nSuccessfully populated {len(processed)} items in backend/data/products.json with CV features.")
