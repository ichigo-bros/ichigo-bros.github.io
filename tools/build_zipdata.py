import csv, json, os, re, sys, collections

SRC = sys.argv[1] if len(sys.argv) > 1 else r"utf_ken_all.csv"  # 日本郵便の utf_ken_all.csv
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "zipdata")

def clean_town(t):
    t = re.sub(r"（[^）]*）?", "", t)           # （…）と、閉じていない（以降を除く
    t = t.strip()
    if t == "以下に掲載がない場合" or t.endswith("の次に番地がくる場合") or t.endswith("を除く") or "〜" in t or "、" in t:
        return ""
    if t.endswith("一円"):
        t = t[:-2] if len(t) > 2 else ""
    return t

entries = collections.defaultdict(list)
with open(SRC, encoding="utf-8", newline="") as f:
    for row in csv.reader(f):
        z = row[2]
        entries[z].append((row[6], row[7], clean_town(row[8])))

shards = collections.defaultdict(dict)
blank = 0
for z, rows in entries.items():
    pref, city = rows[0][0], rows[0][1]
    towns = {r[2] for r in rows}
    town = towns.pop() if len(towns) == 1 else ""
    if not town:
        blank += 1
    shards[z[:3]][z[3:]] = [pref, city, town]

os.makedirs(OUT, exist_ok=True)
for fn in os.listdir(OUT):
    if fn.endswith(".json"):
        os.remove(os.path.join(OUT, fn))
total = 0
for k, d in shards.items():
    p = os.path.join(OUT, k + ".json")
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        json.dump(d, f, ensure_ascii=False, separators=(",", ":"))
    total += os.path.getsize(p)
print("zips", len(entries), "shards", len(shards), "bytes", total, "blank_town", blank)
for z in ("3230014", "3290056", "1000001", "0600000"):
    k = shards.get(z[:3], {}).get(z[3:])
    print(z, k)
