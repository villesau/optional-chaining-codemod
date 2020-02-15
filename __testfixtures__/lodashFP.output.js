// @flow
const foo1  = bar?.a?.b?.c;
const foo2  = bar?.a?.b?.c;
const foo3  = bar?.a?.b?.c;
const foo4  = bar?.a?.[2]?.c;
const foo5  = bar?.a?.[foo5]?.c;
const foo6  = bar?.a?.[321]?.c;
const foo7  = bar?.a?.[this.smthng]?.c;
const foo8  = bar?.a?.[foo5]?.c;
const foo9 = bar?.a?.[foo5];
const foo10 = bar?.a?.[foo5]?.smthng;
const foo11 = bar?.[someKey];
const foo12 = that.foo?.[that.bar];
const foo13 = foo?.bar?.[0]?.[60];
const foo14 = foo?.bar?.["data-thing"];
const foo15 = foo?.["data-bar"]?.[0]?.baz?.["data-thing"];
