"""Subset the Sanskrit (Devanagari) and Kannada fonts to exactly the glyphs the site uses.

Every Devanagari / Kannada phrase in src/ is shaped with HarfBuzz; the glyphs present at
every shaping step (half forms, conjuncts, vowel signs) are kept, nothing else.
Run after changing any Sanskrit or Kannada text:  npm run fonts
Needs: pip install fonttools brotli uharfbuzz; npm i (for the @fontsource packages)
"""
import glob
import io
import pathlib
import re

import uharfbuzz as hb
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FS = ROOT / 'node_modules/@fontsource'
FONTS = [
    # (script range, source woff2, output file)
    ('ऀ-ॿ', FS / 'tiro-devanagari-sanskrit/files/tiro-devanagari-sanskrit-devanagari-400-normal.woff2', 'tiro-devanagari-subset.woff2'),
    ('ಀ-೿', FS / 'noto-serif-kannada/files/noto-serif-kannada-kannada-500-normal.woff2', 'noto-serif-kannada-subset.woff2'),
]

source = ''.join(pathlib.Path(f).read_text(encoding='utf8') for f in glob.glob(str(ROOT / 'src/**/*.js*'), recursive=True))

for rng, src, out_name in FONTS:
    # phrases keep their conjuncts together; ZWJ/ZWNJ included
    words = set(re.findall(rf'[{rng}‌‍]+(?:\s+[{rng}‌‍]+)*', source))

    tt = TTFont(str(src))
    tt.flavor = None
    buf = io.BytesIO()
    tt.save(buf)
    font = hb.Font(hb.Face(buf.getvalue()))

    gids = {0}
    for w in words:
        b = hb.Buffer()
        b.add_str(w)
        b.guess_segment_properties()
        mapped = [False]  # before GSUB starts the buffer still holds characters, not glyphs

        def trace(msg, buf=b, mapped=mapped):
            if msg.startswith('start table GSUB'):
                mapped[0] = True
            if mapped[0]:
                gids.update(i.codepoint for i in buf.glyph_infos)
            return True

        b.set_message_func(trace)
        hb.shape(font, b)
        gids |= {i.codepoint for i in b.glyph_infos}

    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.layout_closure = False
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(gids=sorted(gids), text=''.join(sorted({c for w in words for c in w})) + ' ')
    ft = subset.load_font(str(src), opts)
    sub.subset(ft)
    out = ROOT / 'public/fonts' / out_name
    out.parent.mkdir(parents=True, exist_ok=True)
    subset.save_font(ft, str(out), opts)
    print(f'{out_name}: {len(words)} phrases, {len(gids)} glyphs, {out.stat().st_size / 1024:.1f} KB')
