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

def get_complementary_items(category: str, primary_color: str):
    """
    Finds matching catalog items grouped by Bottoms, Shoes, and Accessories.
    """
    catalog = load_catalog()
    compatible_colors = COLOR_HARMONY_RULES.get(primary_color.lower(), ["cream", "white", "blue", "beige"])

    def score_color_match(item):
        item_colors = item.get("color_family", [item.get("primary_color", "")])
        for c in item_colors:
            if c in compatible_colors:
                return 2
        if item.get("primary_color", "") in ["white", "cream", "black"]:
            return 1
        return 0

    # Categorize catalog
    bottoms_pool = [i for i in catalog if i.get("category") in ["jeans", "trousers", "skirts"]]
    shoes_pool = [i for i in catalog if i.get("category") == "shoes"]
    accessories_pool = [i for i in catalog if i.get("category") == "handbags"]
    tops_pool = [i for i in catalog if i.get("category") == "tops"]

    # Rank each pool by color harmony
    bottoms_ranked = sorted(bottoms_pool, key=score_color_match, reverse=True)
    shoes_ranked = sorted(shoes_pool, key=score_color_match, reverse=True)
    accessories_ranked = sorted(accessories_pool, key=score_color_match, reverse=True)
    tops_ranked = sorted(tops_pool, key=score_color_match, reverse=True)

    def clean_item(item):
        return {
            "id": item["id"],
            "name": item["name"],
            "category": item["category"],
            "subCategory": item.get("subCategory", ""),
            "primary_color": item.get("primary_color", ""),
            "price": item.get("price", ""),
            "image": item["image"],
            "imageUrl": f"/catalog/{item['image']}",
            "dominant_colors": item.get("dominant_colors", [])
        }

    return {
        "bottoms": [clean_item(x) for x in bottoms_ranked[:4]],
        "shoes": [clean_item(x) for x in shoes_ranked[:4]],
        "accessories": [clean_item(x) for x in accessories_ranked[:4]],
        "tops": [clean_item(x) for x in tops_ranked[:4]]
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
