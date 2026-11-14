"""Extract the reference's dotted world map as a reusable background asset.

Usage: python scripts/extract-hero-artwork.py path/to/reference.jpg
Requires Pillow, NumPy and OpenCV; used only for asset preparation, not by the app.

The reference is a screenshot containing a navbar, headline, button and footer.
Its map is a field of small, mostly light dots. Connected-component filtering
keeps those dots, drops lettering and controls, and leaves the original dot
positions, texture, resolution and map geometry untouched. No dots are drawn.
"""

from pathlib import Path
import sys

import cv2
import numpy as np
from PIL import Image

source = Image.open(sys.argv[1]).convert("L")
if source.size != (1199, 781):
    raise SystemExit("Expected the original 1199 x 781 reference image.")

# The reference sits inside a light grey frame. Keep only its white interior.
art = np.array(source.crop((34, 56, 1166, 730)))
content = (art < 244).astype("uint8")
count, labels, stats, _ = cv2.connectedComponentsWithStats(content, 8)

# Dots are tiny isolated marks. Text strokes, icons, rules and the button are
# larger connected shapes, so they are excluded rather than painted over.
dots = np.zeros_like(content)
for index in range(1, count):
    x, y, width, height, area = stats[index]
    if area <= 60 and width <= 10 and height <= 10:
        dots[labels == index] = 1

# The map occupies the middle band. Clear incidental leftovers from the nav and
# footer; no map artwork exists outside this range in the reference.
dots[:180] = 0
dots[600:] = 0

# Unmatte the original grey pixels from the reference's #f7f7f7 paper. Dots
# retain their own antialiasing and density, including the darker map marks.
alpha = np.zeros(art.shape, dtype=np.float64)
alpha[dots == 1] = np.clip((247.0 - art[dots == 1]) * 255.0 / 247.0, 0, 255)
result = Image.new("RGBA", (art.shape[1], art.shape[0]), (0, 0, 0, 0))
result.putalpha(Image.fromarray(alpha.astype("uint8")))

destination = Path(__file__).resolve().parents[1] / "public" / "images" / "claimtrail-hero-artwork.png"
destination.parent.mkdir(parents=True, exist_ok=True)
result.save(destination, optimize=True)
print(f"Saved {destination} ({result.width} x {result.height})")
