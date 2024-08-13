SHELL := /bin/bash
LIBS = -lsuinput -ludev $(pkgconf --libs libhid-libusb)
CFLAGS = -Wall -g -I $(HOME)/include

all: gkos

gkos: main-linux.c gkos.c gkos.h
	gcc $(CFLAGS) $(LIBS) gkos.c main-linux.c -o gkos

clean:
	rm -f *.o gkos
