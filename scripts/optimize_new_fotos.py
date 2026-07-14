#!/usr/bin/env python3
"""Create web-ready WebP images from assets/NEW FOTOS."""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "NEW FOTOS"
OUTPUT_DIR = ROOT / "assets" / "fotos"
MAX_EDGE = 1920

FILES = {
    "Graphic-Recording-Art-of-Hosting-Hamburg.jpg": "graphic-recording-art-of-hosting-hamburg.webp",
    "Graphic-Recording-Conference.jpg": "graphic-recording-konferenz-komplexitaet.webp",
    "Graphic-Recording-workshop.jpeg": "organisationsentwicklung-workshop-visualisierung.webp",
    "Ipad-Recording.jpg": "online-moderation-ipad-visualisierung.webp",
    "Recording-Emerge.jpeg": "graphic-recording-emergenz-organisation.webp",
    "Recording-banking.jpg": "live-graphic-recording-banking.webp",
    "Recording-science.jpg": "wissenschaft-workshop-graphic-recording.webp",
    "Recording-success.jpg": "erfolg-mentalitaet-live-visualisierung.webp",
    "Robin-Light.jpg": "robin-hotz-moderator-portrait-hell.webp",
    "Robin-Natural.jpg": "robin-hotz-moderator-natuerliches-portrait.webp",
    "Robin-portrait-3.webp": "robin-hotz-visual-facilitator-portrait.webp",
    "Video-Call.jpg": "robin-hotz-online-moderation-videocall.webp",
    "Vision-Workshop.jpeg": "vision-strategie-workshop-visualisierung.webp",
    "Visual-Culture.jpeg": "organisationskultur-visualisierung.webp",
    "Visual-Living-Systems.jpeg": "living-systems-visual-thinking.webp",
}


def optimize(source: Path, destination: Path) -> None:
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGB")
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        image.save(
            destination,
            "WEBP",
            quality=82,
            method=6,
            optimize=True,
        )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for source_name, output_name in FILES.items():
        source = SOURCE_DIR / source_name
        if not source.exists():
            raise FileNotFoundError(source)
        optimize(source, OUTPUT_DIR / output_name)
        print(output_name)


if __name__ == "__main__":
    main()
