#!/usr/bin/env python3
"""Create transparent WebP catalog derivatives without changing owner originals."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps
from rembg import remove

PROJECT = Path("/home/ubuntu/emarket247-shop")
SOURCE_ROOT = Path("/home/ubuntu/projects/emarket247-pandora-clone-7f5043cd")
MAPPING = SOURCE_ROOT / "phase2-assets/catalog/asset-mapping.csv"
OUT = Path("/home/ubuntu/webdev-static-assets/emarket247-enhanced-products")
MANIFEST = PROJECT / "research/enhanced-product-image-manifest.json"


def visual_category(index: int) -> str:
    if index in {14, 15}:
        return "bracelets"
    if index in {16, 46, 47, 48}:
        return "necklaces"
    if 17 <= index <= 30:
        return "bangles"
    if index == 32:
        return "earrings"
    return "jewellery-detail"


def label(index: int, category: str) -> tuple[str, str, str, str]:
    number = f"{index:02d}"
    category_label = {
        "bracelets": "Bracelet-style jewellery detail",
        "necklaces": "Necklace-style jewellery detail",
        "bangles": "Circular jewellery detail",
        "earrings": "Earring-style jewellery detail",
        "jewellery-detail": "Jewellery detail",
    }[category]
    bn_label = {
        "bracelets": "ব্রেসলেট-ধাঁচের জুয়েলারির বিবরণ",
        "necklaces": "হার-ধাঁচের জুয়েলারির বিবরণ",
        "bangles": "বৃত্তাকার জুয়েলারির বিবরণ",
        "earrings": "কানের দুল-ধাঁচের জুয়েলারির বিবরণ",
        "jewellery-detail": "জুয়েলারির বিবরণ",
    }[category]
    title = f"{category_label} {number}"
    alt_en = f"Product photograph of {category_label.lower()}, record {number}; specifications and price are being prepared."
    alt_bn = f"{bn_label} {number}-এর পণ্যের ছবি; স্পেসিফিকেশন ও মূল্য প্রস্তুত হচ্ছে।"
    return title, alt_en, alt_bn, bn_label


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def enhance_and_isolate(source: Path, destination: Path) -> tuple[int, int]:
    raw = source.read_bytes()
    isolated = Image.open(BytesIO(remove(raw))).convert("RGBA")
    alpha = isolated.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        padding = max(16, round(max(isolated.size) * 0.035))
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(isolated.width, bbox[2] + padding)
        bottom = min(isolated.height, bbox[3] + padding)
        isolated = isolated.crop((left, top, right, bottom))
    rgb = isolated.convert("RGB")
    rgb = ImageOps.autocontrast(rgb, cutoff=0.2)
    rgb = ImageEnhance.Color(rgb).enhance(1.02)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.06)
    finished = Image.merge("RGBA", (*rgb.split(), isolated.getchannel("A")))
    canvas = Image.new("RGBA", (1600, 2000), (0, 0, 0, 0))
    ratio = min(1260 / finished.width, 1540 / finished.height, 1)
    resized = finished.resize((round(finished.width * ratio), round(finished.height * ratio)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(resized, ((canvas.width - resized.width) // 2, (canvas.height - resized.height) // 2))
    canvas.save(destination, "WEBP", quality=86, method=6, lossless=False)
    return canvas.size


def write_metadata(path: Path, title: str, alt_en: str, alt_bn: str) -> None:
    description = f"{alt_en} {alt_bn}"
    command = [
        "exiftool",
        "-overwrite_original",
        f"-XMP-dc:Title={title}",
        f"-XMP-dc:Description={description}",
        "-XMP-dc:Creator=eMarket247",
        "-XMP-dc:Rights=© eMarket247. All rights reserved.",
        "-XMP-photoshop:Credit=eMarket247",
        "-IPTC:CopyrightNotice=© eMarket247. All rights reserved.",
        str(path),
    ]
    subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: list[dict[str, object]] = []
    with MAPPING.open(newline="", encoding="utf-8") as handle:
        for index, row in enumerate(csv.DictReader(handle), start=1):
            source = SOURCE_ROOT / row["original_filename"]
            if not source.exists():
                raise FileNotFoundError(source)
            category = visual_category(index)
            title, alt_en, alt_bn, bn_label = label(index, category)
            filename = f"emarket247-{category}-{index:02d}-isolated.webp"
            destination = OUT / filename
            dimensions = enhance_and_isolate(source, destination)
            write_metadata(destination, title, alt_en, alt_bn)
            manifest.append({
                "asset_id": f"src-{index:03d}",
                "source_filename": source.name,
                "source_sha256": sha256(source),
                "output_filename": filename,
                "output_dimensions": list(dimensions),
                "category": category,
                "title_en": title,
                "title_bn": bn_label,
                "alt_en": alt_en,
                "alt_bn": alt_bn,
                "caption_en": "Unpriced catalog record. Specifications and price are in preparation.",
                "caption_bn": "মূল্যবিহীন ক্যাটালগ রেকর্ড। স্পেসিফিকেশন ও মূল্য প্রস্তুত হচ্ছে।",
                "copyright_notice": "© eMarket247. All rights reserved.",
                "creator": "eMarket247",
                "status": "needs-business-review",
                "processing": "AI background removal fallback; restrained clarity and lighting enhancement; original preserved",
            })
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps({"images": manifest}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Created {len(manifest)} enhanced derivatives in {OUT}")


if __name__ == "__main__":
    main()
