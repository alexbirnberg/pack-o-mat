#include "js/PropertyAndElement.h"  // JS_DefineProperty, JS_DefinePropertyById, JS_GetProperty
#include "jsapi-tests/tests.h"
#include "vm/JSFunction.h"  // for js::IsInternalFunctionObject
#include "vm/JSObject-inl.h"
#include "vm/StringType-inl.h"

using namespace js;

inline uint64_t rdtsc() {
    unsigned int lo, hi;
    __asm__ __volatile__ (
        "rdtsc" : "=a" (lo), "=d" (hi)
    );
    return ((uint64_t)hi << 32) | lo;
}

BEGIN_TEST(testLinearString) {
  static const JS::Latin1Char chars[] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor volutpat velit vel volutpat. Maecenas vestibulum ut risus a dignissim. Pellentesque ullamcorper vulputate lectus, at varius dui sodales eu. Donec commodo lacinia massa, in pretium tellus scelerisque eu. Pellentesque fermentum, metus in tempus rhoncus, turpis arcu gravida leo, et bibendum tortor felis vitae risus. Fusce id sem purus. Duis vel lectus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ornare mi tortor, non rhoncus erat vehicula vel. Duis ac est est. Sed et fringilla ex. Vestibulum bibendum dolor eu consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor volutpat velit vel volutpat. Maecenas vestibulum ut risus a dignissim. Pellentesque ullamcorper vulputate lectus, at varius dui sodales eu. Donec commodo lacinia massa, in pretium tellus scelerisque eu. Pellentesque fermentum, metus in tempus rhoncus, turpis arcu gravida leo, et bibendum tortor felis vitae risus. Fusce id sem purus. Duis vel lectus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ornare mi tortor, non rhoncus erat vehicula vel. Duis ac est est. Sed et fringilla ex. Vestibulum bibendum dolor eu consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor volutpat velit vel volutpat. Maecenas vestibulum ut risus a dignissim. Pellentesque ullamcorper vulputate lectus, at varius dui sodales eu. Donec commodo lacinia massa, in pretium tellus scelerisque eu. Pellentesque fermentum, metus in tempus rhoncus, turpis arcu gravida leo, et bibendum tortor felis vitae risus. Fusce id sem purus. Duis vel lectus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ornare mi tortor, non rhoncus erat vehicula vel. Duis ac est est. Sed et fringilla ex. Vestibulum bibendum dolor eu consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor volutpat velit vel volutpat. Maecenas vestibulum ut risus a dignissim. Pellentesque ullamcorper vulputate lectus, at varius dui sodales eu. Donec commodo lacinia massa, in pretium tellus scelerisque eu. Pellentesque fermentum, metus in tempus rhoncus, turpis arcu gravida leo, et bibendum tortor felis vitae risus. Fusce id sem purus. Duis vel lectus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ornare mi tortor, non rhoncus erat vehicula vel. Duis ac est est. Sed et fringilla ex. Vestibulum bibendum dolor eu consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor volutpat velit vel volutpat. Maecenas vestibulum ut risus a dignissim. Pellentesque ullamcorper vulputate lectus, at varius dui sodales eu. Donec commodo lacinia massa, in pretium tellus scelerisque eu. Pellentesque fermentum, metus in tempus rhoncus, turpis arcu gravida leo, et bibendum tortor felis vitae risus. Fusce id sem purus. Duis vel lectus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ornare mi tortor, non rhoncus erat vehicula vel. Duis ac est est. Sed et fringilla ex. Vestibulum bibendum dolor eu consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor volutpat velit vel volutpat. Maecenas vestibulum ut risus a dignissim. Pellentesque ullamcorper vulputate lectus, at varius dui sodales eu. Donec commodo lacinia massa, in pretium tellus scelerisque eu. Pellentesque fermentum, metus in tempus rhoncus, turpis arcu gravida leo, et bibendum tortor felis vitae risus. Fusce id sem purus. Duis vel lectus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ornare mi tortor, non rhoncus erat vehicula vel. Duis ac est est. Sed et fringilla ex. Vestibulum bibendum dolor eu consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor volutpat velit vel volutpat. Maecenas vestibulum ut risus a dignissim. Pellentesque ullamcorper vulputate lectus, at varius dui sodales eu. Donec commodo lacinia massa, in pretium tellus scelerisque eu. Pellentesque fermentum, metus in tempus rhoncus, turpis arcu gravida leo, et bibendum tortor felis vitae risus. Fusce id sem purus. Duis vel lectus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ornare mi tortor, non rhoncus erat vehicula vel. Duis ac est est. Sed et fringilla ex. Vestibulum bibendum dolor eu consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porttitor volutpat velit vel volutpat. Maecenas vestibulum ut risus a dignissim. Pellentesque ullamcorper vulputate lectus, at varius dui sodales eu. Donec commodo lacinia massa, in pretium tellus scelerisque eu. Pellentesque fermentum, metus in tempus rhoncus, turpis arcu gravida leo, et bibendum tortor felis vitae risus. Fusce id sem purus. Duis vel lectus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ornare mi tortor, non rhoncus erat vehicula vel. Duis ac est est. Sed et fringilla ex. Vestibulum bibendum dolor eu consectetur mollis.";
  static const size_t len = js_strlen(chars);
  char16_t c;

  RefPtr<mozilla::StringBuffer> buffer = mozilla::StringBuffer::Create(chars, len);
  CHECK(buffer);

  // Don't purge the ExternalStringCache.
  js::gc::AutoSuppressGC suppress(cx);

  RefPtr<mozilla::StringBuffer> bufferRef(std::move(buffer));
  Rooted<JSString::OwnedChars<JS::Latin1Char>> owned(cx, std::move(bufferRef), len);
  JS::Rooted<JSLinearString*> str(cx, JSLinearString::new_<CanGC, JS::Latin1Char>(cx, &owned, gc::Heap::Default));

  // field = nonInlineCharsLatin1  
  // 1. Test length
  printf("\n");
  printf("  Testing length\n");
  printf("  length = %zu\n\n", str->length());

  // 2. Test allocation
  JS::AutoCheckCannotGC nogc;
  printf("  Testing field\n");
  printf("  field = %p\n\n", str->latin1Chars(nogc));

  // 3. Test chars
  printf("  Testing chars\n");
  str->getChar(cx, 0, &c);
  printf("  c = %c\n\n", c);
  
  return true;
}
END_TEST(testLinearString)
