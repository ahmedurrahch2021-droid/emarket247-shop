"""Prepare lightweight, metadata-bearing editorial WebP files for the Hostinger package without changing their visual subject matter."""
from pathlib import Path
from PIL import Image

SOURCE_DIR = Path("/home/ubuntu/webdev-static-assets")
OUTPUT_DIR = SOURCE_DIR / "optimized"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ASSETS = [
    ("emarket247-hero-vermilion-atelier.jpg", "emarket247-hero-vermilion-atelier.webp"),
    ("emarket247-bridal-occasion-editorial.jpg", "emarket247-bridal-occasion-editorial.webp"),
    ("emarket247-gifting-puja-editorial.jpg", "emarket247-gifting-puja-editorial.webp"),
]

for source_name, output_name in ASSETS:
    with Image.open(SOURCE_DIR / source_name) as source:
        image = source.convert("RGB")
        image.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
        image.save(OUTPUT_DIR / output_name, "WEBP", quality=82, method=6)
        print(f"{source_name} -> {output_name}: {image.width}x{image.height}")
