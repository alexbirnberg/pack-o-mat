### String Views
```
C++ type                     operations+fields / invariants+properties
==========================   =========================================
JSString (abstract)          get(Latin1|TwoByte)CharsZ, get(Latin1|TwoByte)Chars, length / -
 | \
 | JSRope                    leftChild, rightChild / -
 |
JSLinearString               latin1Chars, twoByteChars / -
 |
 +-- JSDependentString       base / -
 |   |
 |   +-- JSAtomRefString     - / base points to an atom
 |
 +-- JSExternalString        - / char array memory managed by embedding
 |
 +-- JSExtensibleString      - / tracks total buffer capacity (including current text)
 |
 +-- JSInlineString (abstract) - / chars stored in header
 |   |
 |   +-- JSThinInlineString  - / header is normal
 |   |
 |   +-- JSFatInlineString   - / header is fat
 |
JSAtom (abstract)            - / string equality === pointer equality
 |  |
 |  +-- js::NormalAtom       JSLinearString + atom hash code / -
 |  |   |
 |  |   +-- js::ThinInlineAtom
 |  |                        possibly larger JSThinInlineString + atom hash code / -
 |  |
 |  +-- js::FatInlineAtom    JSFatInlineString w/atom hash code / -
 |
js::PropertyName             - / chars don't contain an index (uint32_t)
```