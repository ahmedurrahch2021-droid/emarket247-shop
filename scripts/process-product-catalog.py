"""Create safe unpriced product derivatives and bilingual catalog metadata from eMarket247 originals.

Original JPEG files are read only. The script emits optimized WebP variants externally under
/home/ubuntu/webdev-static-assets, writes copyright metadata to every derivative, and creates
only conservative, visually supportable bilingual catalog labels.
"""
from __future__ import annotations

import csv
import json
import os
import shutil
import subprocess
from pathlib import Path
from PIL import Image

PROJECT = Path("/home/ubuntu/emarket247-shop")
SOURCE_ROOT = Path("/home/ubuntu/projects/emarket247-pandora-clone-7f5043cd")
MAPPING = SOURCE_ROOT / "phase2-assets/catalog/asset-mapping.csv"
OUTPUT_ROOT = Path("/home/ubuntu/webdev-static-assets/emarket247-product-catalog")
CATALOG_EN = PROJECT / "static-site/assets/data/catalog.en.json"
CATALOG_BN = PROJECT / "static-site/assets/data/catalog.bn.json"
MANIFEST = OUTPUT_ROOT / "product-image-manifest.csv"

COPYRIGHT = "© eMarket247. All rights reserved."
CREATOR = "eMarket247"
RIGHTS_URL = "https://emarket247.shop/"

TEMPORARY_CATEGORIES = {
    14: ("bracelets", "Bracelets", "ব্রেসলেট", "Bracelet-style jewellery detail", "ব্রেসলেট-ধাঁচের জুয়েলারি ডিটেইল"),
    15: ("bracelets", "Bracelets", "ব্রেসলেট", "Bracelet-style jewellery detail", "ব্রেসলেট-ধাঁচের জুয়েলারি ডিটেইল"),
    16: ("necklaces", "Necklaces", "হার", "Necklace-style jewellery detail", "হার-ধাঁচের জুয়েলারি ডিটেইল"),
    17: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    18: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    19: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    20: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    21: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    22: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    23: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    24: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    25: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    26: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    27: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    28: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    29: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    30: ("bangles", "Bangles", "চুড়ি", "Circular jewellery detail", "বৃত্তাকার জুয়েলারি ডিটেইল"),
    32: ("earrings", "Earrings", "কানের দুল", "Earring-style jewellery detail", "কানের দুল-ধাঁচের জুয়েলারি ডিটেইল"),
    46: ("necklaces", "Necklaces", "হার", "Necklace-style jewellery detail", "হার-ধাঁচের জুয়েলারি ডিটেইল"),
    47: ("necklaces", "Necklaces", "হার", "Necklace-style jewellery detail", "হার-ধাঁচের জুয়েলারি ডিটেইল"),
    48: ("necklaces", "Necklaces", "হার", "Necklace-style jewellery detail", "হার-ধাঁচের জুয়েলারি ডিটেইল"),
}

def resize(image: Image.Image, target_width: int) -> Image.Image:
    if image.width <= target_width:
        return image.copy()
    target_height = round(image.height * target_width / image.width)
    return image.resize((target_width, target_height), Image.Resampling.LANCZOS)

def build_alt(index: int, category: str, language: str) -> str:
    if language == "bn":
        prefix = "হালকা রঙের কাপড়ে রাখা সোনালি টোনের "
        descriptor = {"bracelets": "ব্রেসলেট-ধাঁচের জুয়েলারি", "necklaces": "হার-ধাঁচের জুয়েলারি", "bangles": "বৃত্তাকার জুয়েলারি", "earrings": "কানের দুল-ধাঁচের জুয়েলারি"}.get(category, "জুয়েলারি")
        return f"{prefix}{descriptor} ডিটেইলের ক্লোজ-আপ ছবি, রেকর্ড {index:02d}।"
    prefix = "Close-up photograph of a gold-tone "
    descriptor = {"bracelets": "bracelet-style jewellery", "necklaces": "necklace-style jewellery", "bangles": "circular jewellery", "earrings": "earring-style jewellery"}.get(category, "jewellery")
    return f"{prefix}{descriptor} detail on light fabric, record {index:02d}."

def embed_metadata(path: Path, title: str, description: str) -> None:
    command = [
        "exiftool", "-overwrite_original",
        f"-XMP-dc:Title={title}", f"-XMP-dc:Description={description}",
        f"-EXIF:ImageDescription={description}", f"-IPTC:Headline={title}",
        f"-IPTC:Caption-Abstract={description}", f"-XMP-dc:Rights={COPYRIGHT}",
        f"-IPTC:CopyrightNotice={COPYRIGHT}", f"-XMP-dc:Creator={CREATOR}",
        f"-XMP-photoshop:Credit={CREATOR}", f"-XMP-xmpRights:WebStatement={RIGHTS_URL}",
        str(path),
    ]
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)

def main() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    product_dir = OUTPUT_ROOT / "products"
    if product_dir.exists():
        shutil.rmtree(product_dir)
    product_dir.mkdir(exist_ok=True)
    CATALOG_EN.parent.mkdir(parents=True, exist_ok=True)
    rows = []
    catalog_en = []
    catalog_bn = []

    with MAPPING.open(encoding="utf-8", newline="") as handle:
        mapping_rows = list(csv.DictReader(handle))

    for position, row in enumerate(mapping_rows, 1):
        source = SOURCE_ROOT / row["original_filename"]
        if not source.exists():
            raise FileNotFoundError(source)
        category, category_en, category_bn, title_base_en, title_base_bn = TEMPORARY_CATEGORIES.get(
            position, ("jewellery-detail", "Jewellery Detail", "জুয়েলারি ডিটেইল", "Jewellery detail", "জুয়েলারি ডিটেইল")
        )
        slug = f"emarket247-{category}-{position:02d}"
        output_640 = product_dir / f"{slug}-640.webp"
        output_1280 = product_dir / f"{slug}-1280.webp"
        with Image.open(source) as original:
            image = original.convert("RGB")
            for width, output in [(640, output_640), (1280, output_1280)]:
                derivative = resize(image, width)
                derivative.save(output, "WEBP", quality=86, method=6)
        title_en = f"{title_base_en} {position:02d}"
        title_bn = f"{title_base_bn} {position:02d}"
        alt_en = build_alt(position, category, "en")
        alt_bn = build_alt(position, category, "bn")
        caption_en = "Product detail photograph. Specifications and price are in preparation."
        caption_bn = "পণ্যের ডিটেইল ছবি। স্পেসিফিকেশন ও দাম প্রস্তুত হচ্ছে।"
        for output in [output_640, output_1280]:
            embed_metadata(output, title_en, caption_en)
        with Image.open(output_1280) as final_image:
            final_width, final_height = final_image.size
        public_640 = f"/assets/images/products/{output_640.name}"
        public_1280 = f"/assets/images/products/{output_1280.name}"
        common = {
            "id": row["asset_id"], "slug": slug, "category": category,
            "image": {"src": public_1280, "srcset": f"{public_640} 640w, {public_1280} {final_width}w", "width": final_width, "height": final_height},
            "status": "Details preparing", "copyright": COPYRIGHT, "original_filename": row["original_filename"],
        }
        catalog_en.append({**common, "title": title_en, "categoryLabel": category_en, "image": {**common["image"], "alt": alt_en, "caption": caption_en}})
        catalog_bn.append({**common, "title": title_bn, "categoryLabel": category_bn, "status": "বিস্তারিত প্রস্তুত হচ্ছে", "image": {**common["image"], "alt": alt_bn, "caption": caption_bn}})
        rows.append({
            "asset_id": row["asset_id"], "original_filename": row["original_filename"], "temporary_category": category,
            "webp_640": output_640.name, "webp_1280": output_1280.name, "english_title": title_en,
            "bengali_title": title_bn, "english_alt": alt_en, "bengali_alt": alt_bn,
            "copyright_notice": COPYRIGHT, "creator": CREATOR, "metadata_status": "embedded", "publication_status": "unpriced-detail-preparing",
        })

    CATALOG_EN.write_text(json.dumps({"status": "unpriced-product-records-pending-business-review", "products": catalog_en}, ensure_ascii=False, indent=2), encoding="utf-8")
    CATALOG_BN.write_text(json.dumps({"status": "অনুমোদনের-অপেক্ষায়-দামবিহীন-পণ্যের-রেকর্ড", "products": catalog_bn}, ensure_ascii=False, indent=2), encoding="utf-8")
    with MANIFEST.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"Processed {len(rows)} source images into {product_dir}")
    print(f"English catalog: {CATALOG_EN}")
    print(f"Bengali catalog: {CATALOG_BN}")
    print(f"Manifest: {MANIFEST}")

if __name__ == "__main__":
    main()
