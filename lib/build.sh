#!/bin/bash

set -e

(
    cd glyph
    emmake make
)

make -f Makefile.emscripten
