#!/usr/bin/env python3
"""Create web-ready WebP images from assets/NEW FOTOS.

Project images are written to assets/fotos; client portraits are written to
assets/clients. Source files remain untouched.
"""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "NEW FOTOS"
FOTOS_DIR = ROOT / "assets" / "fotos"
CLIENTS_DIR = ROOT / "assets" / "clients"
FOTO_MAX_EDGE = 1920
CLIENT_MAX_EDGE = 1000

FILES = {
    "2023 - AOH Training 3.jpg": (
        FOTOS_DIR / "art-of-hosting-visual-harvesting-training.webp",
        FOTO_MAX_EDGE,
    ),
    "Recording-success.jpg": (
        FOTOS_DIR / "erfolg-mentalitaet-live-visualisierung.webp",
        FOTO_MAX_EDGE,
    ),
    "2020 Sozius Konferenz 17.jpg": (
        FOTOS_DIR / "socius-oe-tag-robin-hotz-moderation.webp",
        FOTO_MAX_EDGE,
    ),
    "Leadership Training 1.jpg": (
        FOTOS_DIR / "leadership-training-dialogkreis.webp",
        FOTO_MAX_EDGE,
    ),
    "Visual-Living-Systems.jpeg": (
        FOTOS_DIR / "living-systems-visual-thinking.webp",
        FOTO_MAX_EDGE,
    ),
    "2026 Reinventing Society Vortrag 2.png": (
        FOTOS_DIR / "reinventing-society-vortrag-oe-tag.webp",
        FOTO_MAX_EDGE,
    ),
    "2020 Sozius Konferenz 9.jpg": (
        FOTOS_DIR / "socius-oe-tag-visual-facilitation.webp",
        FOTO_MAX_EDGE,
    ),
    "client-sofia-engel.jpg": (
        CLIENTS_DIR / "sofia-engel.webp",
        CLIENT_MAX_EDGE,
    ),
}


def optimize(source: Path, destination: Path, max_edge: int) -> None:
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGB")
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(
            destination,
            "WEBP",
            quality=82,
            method=6,
            optimize=True,
        )


def main() -> None:
    for source_name, (destination, max_edge) in FILES.items():
        source = SOURCE_DIR / source_name
        if not source.exists():
            raise FileNotFoundError(source)
        optimize(source, destination, max_edge)
        size_kb = destination.stat().st_size / 1024
        print(f"{destination.relative_to(ROOT)} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
