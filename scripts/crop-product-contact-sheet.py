"""Split the existing product contact sheet into readable image batches for catalog mapping review."""
from pathlib import Path
from PIL import Image

source = Path("/home/ubuntu/projects/emarket247-pandora-clone-7f5043cd/_audit_contact_sheet.jpg")
destination = Path("/home/ubuntu/projects/emarket247-pandora-clone-7f5043cd/audit_contact_crops")
destination.mkdir(parents=True, exist_ok=True)

image = Image.open(source)
batch_height = 760
for index, top in enumerate(range(0, image.height, batch_height), 1):
    crop = image.crop((0, top, image.width, min(top + batch_height, image.height)))
    crop.save(destination / f"products-batch-{index:02d}.jpg", quality=95, optimize=True)
    print(destination / f"products-batch-{index:02d}.jpg")
