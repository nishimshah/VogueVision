"""
VogueVision Fashion Catalog Setup & Feature Precomputation
Downloads real curated fashion product imagery, ensures fallbacks,
computes OpenCV HSV histograms and dominant colors, and saves catalog metadata.
"""

import os
import json
import time
import requests
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CATALOG_DIR = os.path.join(BASE_DIR, "catalog", "product_images")
DATA_DIR = os.path.join(BASE_DIR, "data")
FRONTEND_CATALOG_DIR = os.path.join(BASE_DIR, "..", "frontend", "public", "catalog")
FRONTEND_SAMPLES_DIR = os.path.join(BASE_DIR, "..", "frontend", "public", "samples")

os.makedirs(CATALOG_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(FRONTEND_CATALOG_DIR, exist_ok=True)
os.makedirs(FRONTEND_SAMPLES_DIR, exist_ok=True)

# Curated catalog matching VogueVision aesthetic
PRODUCTS = [
    # Tops (Similar to the diagram reference)
    {
        "id": 1,
        "name": "Blush Floral Puff-Sleeve Top",
        "category": "tops",
        "subCategory": "blouse",
        "primary_color": "pink",
        "color_family": ["pink", "rose", "cream"],
        "price": "$58",
        "description": "Romantic sweetheart neckline crop top with delicate floral motifs and ruched sleeves.",
        "image": "top_pink_floral_puff.jpg",
        "source_url": "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 2,
        "name": "Cream Botanical Ruffled Blouse",
        "category": "tops",
        "subCategory": "blouse",
        "primary_color": "cream",
        "color_family": ["cream", "beige", "rose"],
        "price": "$64",
        "description": "Delicate cream chiffon top with vintage botanical sprigs and soft puff sleeves.",
        "image": "top_cream_botanical.jpg",
        "source_url": "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 3,
        "name": "Dusty Rose Sweetheart Ruched Top",
        "category": "tops",
        "subCategory": "crop-top",
        "primary_color": "pink",
        "color_family": ["pink", "dusty-rose"],
        "price": "$52",
        "description": "Feminine sweetheart bustier in solid dusty rose with gathering and cap sleeves.",
        "image": "top_dusty_rose_ruched.jpg",
        "source_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 4,
        "name": "Crimson Floral Peasant Blouse",
        "category": "tops",
        "subCategory": "blouse",
        "primary_color": "red",
        "color_family": ["red", "crimson", "pink"],
        "price": "$62",
        "description": "Rich crimson red top with ditsy floral print and elasticated ruffled waistline.",
        "image": "top_crimson_floral.jpg",
        "source_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 5,
        "name": "White Broderie Anglaise Top",
        "category": "tops",
        "subCategory": "blouse",
        "primary_color": "white",
        "color_family": ["white", "ivory"],
        "price": "$68",
        "description": "Crisp white cotton eyelet embroidered blouse with scalloped hem and puffed sleeves.",
        "image": "top_white_embroidered.jpg",
        "source_url": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 6,
        "name": "Lavender Ribbed Knit Sweetheart Top",
        "category": "tops",
        "subCategory": "knitwear",
        "primary_color": "purple",
        "color_family": ["purple", "lavender", "lilac"],
        "price": "$48",
        "description": "Soft lilac ribbed knit fitted top with flattering contoured sweetheart neckline.",
        "image": "top_lavender_ribbed.jpg",
        "source_url": "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 7,
        "name": "Classic Black Silk Camisole",
        "category": "tops",
        "subCategory": "camisole",
        "primary_color": "black",
        "color_family": ["black", "charcoal"],
        "price": "$45",
        "description": "Timeless matte silk slip camisole with delicate spaghetti straps and V-neckline.",
        "image": "top_black_silk_cami.jpg",
        "source_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 8,
        "name": "Sage Green Linen Button Blouse",
        "category": "tops",
        "subCategory": "shirt",
        "primary_color": "green",
        "color_family": ["green", "sage", "olive"],
        "price": "$56",
        "description": "Relaxed breezy linen shirt in soothing sage green with tortoiseshell buttons.",
        "image": "top_sage_linen_shirt.jpg",
        "source_url": "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 9,
        "name": "Sky Blue Ruffled Poplin Top",
        "category": "tops",
        "subCategory": "blouse",
        "primary_color": "blue",
        "color_family": ["blue", "sky-blue"],
        "price": "$54",
        "description": "Pastel sky blue structured poplin top featuring feminine shoulder flounces.",
        "image": "top_sky_blue_ruffle.jpg",
        "source_url": "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80"
    },

    # Bottoms (Jeans, Trousers, Skirts)
    {
        "id": 10,
        "name": "Light Wash Straight Wide-Leg Jeans",
        "category": "jeans",
        "subCategory": "denim",
        "primary_color": "blue",
        "color_family": ["blue", "light-denim"],
        "price": "$88",
        "description": "High-rise vintage light wash denim jeans with relaxed straight wide leg.",
        "image": "bottom_light_blue_jeans.jpg",
        "source_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 11,
        "name": "Ecru High-Waist Pleated Trousers",
        "category": "trousers",
        "subCategory": "tailored",
        "primary_color": "cream",
        "color_family": ["cream", "beige", "white"],
        "price": "$92",
        "description": "Tailored ecru wide-leg trousers with front double pleats and structured waistband.",
        "image": "bottom_ecru_pleated_trousers.jpg",
        "source_url": "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 12,
        "name": "Classic Dark Indigo Flare Denim",
        "category": "jeans",
        "subCategory": "denim",
        "primary_color": "blue",
        "color_family": ["blue", "navy", "dark-denim"],
        "price": "$90",
        "description": "Deep indigo stretch denim with subtle 70s flare silhouette and clean finished hem.",
        "image": "bottom_dark_indigo_jeans.jpg",
        "source_url": "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 13,
        "name": "Ivory Sunray Pleated Midi Skirt",
        "category": "skirts",
        "subCategory": "midi-skirt",
        "primary_color": "white",
        "color_family": ["white", "ivory", "cream"],
        "price": "$78",
        "description": "Flowing accordion sunray pleated midi skirt in shimmering soft ivory crepe.",
        "image": "bottom_ivory_pleated_skirt.jpg",
        "source_url": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 14,
        "name": "Camel Tailored Fluid Trousers",
        "category": "trousers",
        "subCategory": "tailored",
        "primary_color": "beige",
        "color_family": ["beige", "camel", "tan"],
        "price": "$85",
        "description": "Sophisticated camel trousers cut with a fluid silhouette and belt loops.",
        "image": "bottom_camel_fluid_trousers.jpg",
        "source_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 15,
        "name": "Dusty Rose Bias-Cut Satin Slip Skirt",
        "category": "skirts",
        "subCategory": "slip-skirt",
        "primary_color": "pink",
        "color_family": ["pink", "dusty-rose"],
        "price": "$72",
        "description": "Lustrous heavy satin midi skirt cut on the bias for an effortless fluid drape.",
        "image": "bottom_rose_satin_skirt.jpg",
        "source_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 16,
        "name": "Charcoal Grey Slim Cigarette Pants",
        "category": "trousers",
        "subCategory": "tailored",
        "primary_color": "black",
        "color_family": ["black", "charcoal", "grey"],
        "price": "$84",
        "description": "Cropped ankle-grazing cigarette pants in wool-blend dark charcoal grey.",
        "image": "bottom_charcoal_trousers.jpg",
        "source_url": "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 17,
        "name": "Olive Green High-Rise Cargo Trousers",
        "category": "trousers",
        "subCategory": "casual",
        "primary_color": "green",
        "color_family": ["green", "olive"],
        "price": "$82",
        "description": "Modern minimalist cargo pants in muted olive twill with clean patch pockets.",
        "image": "bottom_olive_cargo_pants.jpg",
        "source_url": "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80"
    },

    # Dresses
    {
        "id": 18,
        "name": "Blush Pink Floral Tiered Midi Dress",
        "category": "dresses",
        "subCategory": "midi-dress",
        "primary_color": "pink",
        "color_family": ["pink", "blush", "rose"],
        "price": "$128",
        "description": "Breezy tiered midi dress adorned with watercolor floral blossoms and tie straps.",
        "image": "dress_blush_floral_midi.jpg",
        "source_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 19,
        "name": "Emerald Green Satin Slip Dress",
        "category": "dresses",
        "subCategory": "slip-dress",
        "primary_color": "green",
        "color_family": ["green", "emerald"],
        "price": "$115",
        "description": "Glamorous jewel-toned emerald silk-satin slip dress with cowl neck and side slit.",
        "image": "dress_emerald_satin_slip.jpg",
        "source_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 20,
        "name": "White Bohemian Cotton Maxi Dress",
        "category": "dresses",
        "subCategory": "maxi-dress",
        "primary_color": "white",
        "color_family": ["white", "ivory"],
        "price": "$135",
        "description": "Carefree white linen maxi dress with lace insets and tiered voluminous hem.",
        "image": "dress_white_boho_maxi.jpg",
        "source_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 21,
        "name": "Little Black Velvet Sheath Dress",
        "category": "dresses",
        "subCategory": "cocktail",
        "primary_color": "black",
        "color_family": ["black"],
        "price": "$140",
        "description": "Architectural little black dress in plush velvet with square neckline.",
        "image": "dress_black_velvet_sheath.jpg",
        "source_url": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 22,
        "name": "Lavender Floral Sundress",
        "category": "dresses",
        "subCategory": "sundress",
        "primary_color": "purple",
        "color_family": ["purple", "lavender", "lilac"],
        "price": "$110",
        "description": "Charming pastel lilac sundress with gathered bust and delicate tie bow straps.",
        "image": "dress_lavender_sundress.jpg",
        "source_url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
    },

    # Handbags
    {
        "id": 23,
        "name": "Ivory Structured Leather Top-Handle Bag",
        "category": "handbags",
        "subCategory": "top-handle",
        "primary_color": "white",
        "color_family": ["white", "ivory", "cream"],
        "price": "$165",
        "description": "Polished ivory smooth box calfskin handbag finished with signature brushed gold hardware.",
        "image": "bag_ivory_structured.jpg",
        "source_url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 24,
        "name": "Blush Rose Leather Crossbody Bag",
        "category": "handbags",
        "subCategory": "crossbody",
        "primary_color": "pink",
        "color_family": ["pink", "blush", "rose"],
        "price": "$145",
        "description": "Compact camera crossbody in dusty blush pebbled leather with adjustable guitar strap.",
        "image": "bag_blush_crossbody.jpg",
        "source_url": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 25,
        "name": "Natural Raffia Round Woven Crossbody",
        "category": "handbags",
        "subCategory": "straw-bag",
        "primary_color": "beige",
        "color_family": ["beige", "tan", "straw"],
        "price": "$95",
        "description": "Handcrafted circular woven straw tambour bag with caramel leather trim and tassel.",
        "image": "bag_natural_straw_circle.jpg",
        "source_url": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 26,
        "name": "Cognac Tan Leather Shoulder Bag",
        "category": "handbags",
        "subCategory": "shoulder-bag",
        "primary_color": "beige",
        "color_family": ["beige", "tan", "brown"],
        "price": "$175",
        "description": "Slouchy 90s baguette shoulder purse in rich buttery cognac saddle leather.",
        "image": "bag_cognac_tan_shoulder.jpg",
        "source_url": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 27,
        "name": "Black Quilted Chain Flap Bag",
        "category": "handbags",
        "subCategory": "chain-bag",
        "primary_color": "black",
        "color_family": ["black"],
        "price": "$190",
        "description": "Iconic diamond quilted black lambskin handbag with interwoven gilded chain strap.",
        "image": "bag_black_quilted_chain.jpg",
        "source_url": "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 28,
        "name": "Plum Burgundy Suede Crescent Bag",
        "category": "handbags",
        "subCategory": "crescent",
        "primary_color": "purple",
        "color_family": ["purple", "plum", "burgundy"],
        "price": "$155",
        "description": "Contemporary crescent moon hobo bag rendered in rich berry plum velvet suede.",
        "image": "bag_plum_burgundy_crescent.jpg",
        "source_url": "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=600&q=80"
    },

    # Shoes
    {
        "id": 29,
        "name": "Minimalist White Leather Tennis Sneakers",
        "category": "shoes",
        "subCategory": "sneakers",
        "primary_color": "white",
        "color_family": ["white", "cream"],
        "price": "$110",
        "description": "Clean-profile white calf leather low-top sneakers with cushioned cupsole.",
        "image": "shoes_white_minimal_sneakers.jpg",
        "source_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 30,
        "name": "Strappy Beige Block Heel Sandals",
        "category": "shoes",
        "subCategory": "heels",
        "primary_color": "beige",
        "color_family": ["beige", "nude", "tan"],
        "price": "$125",
        "description": "Barely-there tubular strap sandals in warm sand beige with sculptural block heel.",
        "image": "shoes_beige_block_sandals.jpg",
        "source_url": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 31,
        "name": "Nude Pointed Slingback Pumps",
        "category": "shoes",
        "subCategory": "heels",
        "primary_color": "beige",
        "color_family": ["beige", "blush", "nude"],
        "price": "$135",
        "description": "Elegant pointed-toe slingback heels in matte nude patent with kitten heel.",
        "image": "shoes_nude_slingback_pumps.jpg",
        "source_url": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 32,
        "name": "Classic Black Leather Ankle Booties",
        "category": "shoes",
        "subCategory": "boots",
        "primary_color": "black",
        "color_family": ["black"],
        "price": "$160",
        "description": "Chic Chelsea ankle boots in polished black leather with elastic gussets and stacked heel.",
        "image": "shoes_black_leather_boots.jpg",
        "source_url": "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 33,
        "name": "Camel Woven Slide Sandals",
        "category": "shoes",
        "subCategory": "flats",
        "primary_color": "beige",
        "color_family": ["beige", "camel", "tan"],
        "price": "$95",
        "description": "Braided artisan slide sandals in rich golden camel leather with cushioned footbed.",
        "image": "shoes_camel_woven_slides.jpg",
        "source_url": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": 34,
        "name": "Lilac Pastel Pointed Loafer Mules",
        "category": "shoes",
        "subCategory": "mules",
        "primary_color": "purple",
        "color_family": ["purple", "lavender", "lilac"],
        "price": "$120",
        "description": "Chic slip-on loafer mules in soft lavender leather featuring equestrian bit hardware.",
        "image": "shoes_lilac_pastel_mules.jpg",
        "source_url": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=600&q=80"
    }
]

COLOR_RGB_MAP = {
    "pink": (232, 160, 180),
    "cream": (245, 238, 225),
    "red": (180, 50, 65),
    "white": (250, 250, 250),
    "purple": (160, 130, 185),
    "black": (40, 35, 45),
    "green": (110, 140, 115),
    "blue": (100, 145, 190),
    "beige": (215, 190, 165)
}

def create_synthetic_fashion_image(product, file_path):
    """Fallback generator: creates a stylish editorial product card if network fails."""
    width, height = 400, 500
    img = Image.new("RGB", (width, height), (250, 248, 247))
    draw = ImageDraw.Draw(img)

    primary_color_name = product.get("primary_color", "pink")
    main_rgb = COLOR_RGB_MAP.get(primary_color_name, (220, 160, 180))

    # Gradient backdrop soft circle
    draw.ellipse([50, 60, 350, 360], fill=(245, 238, 245), outline=(237, 227, 244), width=2)
    draw.ellipse([80, 90, 320, 330], fill=main_rgb)

    # Accent decorative curves
    draw.rectangle([130, 140, 270, 280], outline=(255, 255, 255), width=3)
    draw.rectangle([150, 370, 250, 374], fill=(121, 80, 163))

    img.save(file_path, "JPEG", quality=90)
    print(f"Generated synthetic backup fashion image for: {product['name']}")

def download_or_generate_images():
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)"
    }
    for prod in PRODUCTS:
        img_name = prod["image"]
        target_path = os.path.join(CATALOG_DIR, img_name)
        frontend_target = os.path.join(FRONTEND_CATALOG_DIR, img_name)

        if not os.path.exists(target_path):
            downloaded = False
            try:
                print(f"Downloading {prod['name']} from Unsplash...")
                r = requests.get(prod["source_url"], headers=headers, timeout=8)
                if r.status_code == 200 and len(r.content) > 2000:
                    with open(target_path, "wb") as f:
                        f.write(r.content)
                    downloaded = True
                    print(f" Saved {img_name} ({len(r.content)} bytes)")
            except Exception as e:
                print(f" Download error for {prod['name']}: {e}")

            if not downloaded:
                create_synthetic_fashion_image(prod, target_path)

        # Copy to frontend public/catalog as well
        if os.path.exists(target_path) and not os.path.exists(frontend_target):
            with open(target_path, "rb") as src, open(frontend_target, "wb") as dst:
                dst.write(src.read())

def generate_sample_query_images():
    """Generates sample query images for testing and rapid UI demonstration."""
    sample_items = [
        {"name": "sample_pink_floral_top.jpg", "color": (230, 155, 175), "cat": "Women's Top"},
        {"name": "sample_blue_denim.jpg", "color": (110, 145, 195), "cat": "Denim Jeans"},
        {"name": "sample_emerald_dress.jpg", "color": (60, 130, 95), "cat": "Evening Dress"},
        {"name": "sample_ivory_handbag.jpg", "color": (245, 240, 230), "cat": "Leather Handbag"}
    ]

    for item in sample_items:
        # Check if first catalog item image exists to use as high-res reference
        src_top = os.path.join(CATALOG_DIR, "top_pink_floral_puff.jpg")
        tgt_backend = os.path.join(BASE_DIR, "uploads", item["name"])
        tgt_frontend = os.path.join(FRONTEND_SAMPLES_DIR, item["name"])

        if item["name"] == "sample_pink_floral_top.jpg" and os.path.exists(src_top):
            with open(src_top, "rb") as s, open(tgt_frontend, "wb") as d:
                d.write(s.read())
            if not os.path.exists(tgt_backend):
                with open(src_top, "rb") as s, open(tgt_backend, "wb") as d:
                    d.write(s.read())
        else:
            img = Image.new("RGB", (400, 500), (250, 248, 247))
            d = ImageDraw.Draw(img)
            d.ellipse([60, 80, 340, 360], fill=item["color"])
            d.rectangle([140, 160, 260, 280], outline=(255, 255, 255), width=3)
            img.save(tgt_frontend, "JPEG", quality=90)
            img.save(tgt_backend, "JPEG", quality=90)

def extract_dominant_colors_and_hist(image_path, k=4):
    """
    OpenCV implementation of:
    1. HSV Histogram extraction using cv2.calcHist & cv2.normalize
    2. Dominant color extraction using cv2.kmeans
    """
    bgr = cv2.imread(image_path)
    if bgr is None:
        raise ValueError(f"Could not load image: {image_path}")

    # Resize to standard 256x256 for consistent analysis
    bgr = cv2.resize(bgr, (256, 256), interpolation=cv2.INTER_AREA)

    # 1. Calculate 3D HSV Color Histogram (Hue: 8 bins, Saturation: 8 bins, Value: 8 bins = 512 bins)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv], [0, 1, 2], None, [8, 8, 8], [0, 180, 0, 256, 0, 256])
    cv2.normalize(hist, hist, alpha=0, beta=1, norm_type=cv2.NORM_MINMAX)
    hist_flattened = hist.flatten().tolist()

    # 2. Extract Dominant Colors via K-Means on RGB
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    pixels = rgb.reshape((-1, 3)).astype(np.float32)

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 15, 0.2)
    flags = cv2.KMEANS_RANDOM_CENTERS
    compactness, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, flags)

    # Calculate cluster percentages
    counts = np.bincount(labels.flatten())
    total_pixels = len(labels)
    order = np.argsort(counts)[::-1]

    dominant_colors = []
    for idx in order:
        c = centers[idx].astype(int)
        r, g, b = int(c[0]), int(c[1]), int(c[2])
        hex_code = f"#{r:02x}{g:02x}{b:02x}".upper()
        percentage = round(float(counts[idx]) / total_pixels * 100, 1)
        dominant_colors.append({
            "hex": hex_code,
            "rgb": [r, g, b],
            "percentage": percentage
        })

    return hist_flattened, dominant_colors

def precompute_catalog():
    print("Precomputing HSV histograms & dominant colors for local catalog...")
    catalog_metadata = []

    for prod in PRODUCTS:
        img_path = os.path.join(CATALOG_DIR, prod["image"])
        try:
            hist, dominant = extract_dominant_colors_and_hist(img_path)
            item = dict(prod)
            item["histogram"] = hist
            item["dominant_colors"] = dominant
            catalog_metadata.append(item)
        except Exception as e:
            print(f"Error extracting features for {prod['name']}: {e}")

    # Save to data/products.json
    products_file = os.path.join(DATA_DIR, "products.json")
    with open(products_file, "w") as f:
        json.dump(catalog_metadata, f, indent=2)

    print(f"Successfully configured catalog with {len(catalog_metadata)} products.")

if __name__ == "__main__":
    download_or_generate_images()
    generate_sample_query_images()
    precompute_catalog()
