import requests
import json

url = "http://127.0.0.1:5001/api/analyze"

tests = [
    {"name": "Blush Floral Top (Unfiltered)", "file": "frontend/public/samples/sample_pink_floral_top.jpg", "category": None},
    {"name": "Blush Floral Top (Filter: tops)", "file": "frontend/public/samples/sample_pink_floral_top.jpg", "category": "tops"},
    {"name": "Light Blue Denim (Filter: jeans)", "file": "frontend/public/samples/sample_blue_denim.jpg", "category": "jeans"},
    {"name": "Emerald Dress (Filter: dresses)", "file": "frontend/public/samples/sample_emerald_dress.jpg", "category": "dresses"},
    {"name": "Ivory Handbag (Filter: handbags)", "file": "frontend/public/samples/sample_ivory_handbag.jpg", "category": "handbags"}
]

for t in tests:
    test_name = t["name"]
    print(f"\n==================== {test_name} ====================")
    with open(t["file"], "rb") as f:
        data = {}
        if t["category"]:
            data["category"] = t["category"]
        files = {"image": (t["file"].split("/")[-1], f, "image/jpeg")}
        r = requests.post(url, data=data, files=files)
        if r.status_code != 200:
            print("ERROR:", r.status_code, r.text)
            continue
        res = r.json()
        pri_col = res["uploaded_image"]["primary_color"]
        cat = res["uploaded_image"]["detected_category"]
        print(f"Detected Primary Color: {pri_col}")
        print(f"Detected Category: {cat}")
        dom_list = [f"{c['hex']} ({c['percentage']}%)" for c in res["dominant_colors"]]
        print(f"Dominant Colors: {dom_list}")
        print("Top 3 Similar Products:")
        for sp in res["similar_products"][:3]:
            pid = sp["id"]
            pcat = sp["category"]
            pname = sp["name"]
            score = sp["similarity_score"]
            pcol = sp["primary_color"]
            print(f"  - #{pid} [{pcat}] {pname} | Score: {score}% | Pri: {pcol}")

print("\nAll similarity and category filtering tests completed.")
