# Pack-O-Mat
### String Views
```
C++ type                     operations+fields / invariants+properties
==========================   =========================================
JSString (abstract)          get(Latin1|TwoByte)CharsZ, get(Latin1|TwoByte)Chars, length / -    N/A
 | \
 | JSRope                    leftChild, rightChild / -                                          XXX
 |
JSLinearString               latin1Chars, twoByteChars / -                                      OK
 |
 +-- JSDependentString       base / -                                                           OK
 |   |
 |   +-- JSAtomRefString     - / base points to an atom                                         N/A
 |
 +-- JSExternalString        - / char array memory managed by embedding                         OK
 |
 +-- JSExtensibleString      - / tracks total buffer capacity (including current text)          OK
 |
 +-- JSInlineString (abstract) - / chars stored in header                                       OK
 |   |
 |   +-- JSThinInlineString  - / header is normal                                               OK
 |   |
 |   +-- JSFatInlineString   - / header is fat                                                  OK
 |
JSAtom (abstract)            - / string equality === pointer equality                           N/A
 |  |
 |  +-- js::NormalAtom       JSLinearString + atom hash code / -                                OK
 |  |   |
 |  |   +-- js::ThinInlineAtom                                                                  OK
 |  |                        possibly larger JSThinInlineString + atom hash code / -       
 |  |
 |  +-- js::FatInlineAtom    JSFatInlineString w/atom hash code / -                             OK
 |
js::PropertyName             - / chars don't contain an index (uint32_t)                        N/A
```

TODO:
- Evaluate raw performance
- GC statistics
- JIT enabled?
- Allocation site profiling?
- Other data compressed? (Metaspace) ETH
