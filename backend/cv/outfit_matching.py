"""
Rule-Based Outfit Recommendation & Fashion Color Compatibility Engine
Matches complementary bottoms, shoes, and accessories from the local catalog
based on color theory rules and fashion item categories.
"""

import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS_JSON = os.path.join(BASE_DIR, "data", "products.json")

# Color compatibility matrix based on fashion styling principles
COLOR_HARMONY_RULES = {
    "pink": ["blue", "cream", "white", "beige", "dusty-rose", "black"],
    "red": ["blue", "black", "white", "cream", "beige"],
    "burgundy": ["black", "cream", "beige", "white", "tan"],
    "champagne": ["black", "cream", "beige", "white"],
    "grey": ["blue", "cream", "black", "white", "beige"],
    "blue": ["white", "cream", "beige", "black", "tan", "grey"],
    "green": ["cream", "white", "beige", "tan", "black"],
    "purple": ["cream", "white", "blue", "charcoal", "plum", "beige", "black"],
    "white": ["blue", "black", "cream", "beige", "burgundy", "grey"],
    "cream": ["blue", "beige", "tan", "black", "white", "burgundy"],
    "beige": ["white", "cream", "blue", "black", "tan"],
    "black": ["white", "cream", "grey", "beige", "blue", "burgundy", "champagne"],
    "tan": ["white", "cream", "blue", "black", "beige"],
    "nude": ["white", "cream", "black", "beige"]
}

def load_catalog():
    if not os.path.exists(PRODUCTS_JSON):
        return []
    with open(PRODUCTS_JSON, "r") as f:
        return json.load(f)

VERIFIED_STUDIO_PAIRS = {
    1: {"bottoms": [6], "shoes": [12], "accessories": [16]},  # White Fitted T-Shirt -> Blue Jeans
    2: {"bottoms": [22, 8], "shoes": [27, 13], "accessories": [15]},  # Black Fitted Top -> Cream Mini Skirt (Boots), Beige Trousers
    3: {"bottoms": [7], "shoes": [14], "accessories": [17]},  # Beige Silky Blouse -> Black Trousers
    4: {"bottoms": [6], "shoes": [12], "accessories": [15]},  # White Button-Down Shirt -> Blue Jeans
    5: {"bottoms": [9], "shoes": [14], "accessories": [17]},  # Grey Tank Top -> Cream Skirt
    6: {"tops": [4, 1], "shoes": [12], "accessories": [15, 16]},  # Blue Jeans -> White Shirt, White Tee
    7: {"tops": [20, 3], "shoes": [14, 13], "accessories": [15, 17]},  # Black Trousers -> Burgundy Top, Beige Blouse
    8: {"tops": [2], "shoes": [13], "accessories": [15]},  # Beige Trousers -> Black Top
    9: {"tops": [5], "shoes": [14], "accessories": [17]},  # Cream Skirt -> Grey Tank
    10: {"shoes": [14], "accessories": [15]},  # Black Cocktail Dress
    11: {"shoes": [13], "accessories": [16]},  # Beige Sleeveless Dress
    18: {"bottoms": [19], "shoes": [14], "accessories": [15]},  # Black Satin Corset Top -> Black Satin Maxi Skirt
    19: {"tops": [18, 21], "shoes": [14], "accessories": [15, 17]},  # Black Satin Maxi Skirt -> Black Corset, Champagne Cami
    20: {"bottoms": [7], "shoes": [14], "accessories": [15]},  # Burgundy Off-Shoulder Top -> Black Trousers
    21: {"bottoms": [19], "shoes": [14], "accessories": [17]},  # Champagne Satin Camisole -> Black Satin Maxi Skirt
    22: {"tops": [2], "shoes": [27], "accessories": [15]},  # Cream Mini Skirt -> Black Fitted Top (+ Knee-High Boots)
    27: {"bottoms": [22], "tops": [2]}  # Black Knee-High Boots -> Cream Mini Skirt, Black Fitted Top
}

def get_complementary_items(category: str, primary_color: str, main_item_id: int = None):
    """
    Finds matching catalog items grouped by Bottoms, Shoes, and Accessories.
    Prioritizes verified studio showroom companion items when main_item_id is provided.
    """
    catalog = load_catalog()
    compatible_colors = COLOR_HARMONY_RULES.get(primary_color.lower(), ["cream", "white", "blue", "beige"])

    verified_targets = VERIFIED_STUDIO_PAIRS.get(main_item_id, {}) if main_item_id else {}

    def score_match(item, pool_key):
        score = 0
        if item["id"] in verified_targets.get(pool_key, []):
            score += 100  # Highest priority for verified studio photography pairings

        item_colors = item.get("color_family", [item.get("primary_color", "")])
        for c in item_colors:
            if c in compatible_colors:
                score += 2
                break
        if item.get("primary_color", "") in ["white", "cream", "black"]:
            score += 1
        return score

    # Categorize catalog
    bottoms_pool = [i for i in catalog if i.get("category") in ["jeans", "trousers", "skirts"]]
    shoes_pool = [i for i in catalog if i.get("category") == "shoes"]
    accessories_pool = [i for i in catalog if i.get("category") == "handbags"]
    tops_pool = [i for i in catalog if i.get("category") == "tops"]

    # Rank each pool by verified pairing and color harmony
    bottoms_ranked = sorted(bottoms_pool, key=lambda x: score_match(x, "bottoms"), reverse=True)
    shoes_ranked = sorted(shoes_pool, key=lambda x: score_match(x, "shoes"), reverse=True)
    accessories_ranked = sorted(accessories_pool, key=lambda x: score_match(x, "accessories"), reverse=True)
    tops_ranked = sorted(tops_pool, key=lambda x: score_match(x, "tops"), reverse=True)

    def clean_item(item, pool_key):
        is_companion = item["id"] in verified_targets.get(pool_key, [])
        return {
            "id": item["id"],
            "name": item["name"],
            "category": item["category"],
            "subCategory": item.get("subCategory", ""),
            "primary_color": item.get("primary_color", ""),
            "price": item.get("price", ""),
            "image": item["image"],
            "imageUrl": f"/catalog/{item['image']}",
            "dominant_colors": item.get("dominant_colors", []),
            "has_studio_look": item.get("has_studio_look", False),
            "is_verified_companion": is_companion
        }

    return {
        "bottoms": [clean_item(x, "bottoms") for x in bottoms_ranked[:4]],
        "shoes": [clean_item(x, "shoes") for x in shoes_ranked[:4]],
        "accessories": [clean_item(x, "accessories") for x in accessories_ranked[:4]],
        "tops": [clean_item(x, "tops") for x in tops_ranked[:4]]
    }

def generate_curated_outfits(main_item: dict, primary_color: str):
    """
    Creates 3 distinct styled outfit combination looks:
    1. Casual Everyday Look (e.g., Denim + Sneakers + Casual Crossbody)
    2. Sophisticated Chic (e.g., Tailored Pleated Trousers + Block Heels + Structured Bag)
    3. French Minimalist (e.g., Satin Midi Skirt + Woven Slides / Mules + Straw / Crescent Bag)
    """
    catalog = load_catalog()
    cat_by_id = {item["id"]: item for item in catalog}

    def get_prod(prod_id):
        item = cat_by_id.get(prod_id)
        if not item:
            return None
        return {
            "id": item["id"],
            "name": item["name"],
            "category": item["category"],
            "price": item.get("price", ""),
            "image": item["image"],
            "imageUrl": f"/catalog/{item['image']}"
        }

    # Curate 5 distinct styled looks (matching Outfit 1/5 to 5/5)
    outfits = [
        {
            "id": "look-1",
            "title": "Casual Chic Denim",
            "style": "Relaxed Daytime & Weekend",
            "description": "Effortlessly balanced with high-waist vintage wash denim, clean sneakers, and a soft crossbody.",
            "main_item": main_item,
            "bottom": get_prod(10), # Light wash straight wide jeans
            "shoes": get_prod(29),   # White tennis sneakers
            "accessory": get_prod(23), # Ivory structured bag
            "palette": ["#E8B5C4", "#8EB3D8", "#FAF8F7", "#D4A5B8"]
        },
        {
            "id": "look-2",
            "title": "Tailored Elegance",
            "style": "Editorial & Elevated Brunch",
            "description": "Structured silhouette paired with crisp ecru pleats, sculptural block sandals, and ivory leather.",
            "main_item": main_item,
            "bottom": get_prod(11), # Ecru pleated trousers
            "shoes": get_prod(30),   # Strappy beige block heel sandals
            "accessory": get_prod(24), # Blush crossbody
            "palette": ["#E8B5C4", "#F5EFE6", "#D9C7B2", "#7950A3"]
        },
        {
            "id": "look-3",
            "title": "Romantic Sunray",
            "style": "Graceful Garden & High Tea",
            "description": "Fluid sunray pleated midi skirt paired with camel woven slides and an artisanal woven round bag.",
            "main_item": main_item,
            "bottom": get_prod(13), # Ivory pleated midi skirt
            "shoes": get_prod(33),   # Camel woven slides
            "accessory": get_prod(25), # Raffia round straw bag
            "palette": ["#E8B5C4", "#FAF7F2", "#D1CEC7", "#8B5AC2"]
        },
        {
            "id": "look-4",
            "title": "Monochrome Sophisticate",
            "style": "Evening Gallery & Dining",
            "description": "Tailored black cigarette pants contrasted with nude pointed slingback heels and quilted chain bag.",
            "main_item": main_item,
            "bottom": get_prod(16), # Charcoal black cigarette pants
            "shoes": get_prod(31),   # Nude slingback kitten heels
            "accessory": get_prod(27), # Black quilted chain bag
            "palette": ["#E8B5C4", "#1E1E22", "#F6F4F2", "#8B5AC2"]
        },
        {
            "id": "look-5",
            "title": "Retro Flare",
            "style": "Downtown Metropolitan",
            "description": "Dark indigo flared denim with white minimalist tennis sneakers and a structured top-handle bag.",
            "main_item": main_item,
            "bottom": get_prod(12), # Dark indigo flare denim
            "shoes": get_prod(29),   # White leather sneakers
            "accessory": get_prod(24), # Blush crossbody
            "palette": ["#E8B5C4", "#2B3C58", "#FAF8F7", "#C8B4E8"]
        }
    ]

    return outfits
