SHELL := /bin/bash
PKG_CONFIG_PATH := ../libhid/pkgconfig
LIBHID := $(shell PKG_CONFIG_PATH=$(PKG_CONFIG_PATH) pkgconf --libs libhid)
LIBS := -lsuinput -ludev $(LIBHID)
CFLAGS := -Wall -g -I . -I ../libhid/include -I ../libhid/hidparser
CXXFLAGS := -L ../droid-VNC-server/jni/vnc -L $(HOME)/usr/lib -L $(HOME)/lib
ifneq ($(SHOWENV),)
 export
else
endif

all: gkos

gkos: main-linux.c gkos.c gkos.h
	gcc $(CFLAGS) $(CXXFLAGS) $(LIBS) gkos.c main-linux.c -o gkos

clean:
	rm -f *.o gkos
env:
ifeq ($(SHOWENV),)
	make SHOWENV=1 $@
else
	env
endif
libs:  # just for testing why linker fails
	pkgconf --libs libhid
