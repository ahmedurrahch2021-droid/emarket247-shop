#!/usr/bin/env python3
"""Publish background-cleaned derivatives into the static catalog without touching originals."""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image

PROJECT = Path("/home/ubuntu/emarket247-shop")
INPUT_MANIFEST = PROJECT / "research/enhanced-product-image-manifest.json"
INPUT_IMAGES = Path("/home/ubuntu/webdev-static-assets/emarket247-enhanced-products")
OUTPUT = Path("/home/ubuntu/webdev-static-assets/emarket247-product-catalog/enhanced-background-cleaned")
CATALOGS = [
    PROJECT / "static-site/assets/data/catalog.en.json",
    PROJECT / "static-site/assets/data/catalog.bn.json",
]


def metadata(path: Path, title: str, description: str) -> None:
    subprocess.run([
        "exiftool", "-overwrite_original", f"-XMP-dc:Title={title}",
        f"-XMP-dc:Description={description}",
        "-XMP-dc:Creator=eMarket247", "-XMP-dc:Rights=© eMarket247. All rights reserved.",
        "-IPTC:CopyrightNotice=© eMarket247. All rights reserved.", str(path)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)


def save_sizes(source: Path, output_640: Path, output_1280: Path, title: str, description: str) -> tuple[int, int]:
    with Image.open(source) as original:
        source_image = original.convert("RGBA")
        for max_width, target in ((640, output_640), (1280, output_1280)):
            ratio = min(1, max_width / source_image.width)
            resized = source_image.resize((round(source_image.width * ratio), round(source_image.height * ratio)), Image.Resampling.LANCZOS)
            resized.save(target, "WEBP", quality=84, method=6)
            metadata(target, title, description)
        return source_image.size


def main() -> None:
    payload = json.loads(INPUT_MANIFEST.read_text(encoding="utf-8"))
    images = {item["asset_id"]: item for item in payload.get("images", [])}
    if len(images) != 48:
        raise ValueError(f"Expected 48 enhanced records; found {len(images)}")
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True)

    first_catalog = json.loads(CATALOGS[0].read_text(encoding="utf-8"))
    output_manifest = []
    for product in first_catalog["products"]:
        item = images[product["id"]]
        source = INPUT_IMAGES / item["output_filename"]
        if not source.exists():
            raise FileNotFoundError(source)
        slug = product["slug"]
        output_640 = OUTPUT / f"{slug}-640.webp"
        output_1280 = OUTPUT / f"{slug}-1280.webp"
        dimensions = save_sizes(source, output_640, output_1280, item["title_en"], f"{item['alt_en']} {item['alt_bn']}")
        output_manifest.append({**item, "web_640": output_640.name, "web_1280": output_1280.name, "source_enhanced_dimensions": list(dimensions)})

    for catalog_path in CATALOGS:
        catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
        language = "bn" if catalog_path.name.endswith(".bn.json") else "en"
        for product in catalog["products"]:
            item = images[product["id"]]
            slug = product["slug"]
            title = item["title_bn"] if language == "bn" else item["title_en"]
            alt = item["alt_bn"] if language == "bn" else item["alt_en"]
            caption = item["caption_bn"] if language == "bn" else item["caption_en"]
            product["title"] = title
            product["copyright"] = item["copyright_notice"]
            product["image"] = {
                "src": f"/assets/images/products/{slug}-1280.webp",
                "srcset": f"/assets/images/products/{slug}-640.webp 640w, /assets/images/products/{slug}-1280.webp 1280w",
                "width": 1280,
                "height": 1600,
                "alt": alt,
                "caption": caption,
            }
        catalog["status"] = "unpriced-enhanced-product-records-pending-business-review"
        catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    (PROJECT / "research/enhanced-product-web-manifest.json").write_text(json.dumps({"images": output_manifest}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Published {len(output_manifest)} enhanced product records into {OUTPUT}")


if __name__ == "__main__":
    main()
