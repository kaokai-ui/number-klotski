from PIL import Image
import os

ROLE_DIR = os.path.join(os.path.dirname(__file__), "role")
OUT_DIR = os.path.join(os.path.dirname(__file__), "public", "role")
NUMBER_TILE_SRC = os.path.join(os.path.dirname(__file__), "wbsmall.png")
NUMBER_TILE_OUT = os.path.join(os.path.dirname(__file__), "public", "wbsmall.png")

PIECE_PIXEL = 256

SIZES = {
    "cao-cao": (PIECE_PIXEL * 2, PIECE_PIXEL * 2),
    "block-1": (PIECE_PIXEL, PIECE_PIXEL * 2),
    "block-2": (PIECE_PIXEL, PIECE_PIXEL * 2),
    "block-3": (PIECE_PIXEL, PIECE_PIXEL * 2),
    "block-4": (PIECE_PIXEL, PIECE_PIXEL * 2),
    "special": (PIECE_PIXEL * 2, PIECE_PIXEL),
    "solider-1": (PIECE_PIXEL, PIECE_PIXEL),
    "solider-2": (PIECE_PIXEL, PIECE_PIXEL),
    "solider-3": (PIECE_PIXEL, PIECE_PIXEL),
    "solider-4": (PIECE_PIXEL, PIECE_PIXEL),
}

os.makedirs(OUT_DIR, exist_ok=True)

for filename in os.listdir(ROLE_DIR):
    name, ext = os.path.splitext(filename)
    if ext.lower() not in (".png", ".jpg", ".jpeg", ".webp"):
        continue
    if name not in SIZES:
        print(f"SKIP {filename} (no size config)")
        continue

    target_w, target_h = SIZES[name]
    src = os.path.join(ROLE_DIR, filename)
    dst = os.path.join(OUT_DIR, f"{name}.png")

    img = Image.open(src)
    img = img.resize((target_w, target_h), Image.LANCZOS)
    img.save(dst, "PNG", optimize=True)
    print(f"OK   {filename} -> {target_w}x{target_h}")

if os.path.exists(NUMBER_TILE_SRC):
    tile_img = Image.open(NUMBER_TILE_SRC)
    tile_img = tile_img.resize((PIECE_PIXEL, PIECE_PIXEL), Image.LANCZOS)
    tile_img.save(NUMBER_TILE_OUT, "PNG", optimize=True)
    print(f"OK   wbsmall.png -> {PIECE_PIXEL}x{PIECE_PIXEL}")

print("Done")
