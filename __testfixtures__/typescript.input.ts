import _ from "lodash";
import * as star from "lodash";
import { get } from "lodash";
import gett from "lodash/get";

const foo1  = _.get(bar, "a.b.c");
const foo2  = get(bar, "a.b.c");
const foo3  = gett(bar, "a.b.c");
const foo4  = gett(bar, "a[2].c");
const foo5  = gett(bar, ["a", foo5, "c"]);
const foo6  = gett(bar, ["a", 321, "c"]);
const foo7  = gett(bar, ["a", this.smthng, "c"]);
const foo8  = gett(bar, ["a", foo5, "c"], 123);
const foo9  = gett(bar, ["a", foo5, "c"], "what");
const foo10 = gett(bar, ["a", foo5, "c"], barr);
const foo11 = _.get(bar, `a.${foo5}`);
const foo12 = _.get(bar, `a.${foo5}.smthng`);
const foo13 = _.get(bar, someKey);
const foo14 = _.get(that.foo, that.bar);
const foo15 = get(foo, 'bar[0]["60"]');
const foo16 = get(foo, "bar.data-thing");
const foo17 = get(foo, "data-bar[0].baz.data-thing", value);
const foo18 = get(foo, getPath(name));
const foo19 = star.get(bar, "a.b.c");

