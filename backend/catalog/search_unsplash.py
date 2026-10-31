import urllib.request
import urllib.parse
import json

def search_unsplash(query):
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(query)}&per_page=10"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            results = []
            for r in data.get("results", []):
                results.append({
                    "id": r["id"],
                    "desc": r.get("description") or r.get("alt_description") or "",
                    "color": r.get("color") or "",
                    "regular": r["urls"]["regular"]
                })
            return results
    except Exception as e:
        print(f"Error querying {query}: {e}")
        return []

queries = [
    "pink floral blouse",
    "cream floral top",
    "white embroidered blouse",
    "lavender ribbed top",
    "light blue linen shirt",
    "pink satin midi skirt",
    "cream pleated trousers",
    "white leather sneakers",
    "beige strappy sandals",
    "straw crossbody bag",
    "pink leather crossbody bag",
    "lavender sundress",
    "lilac mules shoes"
]

def main():
    for q in queries:
        res = search_unsplash(q)
        print(f"=== {q} ({len(res)}) ===")
        for r in res[:4]:
            item_id = r['id']
            color = r['color']
            desc = r['desc'][:45]
            print(f"  {item_id} | {color} | {desc}")

if __name__ == "__main__":
    main()
