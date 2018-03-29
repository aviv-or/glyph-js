//
// Created by isaac on 18-3-28.
//

#ifndef GLYPH_GLYPH_H
#define GLYPH_GLYPH_H

#include <stddef.h>

#ifdef __cplusplus
    extern "C" {
#endif
typedef unsigned char byte;

size_t glyph_private_keysize();

size_t glyph_public_keysize();

size_t glyph_signature_size();

void glyph_gen_keypair(byte *privateKey, byte *publicKey, const byte* seed);

int glyph_sign(byte *signature, const byte *message, size_t messageLength, const byte *privateKey);

int glyph_verify(const byte *message, size_t messageLength, const byte *signature, const byte *publicKey);

#ifdef __cplusplus
}
#endif

#endif //GLYPH_GLYPH_H
