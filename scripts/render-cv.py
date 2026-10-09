"""
Rasteriza el PDF del CV a imagenes para poder verlo dentro del sitio.

Uso:   npm run cv:render
Deps:  python -m pip install pymupdf pillow

Genera public/cv-page-<n>.webp a 2x (nitido en pantallas retina) y recuerda
actualizar PROFILE.cvPages en src/data/content.jsx si cambia el numero de
paginas.
"""

import io
import os
import sys

import pymupdf
from PIL import Image

PDF = os.path.join("public", "CV-Adriano-Paniagua-Quiroga.pdf")
SCALE = 2
QUALITY = 88


def main():
    if not os.path.exists(PDF):
        sys.exit("No encuentro " + PDF)

    doc = pymupdf.open(PDF)
    out = []

    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=pymupdf.Matrix(SCALE, SCALE))
        img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        path = os.path.join("public", "cv-page-%d.webp" % i)
        img.save(path, "WEBP", quality=QUALITY, method=6)
        out.append(path)
        print("%s  %dx%d  %.0f KB" % (path, img.width, img.height, os.path.getsize(path) / 1024))

    print("\n%d pagina(s). En content.jsx, PROFILE.cvPages debe listar:" % len(out))
    for p in out:
        print("  import.meta.env.BASE_URL + '%s'" % os.path.basename(p))


if __name__ == "__main__":
    main()
