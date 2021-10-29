// @flow
const foo1  = o => o?.a?.b?.c;
const foo2  = o => o?.a?.b?.c;
const foo3  = o => o?.a?.b?.c;
const foo4  = o => o?.a?.[2]?.c;
const foo5  = o => o?.a?.[foo5]?.c;
const foo6  = o => o?.a?.[321]?.c;
const foo7  = o => o?.a?.[this.smthng]?.c;
const foo8  = o => o?.a?.[foo5]?.c;
const foo9 = o => o?.a?.[foo5];
const foo10 = o => o?.a?.[foo5]?.smthng;
const foo11 = o => o?.[someKey];
const foo12 = o => o?.[that.bar];
const foo13 = o => o?.bar?.[0]?.[60];
const foo14 = o => o?.bar?.["data-thing"];
const foo15 = o => o?.["data-bar"]?.[0]?.baz?.["data-thing"];
