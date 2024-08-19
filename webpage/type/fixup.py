#!/usr/bin/python3
r'''
fixup for javascript source with characters that don't show in terminal.

replace them with "\uNNNN". latin-1 characters should all be okay,
as are Greek and Russian (using urxvt)
'''
import sys

DEFAULTS = (None, '', '-')  # args that mean "use stdio"

def fixup(instream=None, outstream=None):
    '''
    process files or streams character by character
    '''
    # pylint: disable=consider-using-with
    instream = (sys.stdin if instream in DEFAULTS else
                open(instream, 'r', encoding='utf-8'))
    outstream = (sys.stdout if outstream in DEFAULTS else
                 open(outstream, 'w', encoding='utf-8'))
    for character in instream.read():
        codepoint = ord(character)
        outstream.write(character if okay(codepoint) else escape(codepoint))

def escape(codepoint):
    '''
    return unicode escape for codepoint
    '''
    # pylint: disable=consider-using-f-string
    return r'\u%04x' % codepoint

def okay(codepoint):
    '''
    determine if codepoint within a range tolerated by urxvt or similar xterm
    '''
    return (
        (codepoint < 0x300) or
        (0x363 < codepoint < 0x900) or
        (0x1e00 < codepoint < 0x2e80)
    )
if __name__ == '__main__':
    fixup(*sys.argv[1:])
