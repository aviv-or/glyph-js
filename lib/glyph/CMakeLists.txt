cmake_minimum_required(VERSION 3.8)
project(glyph)

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_COMPILER /usr/bin/gcc)

add_definitions(-DGLP_N=1024)

add_executable(glyph
        test/test.c
        test/test_vectors.c
        test/test_vectors.h
        test/test_vectors_1024.h
        debug.c)

add_library(glp
        FFT/FFT_1024_59393.c
        FFT/FFT_1024_59393.h
        FFT/FFT_includes.h
        aes/aes_ctr.c
        aes/aes_core.c
        glp.c
        glp.h
        sha256.c
        sha256.h
        glp_consts.h
        glp_consts_1024.h
        glp_rand.c
        glp_rand.h
        glp_rand_openssl_aes.c
        glp_rand_openssl_aes.h
        glp_utils.c
        glp_utils.h
        aes/aes_locl.h
        glyph.c glyph.h)

add_executable(test_glyph test/test_glyph.c debug.c test/test_vectors.c)

target_link_libraries(test_glyph glp)

target_link_libraries(glyph glp)