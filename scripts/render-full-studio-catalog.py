"""Render display-ready studio images from existing non-destructive isolated WebPs.

The job preserves product pixels, crops only transparent padding, adds an ivory studio canvas
and contact shadow, and writes 800/1600px WebPs for the 47 approved display records.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps, TiffImagePlugin

PROJECT = Path(__file__).resolve().parent.parent
STATIC = PROJECT / "static-site"
JOB_MANIFEST = PROJECT / "research" / "studio-catalog-batch-jobs.json"
CATALOG_PATH = STATIC / "assets" / "data" / "catalog.en.json"
SOURCE_DIR = STATIC / "assets" / "images" / "products"
OUTPUT_DIR = STATIC / "assets" / "images" / "products-studio"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

CANVAS_COLOR = (251, 248, 243, 255)  # warm porcelain / ivory, never flat pure white
COPYRIGHT = "© eMarket247. All rights reserved."


def exif_bytes(title: str, description: str) -> bytes:
    tags = TiffImagePlugin.ImageFileDirectory_v2()
    tags[270] = description
    tags[315] = "eMarket247"
    tags[33432] = COPYRIGHT
    tags[40091] = title
    return tags.tobytes()


def source_for(job: dict, catalog_by_id: dict) -> Path:
    product = catalog_by_id[job["id"]]
    current_name = Path(product["image"]["src"]).name
    base = current_name.replace("-1200-square.webp", "")
    candidate = SOURCE_DIR / f"{base}-1280.webp"
    if not candidate.exists():
        raise FileNotFoundError(f"No enhanced source for {job['id']}: {candidate}")
    return candidate


def trim_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise ValueError("Product image has no visible pixels after alpha conversion")
    pad = max(8, int(max(rgba.width, rgba.height) * 0.015))
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(rgba.width, bbox[2] + pad)
    bottom = min(rgba.height, bbox[3] + pad)
    return rgba.crop((left, top, right, bottom))


def studio_canvas(subject: Image.Image, size: int) -> Image.Image:
    subject = trim_alpha(subject)
    max_subject = int(size * 0.76)
    scale = min(max_subject / subject.width, max_subject / subject.height)
    dimensions = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    subject = subject.resize(dimensions, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), CANVAS_COLOR)
    alpha = subject.getchannel("A")
    shadow = Image.new("RGBA", subject.size, (50, 40, 30, 0))
    shadow.putalpha(alpha.point(lambda value: int(value * 0.17)).filter(ImageFilter.GaussianBlur(max(8, size // 42))))
    left = (size - subject.width) // 2
    top = (size - subject.height) // 2 - int(size * 0.018)
    shadow_top = top + int(size * 0.038)
    canvas.alpha_composite(shadow, (left, shadow_top))
    canvas.alpha_composite(subject, (left, top))
    return canvas


def save_webp(image: Image.Image, destination: Path, title: str, description: str) -> None:
    image.convert("RGB").save(
        destination,
        format="WEBP",
        quality=92,
        method=6,
        exif=exif_bytes(title, description),
    )


def main() -> None:
    jobs = json.loads(JOB_MANIFEST.read_text(encoding="utf-8"))["jobs"]
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    catalog_by_id = {product["id"]: product for product in catalog["products"]}
    manifest = []
    for job in jobs:
        product = catalog_by_id[job["id"]]
        source = source_for(job, catalog_by_id)
        original = Image.open(source)
        title = product["title"]
        description = f"{product['image']['caption']} {COPYRIGHT} Studio product image."
        output_1600 = OUTPUT_DIR / f"emarket247-studio-product-{job['index']:02d}-1600.webp"
        output_800 = OUTPUT_DIR / f"emarket247-studio-product-{job['index']:02d}-800.webp"
        save_webp(studio_canvas(original, 1600), output_1600, title, description)
        save_webp(studio_canvas(original, 800), output_800, title, description)
        manifest.append({
            "id": job["id"],
            "index": job["index"],
            "source_original": job["source_filename"],
            "source_enhanced": source.name,
            "image_800": f"/assets/images/products-studio/{output_800.name}",
            "image_1600": f"/assets/images/products-studio/{output_1600.name}",
            "title": title,
            "alt": product["image"]["alt"],
            "caption": product["image"]["caption"],
            "rights": COPYRIGHT,
            "display_status": "approved-for-studio-display-pending-business-data",
        })
    output_manifest = {
        "status": "47-product-studio-catalog-rendered",
        "copyright": COPYRIGHT,
        "display_count": len(manifest),
        "reserve_record": "src-048",
        "products": manifest,
    }
    (OUTPUT_DIR / "studio-catalog-manifest.json").write_text(json.dumps(output_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Rendered {len(manifest)} studio product records into {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
