#############################################################
# Makefile for static library.
#############################################################
#set your own environment option
CC = emcc
CC_FLAG = -O3 -Wall -Wextra -std=gnu99 -pedantic -Wfatal-errors -DGLP_N=1024
INC = -I/usr/include -L/usr/lib
#static library use 'ar' command
AR = ar

#set your inc and lib
LIB =

#make target lib and relevant obj
PRG = libglyph.a
SRCS = glp.c glyph.c glp_utils.c glp_rand.c sha256.c glp_rand_openssl_aes.c FFT/FFT_1024_59393.c aes/aes_core.c aes/aes_ctr.c
OBJ := ${SRCS:.c=.o}

#all target
all:$(PRG)
$(PRG):$(OBJ)
	${AR} rcs $@ $^

.SUFFIXES: .c .o
.c.o:
	$(CC) ${INC} ${LIB} $(CC_FLAG) $(INC) -c $*.c -o $*.o

.PRONY:clean
clean:
	@echo "Removing linked and compiled files......"
	rm -f $(OBJ) $(PRG)
