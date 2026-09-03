"""Prepare brand and editorial assets for the final pure static package without modifying source media."""
from pathlib import Path
import shutil
import subprocess
from PIL import Image

SOURCE = Path("/home/ubuntu/webdev-static-assets")
OUTPUT = SOURCE / "emarket247-static-common"
BRAND = OUTPUT / "brand"
EDITORIAL = OUTPUT / "editorial"

COPYRIGHT = "© eMarket247. All rights reserved."

def write_metadata(path: Path, title: str, description: str):
    subprocess.run([
        "exiftool", "-overwrite_original", f"-XMP-dc:Title={title}",
        f"-XMP-dc:Description={description}", f"-XMP-dc:Rights={COPYRIGHT}",
        "-XMP-dc:Creator=eMarket247", "-XMP-photoshop:Credit=eMarket247",
        "-XMP-xmpRights:WebStatement=https://emarket247.shop/", str(path)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)

def main():
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    BRAND.mkdir(parents=True)
    EDITORIAL.mkdir(parents=True)
    shutil.copy2(SOURCE / "emarket247-logo-transparent.png", BRAND / "emarket247-logo-transparent.png")
    shutil.copy2(SOURCE / "emarket247-favicon-master.png", BRAND / "emarket247-favicon-master.png")
    campaigns = [
        ("emarket247-hero-vermilion-atelier.jpg", "emarket247-hero-vermilion-atelier.webp", "eMarket247 Vermilion Atelier hero"),
        ("emarket247-bridal-occasion-editorial.jpg", "emarket247-bridal-occasion-editorial.webp", "eMarket247 bridal occasion editorial"),
        ("emarket247-gifting-puja-editorial.jpg", "emarket247-gifting-puja-editorial.webp", "eMarket247 gifting and Puja editorial"),
    ]
    for source_name, output_name, title in campaigns:
        with Image.open(SOURCE / source_name) as image:
            image.convert("RGB").save(EDITORIAL / output_name, "WEBP", quality=86, method=6)
        write_metadata(EDITORIAL / output_name, title, "Editorial image for the eMarket247 Fashion & Jewellery storefront.")
    print(f"Prepared common static assets at {OUTPUT}")

if __name__ == "__main__":
    main()
