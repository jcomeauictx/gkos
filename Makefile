SHELL := /bin/bash
PKG_CONFIG_PATH := ../libhid/pkgconfig
CFLAGS := -Wall -g -I . -I ../libhid/include -I ../libhid/hidparser
LIBHID := $(shell PKG_CONFIG_PATH=$(PKG_CONFIG_PATH) pkgconf --libs libhid)
LDFLAGS := -lsuinput -ludev $(LIBHID)
LDFLAGS += -L ../droid-VNC-server/jni/vnc -L $(HOME)/usr/lib -L $(HOME)/lib
ifneq ($(SHOWENV),)
 export
endif
all: gkos
gkos: main-linux.c gkos.c gkos.h
	gcc $(CFLAGS) gkos.c main-linux.c -o gkos $(LDFLAGS)
clean:
	rm -f *.o
distclean: clean
	rm -f gkos
env:
ifeq ($(SHOWENV),)
	make SHOWENV=1 $@
else
	env
endif
