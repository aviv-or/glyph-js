#include "glp_rand_openssl_aes.h"
#include <stdlib.h>

static int debug = 0;
void start_debug() {
    debug = 1;
}

void end_debug() {
    debug = 0;
}

int RAND_bytes(unsigned char *bytes, int count) {
    for (int i = 0; i < count; ++i) {
        bytes[i] = (unsigned char)(rand() % 0xff);
    }
    return 0;
}

uint64_t randomplease(AES_KEY *aes_key, unsigned char aes_ivec[AES_BLOCK_SIZE],
                      unsigned char aes_ecount_buf[AES_BLOCK_SIZE],
                      unsigned int *aes_num, unsigned char aes_in[AES_BLOCK_SIZE]) {
    uint64_t out;
	AES_ctr128_encrypt(aes_in, (unsigned char *) &out, 8, aes_key, aes_ivec, aes_ecount_buf, aes_num);
	return out;
}

