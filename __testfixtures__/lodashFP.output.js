// @flow
const foo1  = bar?.a?.b?.c;
const foo2  = bar?.a?.b?.c;
const foo3  = bar?.a?.b?.c;
const foo4  = bar?.a?.[2]?.c;
const foo5  = bar?.a?.[foo5]?.c;
const foo6  = bar?.a?.[321]?.c;
const foo7  = bar?.a?.[this.smthng]?.c;
const foo8  = bar?.a?.[foo5]?.c ?? 123;
const foo9  = bar?.a?.[foo5]?.c ?? "what";
const foo10 = bar?.a?.[foo5]?.c ?? barr;
const foo11 = bar?.a?.[foo5];
const foo12 = bar?.a?.[foo5]?.smthng;
const foo13 = bar?.[someKey];
const foo14 = that.foo?.[that.bar];
const foo15 = foo?.bar?.[0]?.[60];
const foo16 = foo?.bar?.["data-thing"];
const foo17 = foo?.["data-bar"]?.[0]?.baz?.["data-thing"] ?? value;
