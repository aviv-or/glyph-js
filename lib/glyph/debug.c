//
// Created by Isaac on 2018/3/27.
//
#include "glp_utils.h"
#include <stdio.h>

void printHex(unsigned char *bytes, int count) {
    for (int i = 0; i < count; ++i) {
        printf("0x%02x,", bytes[i]);
    }
    printf("\n");
}

void print_poly(const RINGELT f[N]){
    uint16_t i;
    for(i = 0; i < N ; i++){
        printf("%ld ", 2*f[i] < Q ? f[i] : (long)f[i] - Q );
    }
    printf("\n");
}


void print_sk(const glp_signing_key_t sk){
    printf("s1:");
    print_poly(sk.s1);
    printf("\n");
    printf("s2:");
    print_poly(sk.s2);
}


void print_pk(const glp_public_key_t pk){
    printf("t:");
    print_poly(pk.t);
}

void print_sparse(const sparse_poly_t s){
    uint16_t i;
    for(i = 0; i < OMEGA; i++) printf("(%d,%d)",s.pos[i],s.sign[i]);
    printf("\n");
}

void print_sig(const glp_signature_t sig){
    printf("z1:");
    print_poly(sig.z1);
    printf("\n");
    printf("z2:");
    print_poly(sig.z2);
    printf("\n");
    printf("c:");
    print_sparse(sig.c);
    printf("\n");
}

