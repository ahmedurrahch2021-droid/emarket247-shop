"""Create text-free studio-pilot derivatives with conservative rights and descriptive metadata.

This workflow preserves generated pilot images and never overwrites user uploads or prior source assets.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image
from PIL.PngImagePlugin import PngInfo


ASSET_ROOT = Path("/home/ubuntu/webdev-static-assets")
OUT_DIR = ASSET_ROOT / "studio-pilot-final"
MANIFEST = Path("/home/ubuntu/emarket247-shop/static-site/assets/data/studio-pilot.catalog.json")

PRODUCTS = [
    {
        "id": "pilot-crossed-band-ring",
        "source": "emarket247-studio-pilot-crossed-band-ring.png",
        "filename": "emarket247-studio-pilot-crossed-band-ring.png",
        "title": "Crossed-Band Ring | eMarket247 Studio Pilot",
        "alt": "Crossed-band ring with clear stone detailing on a warm-white studio background",
        "caption": "Studio-image pilot. Product details, price, and availability are awaiting approval.",
        "bn_alt": "উষ্ণ-সাদা স্টুডিও ব্যাকগ্রাউন্ডে স্বচ্ছ পাথরের ডিটেইলসহ ক্রসড-ব্যান্ড আংটি",
        "bn_caption": "স্টুডিও ইমেজ পাইলট। পণ্যের বিস্তারিত, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায় আছে।",
        "category": "rings",
    },
    {
        "id": "pilot-floral-ring",
        "source": "emarket247-studio-pilot-floral-ring.png",
        "filename": "emarket247-studio-pilot-floral-ring.png",
        "title": "Floral Motif Ring | eMarket247 Studio Pilot",
        "alt": "Floral-motif ring with clear stone accents on a warm-white studio background",
        "caption": "Studio-image pilot. Product details, price, and availability are awaiting approval.",
        "bn_alt": "উষ্ণ-সাদা স্টুডিও ব্যাকগ্রাউন্ডে স্বচ্ছ পাথরের অ্যাকসেন্টসহ ফুলেল নকশার আংটি",
        "bn_caption": "স্টুডিও ইমেজ পাইলট। পণ্যের বিস্তারিত, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায় আছে।",
        "category": "rings",
    },
    {
        "id": "pilot-pave-components",
        "source": "emarket247-studio-pilot-pave-components.png",
        "filename": "emarket247-studio-pilot-pave-components.png",
        "title": "Pavé Jewellery Components | eMarket247 Studio Pilot",
        "alt": "Three pavé-set jewellery components on a warm-white studio background",
        "caption": "Studio-image pilot. Product details, price, and availability are awaiting approval.",
        "bn_alt": "উষ্ণ-সাদা স্টুডিও ব্যাকগ্রাউন্ডে তিনটি পাভে-সেট জুয়েলারি কম্পোনেন্ট",
        "bn_caption": "স্টুডিও ইমেজ পাইলট। পণ্যের বিস্তারিত, মূল্য ও প্রাপ্যতা অনুমোদনের অপেক্ষায় আছে।",
        "category": "jewellery-sets",
    },
]


def write_png_with_metadata(source: Path, target: Path, product: dict[str, str]) -> None:
    image = Image.open(source).convert("RGB")
    metadata = PngInfo()
    metadata.add_text("Title", product["title"])
    metadata.add_text("Description", product["caption"])
    metadata.add_text("Copyright", "© eMarket247. All rights reserved.")
    metadata.add_text("Creator", "eMarket247")
    metadata.add_text("Source", "Non-destructive studio presentation pilot derived from an eMarket247 supplied sample.")
    metadata.add_text("ImageRights", "© eMarket247. All rights reserved.")
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "PNG", pnginfo=metadata, optimize=True)


def main() -> None:
    manifest_products = []
    for product in PRODUCTS:
        source = ASSET_ROOT / product["source"]
        target = OUT_DIR / product["filename"]
        if not source.exists():
            raise FileNotFoundError(f"Missing generated pilot image: {source}")
        write_png_with_metadata(source, target, product)
        manifest_products.append({
            **{key: value for key, value in product.items() if key != "source"},
            "local_published_source": f"/manus-storage/{product['filename']}",
            "rights": "© eMarket247. All rights reserved.",
            "price_status": "pending-approval",
            "availability_status": "pending-approval",
        })
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(
        json.dumps(
            {
                "status": "studio-image-pilot-pending-approval",
                "copyright": "© eMarket247. All rights reserved.",
                "products": manifest_products,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(manifest_products)} studio pilot images to {OUT_DIR}")
    print(f"Wrote mock-up manifest to {MANIFEST}")


if __name__ == "__main__":
    main()
