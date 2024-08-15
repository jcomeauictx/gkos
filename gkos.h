#include <linux/input.h>
#include <stdint.h>
#include <stdbool.h>

#ifndef GKOS_H
#define GKOS_H

/* the 6 keys of a GKOS keyboard */
#define _ 0x00  /* for representing keys NOT held down in a group */
#define A 0x01
#define B 0x02
#define C 0x04
#define D 0x08
#define E 0x10
#define F 0x20

bool gkos_init(void);
bool gkos_handle_keys(char keymap);

/** The following need to be defined on a per-platform basis (see
 * main-linux.c for an example) 
 *
 * The keycode will be a keycode from linux/input.h, so some may need
 * to be translated to work on the platform as expected
 */ 
bool gkos_send_keydown(uint16_t keycode);
bool gkos_send_keyup(uint16_t keycode);
bool gkos_move_mouse();
//int suinput_move_pointer(int uinput_fd, int32_t x, int32_t y);
#endif /* GKOS_H */
