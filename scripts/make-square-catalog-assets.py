"""Create square product-card derivatives without cropping or altering jewellery subjects."""
from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "static-site" / "assets" / "images" / "products"
OUTPUT = ROOT / "static-site" / "assets" / "images" / "products-square"
DATA = ROOT / "static-site" / "assets" / "data"
BACKGROUND = (255, 253, 251, 255)


def square_image(source: Path, destination: Path, edge: int) -> None:
    with Image.open(source) as raw:
        image = raw.convert("RGBA")
        # Remove only inherited transparent padding; every visible jewellery edge remains intact.
        alpha_bounds = image.getchannel("A").getbbox()
        if alpha_bounds:
            left, top, right, bottom = alpha_bounds
            safety_padding = max(10, round(max(image.size) * 0.025))
            subject_bounds = (
                max(0, left - safety_padding),
                max(0, top - safety_padding),
                min(image.width, right + safety_padding),
                min(image.height, bottom + safety_padding),
            )
            image = image.crop(subject_bounds)
        # Contain, rather than crop, preserves product proportions on an even square studio canvas.
        contained = ImageOps.contain(image, (int(edge * 0.86), int(edge * 0.86)), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (edge, edge), BACKGROUND)
        point = ((edge - contained.width) // 2, (edge - contained.height) // 2)
        canvas.alpha_composite(contained, point)
        canvas.convert("RGB").save(destination, "WEBP", quality=90, method=6)


def output_names(filename: str) -> tuple[str, int]:
    if filename.endswith("-640.webp"):
        return filename.replace("-640.webp", "-600-square.webp"), 600
    if filename.endswith("-1280.webp"):
        return filename.replace("-1280.webp", "-1200-square.webp"), 1200
    raise ValueError(f"Unexpected source filename: {filename}")


def process_images() -> int:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source product directory: {SOURCE}")
    shutil.rmtree(OUTPUT, ignore_errors=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    count = 0
    for source in sorted(SOURCE.glob("*.webp")):
        destination_name, edge = output_names(source.name)
        destination = OUTPUT / destination_name
        square_image(source, destination, edge)
        subprocess.run([
            "exiftool", "-overwrite_original",
            "-XMP-dc:Rights=© eMarket247. All rights reserved.",
            "-XMP-dc:Creator=eMarket247",
            "-XMP-xmpRights:Marked=True",
            str(destination),
        ], check=True, stdout=subprocess.DEVNULL)
        count += 1
    return count


def update_catalog(path: Path) -> None:
    catalog = json.loads(path.read_text(encoding="utf-8"))
    for product in catalog.get("products", []):
        image = product["image"]
        old = image["src"]
        filename = old.rsplit("/", 1)[-1]
        base = filename.removesuffix("-1200-square.webp").removesuffix("-1280.webp")
        image["src"] = f"/assets/images/products-square/{base}-1200-square.webp"
        image["srcset"] = (
            f"/assets/images/products-square/{base}-600-square.webp 600w, "
            f"/assets/images/products-square/{base}-1200-square.webp 1200w"
        )
        image["width"] = 1200
        image["height"] = 1200
    catalog["image_presentation"] = "square-studio-contained"
    path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    count = process_images()
    update_catalog(DATA / "catalog.en.json")
    update_catalog(DATA / "catalog.bn.json")
    manifest = {
        "source": str(SOURCE.relative_to(ROOT)),
        "output": str(OUTPUT.relative_to(ROOT)),
        "derivatives": count,
        "presentation": "square studio canvas; subject contained without cropping",
        "rights": "© eMarket247. All rights reserved.",
    }
    (OUTPUT / "square-catalog-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
