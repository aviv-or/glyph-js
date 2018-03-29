//
// Created by isaac on 18-3-28.
//

#include "test_glyph.h"
#include "../glyph.h"
#include "../glp.h"
#include "../glp_utils.h"

#include <stdio.h>

#define SIGN_TRIALS 1000
unsigned char seed[32] = {0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf,
                          0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1e, 0x1f};
static void test_seed() {
    byte *sk = malloc(glyph_private_keysize());
    byte *pk = malloc(glyph_public_keysize());
    glyph_gen_keypair(sk, pk, seed);

    const char *message = "testtest";

    byte *signature = malloc(glyph_signature_size());
    glyph_sign(signature, message, strlen(message), sk);

    int ret = glyph_verify(message, strlen(message), signature, pk);

    if(!ret) {
        printf("failed to verify\n");
    } else {
        printf("verify ok\n");
    }

    free(sk);
    free(pk);
    free(signature);
}

static byte *encodePrivateKey(const RINGELT *array, int count) {
    byte *buffer = malloc(sizeof(byte) * count);
    for (int i = 0; i < count; ++i) {
        RINGELT n = 2 * array[i] < Q ? array[i] : array[i] - Q;
        if (n < 0) {
            buffer[i] = n + 3;
        } else {
            buffer[i] = (byte)n;
        }
    }
    return buffer;
}

static void decodePrivateKeyFromBuffer(RINGELT *array, int count, const byte *buffer) {
    for (int i = 0; i < count; ++i) {
        byte n = buffer[i];
        if (n > 1) {
            array[i] = Q + n - 3;
        } else {
            array[i] = n;
        }
    }
}

int main(){

  test_seed();
//    start_debug();
  glp_signing_key_t sk;
    glp_public_key_t pk;
    char *message = "testtest";
    glp_signature_t sig;

    byte *buffer = encodePrivateKey(&sk, N * 2);
    printHex(buffer, N * 2);

    glp_signing_key_t sk2;
    decodePrivateKeyFromBuffer(&sk2, N * 2, buffer);

    if(memcmp(&sk, &sk2, sizeof(glp_signing_key_t)) == 0) {
        printf("equal!!!\n");
    }

    free(buffer);

    /*print a single example*/
    printf("example signature");
    printf("\nmessage:\n");
    printf("%s\n",message);
    glp_gen_sk(&sk, seed);
    glp_gen_pk(&pk, sk);
    printf("\nsigning key:\n");
    print_sk(sk);
    printf("\npublic key:\n");
    print_pk(pk);
    glp_sign(&sig, sk,(unsigned char *)message,strlen(message));
    printf("\nsignature:\n");
    print_sig(sig);

    uint16_t i;

    printf("******************************************************************************************************\n");

    /*test a lot of verifications*/
    printf("trying %d independent keygen/sign/verifies\n", SIGN_TRIALS);
    byte *skLooper = malloc(glyph_private_keysize());
    byte *pkLooper = malloc(glyph_public_keysize());
    byte *sigLooper = malloc(glyph_signature_size());

    for(i=0; i < SIGN_TRIALS; i++){
        glyph_gen_keypair(skLooper, pkLooper, NULL);

        if(!glyph_sign(sigLooper, (unsigned char *)message, strlen(message), skLooper)){
            printf("signature failure round %d!\n",i);
        }
        if(!glyph_verify((unsigned char *)message,strlen(message), sigLooper, pkLooper)) {
            printf("verification failure round %d!\n",i);
            return 1;
        }
        if(!(i % 100)){
            printf("passed trial %d\n",i);
        }
    }

    free(skLooper);
    free(pkLooper);
    free(sigLooper);

    printf("signature scheme validates across %d independent trials\n", SIGN_TRIALS);
    printf("******************************************************************************************************\n");


    return 0;
}
