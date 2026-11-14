"""Extract the supplied reference artwork without synthesizing or redrawing dots.

Usage: python scripts/extract-hero-artwork.py path/to/reference.jpg
Requires Pillow; used only for asset preparation, not by the application.
"""

from pathlib import Path
import sys
from PIL import Image, ImageDraw


source = Image.open(sys.argv[1]).convert("RGB")
if source.size != (1199, 781):
    raise SystemExit("Expected the original 1199 x 781 reference image.")

# Crop away the reference's outer frame. Preserve the artwork at native size.
art = source.crop((34, 55, 1166, 731))
selection = Image.new("L", source.size, 0)
draw = ImageDraw.Draw(selection)
# These selections contain artwork only: no heading, button, logos or footer.
draw.polygon([(34, 295), (260, 290), (410, 350), (500, 450),
              (500, 540), (34, 540)], fill=255)
draw.polygon([(690, 385), (800, 365), (980, 322), (1166, 322),
              (1166, 605), (690, 605)], fill=255)
selection = selection.crop((34, 55, 1166, 731))

# Unmatte the original monochrome pixels from their #f7f7f7 background.
# The dot locations, antialiasing, native resolution and texture stay intact.
alpha = art.convert("L").point(lambda value: max(0, round((247 - value) * 255 / 247)))
alpha.paste(0, mask=selection.point(lambda value: 255 - value))
result = Image.new("RGBA", art.size, (0, 0, 0, 0))
result.putalpha(alpha)
destination = Path(__file__).resolve().parents[1] / "public" / "images" / "claimtrail-hero-artwork.png"
destination.parent.mkdir(parents=True, exist_ok=True)
result.save(destination, optimize=True)
print(f"Saved {destination} ({result.width} x {result.height})")
