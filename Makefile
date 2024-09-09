SHELL := /bin/bash
LIBS = -lsuinput -ludev $(pkgconf --libs libhid-libusb)
CFLAGS = -Wall -g -I . -I ../libhid/include -I ../libhid/hidparser
CXXFLAGS = -L ../droid-VNC-server/jni/vnc

all: gkos

gkos: main-linux.c gkos.c gkos.h
	gcc $(CFLAGS) $(CXXFLAGS) $(LIBS) gkos.c main-linux.c -o gkos

clean:
	rm -f *.o gkos
