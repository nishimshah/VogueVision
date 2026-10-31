import os
import shutil
from PIL import Image

BASE_DIR = "/Users/Nishra/Desktop/voguevision"
CATALOG_BACKEND = os.path.join(BASE_DIR, "backend", "catalog", "product_images")
CATALOG_FRONTEND = os.path.join(BASE_DIR, "frontend", "public", "catalog")
SAMPLES_FRONTEND = os.path.join(BASE_DIR, "frontend", "public", "samples")
UPLOADS_BACKEND = os.path.join(BASE_DIR, "backend", "uploads")

os.makedirs(CATALOG_BACKEND, exist_ok=True)
os.makedirs(CATALOG_FRONTEND, exist_ok=True)
os.makedirs(SAMPLES_FRONTEND, exist_ok=True)
os.makedirs(UPLOADS_BACKEND, exist_ok=True)

# Mapping of catalog filename -> source image path
replacements = {
    # 1. Tops
    "top_pink_floral_puff.jpg": "backend/catalog/crops/uploaded_sample.jpg",
    "top_cream_botanical.jpg": "backend/catalog/cands2/top_cream_botanical_1.jpg",
    "top_dusty_rose_ruched.jpg": "backend/catalog/cands2/top_dusty_rose_ruched_2.jpg",
    "top_crimson_floral.jpg": "backend/catalog/cands2/top_crimson_floral_0.jpg",
    "top_white_embroidered.jpg": "backend/catalog/cands2/top_white_embroidered_0.jpg",
    "top_lavender_ribbed.jpg": "backend/catalog/cands2/top_lavender_ribbed_2.jpg",
    "top_black_silk_cami.jpg": "backend/catalog/test_cami.jpg",
    "top_sage_linen_shirt.jpg": "backend/catalog/cands2/top_sage_linen_shirt_1.jpg",
    "top_sky_blue_ruffle.jpg": "backend/catalog/cand_blue_top_2.jpg",

    # 2. Bottoms
    "bottom_light_blue_jeans.jpg": "backend/catalog/cands2/bottom_light_blue_jeans_2.jpg",
    "bottom_ecru_pleated_trousers.jpg": "backend/catalog/cands2/bottom_ecru_pleated_trousers_1.jpg",
    "bottom_dark_indigo_jeans.jpg": "backend/catalog/cands2/bottom_dark_indigo_jeans_0.jpg",
    "bottom_ivory_pleated_skirt.jpg": "backend/catalog/cands2/bottom_ivory_pleated_skirt_2.jpg",
    # bottom_camel_fluid_trousers.jpg is already valid in catalog
    "bottom_rose_satin_skirt.jpg": "backend/catalog/cands2/bottom_rose_satin_skirt_1.jpg",
    "bottom_charcoal_trousers.jpg": "backend/catalog/test_black_trousers.jpg",
    # bottom_olive_cargo_pants.jpg is already valid in catalog

    # 3. Dresses
    "dress_blush_floral_midi.jpg": "backend/catalog/cands2/dress_blush_floral_midi_0.jpg",
    "dress_emerald_satin_slip.jpg": "backend/catalog/cand_emerald_dress_1.jpg",
    # dress_white_boho_maxi.jpg is already valid in catalog
    "dress_black_velvet_sheath.jpg": "backend/catalog/test_black_dress.jpg",
    "dress_lavender_sundress.jpg": "backend/catalog/cand_purple_dress_2.jpg",

    # 4. Handbags
    "bag_ivory_structured.jpg": "backend/catalog/cands2/bag_ivory_structured_1.jpg",
    "bag_blush_crossbody.jpg": "backend/catalog/cands2/bag_blush_crossbody_0.jpg",
    "bag_natural_straw_circle.jpg": "backend/catalog/cands2/bag_natural_straw_circle_1.jpg",
    "bag_cognac_tan_shoulder.jpg": "backend/catalog/cand_tan_bag_1.jpg",
    "bag_black_quilted_chain.jpg": "backend/catalog/test_black_bag.jpg",
    "bag_plum_burgundy_crescent.jpg": "backend/catalog/cands2/bag_plum_burgundy_crescent_0.jpg",

    # 5. Shoes
    # shoes_white_minimal_sneakers.jpg already updated to photo-1622760806530-3cb6301c087d
    "shoes_beige_block_sandals.jpg": "backend/catalog/cands2/shoes_beige_block_sandals_0.jpg",
    "shoes_nude_slingback_pumps.jpg": "backend/catalog/test_nude_heels.jpg",
    "shoes_black_leather_boots.jpg": "backend/catalog/test_boots.jpg",
    "shoes_camel_woven_slides.jpg": "backend/catalog/cand_camel_slides_0.jpg",
    "shoes_lilac_pastel_mules.jpg": "backend/catalog/cands2/shoes_lilac_pastel_mules_1.jpg"
}

def standardize_image(src_path, dst_path, target_size=(400, 500)):
    im = Image.open(src_path).convert("RGB")
    # Resize preserving aspect ratio and fit into target_size with center crop or letterbox
    # Or high-quality bicubic resize
    w, h = im.size
    target_w, target_h = target_size
    target_aspect = target_w / target_h
    im_aspect = w / h

    if im_aspect > target_aspect:
        # Image is wider: crop width
        new_w = int(h * target_aspect)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    else:
        # Image is taller: crop height centered
        new_h = int(w / target_aspect)
        top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))

    im = im.resize(target_size, Image.Resampling.LANCZOS)
    im.save(dst_path, "JPEG", quality=92)

print("Applying catalog replacements...")
for filename, src in replacements.items():
    src_path = os.path.join(BASE_DIR, src)
    if not os.path.exists(src_path):
        print(f"WARNING: Source missing {src_path}")
        continue
    
    # Write to backend catalog
    tgt_b = os.path.join(CATALOG_BACKEND, filename)
    standardize_image(src_path, tgt_b)

    # Copy to frontend catalog
    tgt_f = os.path.join(CATALOG_FRONTEND, filename)
    shutil.copyfile(tgt_b, tgt_f)
    print(f"  Updated {filename}")

# Also ensure any unmodified catalog images exist in frontend catalog
for f in os.listdir(CATALOG_BACKEND):
    if f.endswith(".jpg"):
        dst_f = os.path.join(CATALOG_FRONTEND, f)
        if not os.path.exists(dst_f) or os.path.getmtime(os.path.join(CATALOG_BACKEND, f)) > os.path.getmtime(dst_f):
            shutil.copyfile(os.path.join(CATALOG_BACKEND, f), dst_f)

# Update test sample images in frontend/public/samples and backend/uploads
samples = {
    "sample_pink_floral_top.jpg": os.path.join(CATALOG_BACKEND, "top_pink_floral_puff.jpg"),
    "sample_blue_denim.jpg": os.path.join(CATALOG_BACKEND, "bottom_light_blue_jeans.jpg"),
    "sample_emerald_dress.jpg": os.path.join(CATALOG_BACKEND, "dress_emerald_satin_slip.jpg"),
    "sample_ivory_handbag.jpg": os.path.join(CATALOG_BACKEND, "bag_ivory_structured.jpg")
}

for sname, src in samples.items():
    if os.path.exists(src):
        dst_sf = os.path.join(SAMPLES_FRONTEND, sname)
        dst_ub = os.path.join(UPLOADS_BACKEND, sname)
        shutil.copyfile(src, dst_sf)
        shutil.copyfile(src, dst_ub)
        print(f"  Updated sample {sname}")

print("Replacement application complete.")
