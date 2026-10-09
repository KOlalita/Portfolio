"""
Genera src/cursors.css: los punteros retro en pixel art.

Uso:  npm run cursors:gen

Cada puntero se define como una rejilla de caracteres:
    '#'  pixel negro
    'o'  pixel blanco explicito (separacion de dedos, cristal del reloj)
    '.'  transparente

El script anade solo el contorno blanco de 1 pixel alrededor de la silueta
negra, junta los pixeles contiguos en tiras horizontales y escribe cada capa
como un unico <path>, que ocupa bastante menos que un <rect> por pixel.

La rejilla se amplia x2 para que los pixeles se vean: es la gracia del estilo.
"""

import io
import os

SCALE = 1.4  # 2 era demasiado grande; esto deja el puntero a tamano de sistema
OUT = os.path.join("src", "cursors.css")

# -- Punteros dibujados a mano ------------------------------------------

ARROW = """
#...........
##..........
###.........
####........
#####.......
######......
#######.....
########....
#########...
##########..
###########.
############
########....
########....
###..###....
##...###....
#.....###...
......###...
.......##...
"""

HAND = """
....###......
....###......
....###......
....###......
....###......
....###.##...
....###o##.##
.##.###o##o##
.#####o##o##.
.############
.############
.############
.############
..###########
..##########.
...#########.
"""

WAIT = """
############
#oooooooooo#
#o########o#
.#oo####oo#.
.#ooo##ooo#.
..#oo##oo#..
..#oo##oo#..
...#o##o#...
...#o##o#...
..#oo##oo#..
..#oo##oo#..
.#ooo##ooo#.
.#oo####oo#.
#o########o#
#oooooooooo#
############
"""

TEXT = """
#######
...#...
...#...
...#...
...#...
...#...
...#...
...#...
...#...
...#...
...#...
...#...
...#...
...#...
#######
"""

NS = """
....#....
...###...
..#####..
.#######.
....#....
....#....
....#....
....#....
....#....
....#....
....#....
....#....
....#....
.#######.
..#####..
...###...
....#....
"""


def px(n):
    """Formatea una medida sin arrastrar decimales inutiles."""
    v = round(n * SCALE, 2)
    return ("%g" % v)


def grid(text):
    rows = [r for r in text.strip("\n").split("\n")]
    w = max(len(r) for r in rows)
    return [r.ljust(w, ".") for r in rows]


def rotate_cw(g):
    h, w = len(g), len(g[0])
    return ["".join(g[h - 1 - y][x] for y in range(h)) for x in range(w)]


def mirror(g):
    return [r[::-1] for r in g]


def diagonal(flip):
    """Flecha doble en diagonal, 16x16, generada por reglas."""
    n = 16
    out = []
    for y in range(n):
        row = ""
        for x in range(n):
            on = abs(x - y) <= 1  # banda diagonal de 2 px
            if x <= 4 and y <= 4 and x + y <= 4:
                on = True  # punta superior izquierda
            if x >= n - 5 and y >= n - 5 and x + y >= 2 * n - 6:
                on = True  # punta inferior derecha
            row += "#" if on else "."
        out.append(row)
    return mirror(out) if flip else out


def pad(g):
    """Margen de un pixel: si no, el contorno blanco se recorta en el borde."""
    w = len(g[0]) + 2
    return ["." * w] + ["." + r + "." for r in g] + ["." * w]


def outline(g):
    """Marca en blanco cada hueco pegado a un pixel negro."""
    h, w = len(g), len(g[0])
    out = [list(r) for r in g]
    for y in range(h):
        for x in range(w):
            if g[y][x] != ".":
                continue
            touching = False
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and g[ny][nx] == "#":
                        touching = True
            if touching:
                out[y][x] = "o"
    return ["".join(r) for r in out]


def runs(g, ch):
    """Junta pixeles contiguos de una fila en una sola tira."""
    for y, row in enumerate(g):
        x = 0
        while x < len(row):
            if row[x] == ch:
                start = x
                while x < len(row) and row[x] == ch:
                    x += 1
                yield start, y, x - start
            else:
                x += 1


def path(g, ch):
    return "".join("M%d %dh%dv1h-%dz" % (x, y, n, n) for x, y, n in runs(g, ch))


def svg(g):
    h, w = len(g), len(g[0])
    white = path(g, "o")
    black = path(g, "#")
    return (
        "<svg xmlns='http://www.w3.org/2000/svg' width='%s' height='%s' "
        "viewBox='0 0 %d %d' shape-rendering='crispEdges'>"
        "<path d='%s' fill='%%23fff'/><path d='%s' fill='%%23000'/></svg>"
        % (px(w), px(h), w, h, white, black)
    )


# nombre -> (rejilla, punto caliente en pixeles de la rejilla ORIGINAL)
BASE = {
    "arrow": (grid(ARROW), (0, 0)),
    "hand": (grid(HAND), (5, 0)),
    "wait": (grid(WAIT), (6, 8)),
    "text": (grid(TEXT), (3, 7)),
    "ns": (grid(NS), (4, 8)),
    "ew": (rotate_cw(grid(NS)), (8, 4)),
    "nwse": (diagonal(False), (8, 8)),
    "nesw": (diagonal(True), (8, 8)),
}


def main():
    lines = [
        "/*",
        " * GENERADO POR scripts/gen-cursors.py — no editar a mano.",
        " * Punteros retro en pixel art: negro con contorno blanco de 1 px,",
        " * ampliados x%g para que se vean los pixeles." % SCALE,
        " */",
        "",
        ":root {",
    ]

    classes = []
    for name, (g, (hx, hy)) in BASE.items():
        # El margen desplaza todo un pixel, incluido el punto caliente.
        painted = outline(pad(g))
        hx, hy = hx + 1, hy + 1
        lines.append('  --cur-%s: url("data:image/svg+xml,%s");' % (name, svg(painted)))
        classes.append(
            ".cur--%s {\n"
            "  width: %spx;\n"
            "  height: %spx;\n"
            "  --hx: %spx;\n"
            "  --hy: %spx;\n"
            "  background-image: var(--cur-%s);\n"
            "}"
            % (name, px(len(painted[0])), px(len(painted)), px(hx), px(hy), name)
        )

    lines.append("}")
    lines.append("")
    lines.extend(classes)
    lines.append("")

    io.open(OUT, "w", encoding="utf-8").write("\n".join(lines))
    size = os.path.getsize(OUT)
    print("%s  %.1f KB  (%d punteros)" % (OUT, size / 1024, len(BASE)))


if __name__ == "__main__":
    main()
