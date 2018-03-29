/* This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * See LICENSE for complete information.
 */


#include "../glp.h"
#include "../glp_utils.h"
#include "test_vectors.h"
#include "../glp_rand_openssl_aes.h"
#include <stdio.h>

#define SIGN_TRIALS 1000
unsigned char seed[32] = {0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf,
                          0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1e, 0x1f};
static void test_seed() {

  glp_signing_key_t sk;
  glp_gen_sk(&sk, seed);
  printf("sk1:\n");
  print_sk(sk);

  glp_public_key_t pk;
  char *message = "testtest";

  glp_signature_t signature;
  glp_sign(&signature, sk, (unsigned char *)message, strlen(message));

  glp_signing_key_t sk2;
  glp_gen_sk(&sk2, seed);
  printf("sk2:\n");
  print_sk(sk2);
  glp_gen_pk(&pk, sk2);

  if(!glp_verify(signature, pk, (unsigned char *)message, strlen(message))) {
    printf("failed to verify");
  }
}

static void test_local_imp() {
    RANDOM_VARS
    uint64_t r64 = RANDOM64;
    printf("%lld", r64);
}

int main(){

//  test_seed();
//    start_debug();
//  test_local_imp();
//  return 0;
printf("size: %d %d %d %d %d\n", sizeof(uint16_t), sizeof(glp_signing_key_t), sizeof(glp_public_key_t), sizeof(glp_signature_t), sizeof(uint_fast16_t));
  glp_signing_key_t sk;
  glp_public_key_t pk;
  char *message = "testtest";
  glp_signature_t sig;

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


    start_debug();
  /*run test vectors*/
  for(i = 0; i < N_GLP_TEST_VECS;i++){
    printf("running test vector %d of %d\n",i+1,N_GLP_TEST_VECS);
    if(test_vector(glp_test_vecs[i])) printf("passed\n");
    else printf("failed\n");
  }
    end_debug();

//    return 0;
  printf("******************************************************************************************************\n");

  /*test a lot of verifications*/
  printf("trying %d independent keygen/sign/verifies\n", SIGN_TRIALS);
  for(i=0; i < SIGN_TRIALS; i++){
    glp_gen_sk(&sk, NULL);
    glp_gen_pk(&pk,sk);
    if(!glp_sign(&sig, sk,(unsigned char *)message,strlen(message))){
      printf("signature failure round %d!\n",i);
    }
    if(!glp_verify(sig, pk,(unsigned char *)message,strlen(message))){
      printf("verification failure round %d!\n",i);
      return 1;
    }
    if(!(i % 100)){
      printf("passed trial %d\n",i);
    }
  }
  printf("signature scheme validates across %d independent trials\n", SIGN_TRIALS);
  printf("******************************************************************************************************\n");

  
  return 0;
}
