// @flow
import _ from "lodash";
import { get } from "lodash";
import gett from "lodash/get";
const foo = _.get(bar, "a.b.c");
const foo = get(bar, "a.b.c");
const foo = gett(bar, "a.b.c");
const foo = gett(bar, "a[2].c");
const foo = gett(bar, ["a", foo5, "c"]);
const foo = gett(bar, ["a", 321, "c"]);
const foo = gett(bar, ["a", this.smthng, "c"]);
const foo = gett(bar, ["a", foo5, "c"], 123);
const foo = gett(bar, ["a", foo5, "c"], "what");
const foo = gett(bar, ["a", foo5, "c"], barr);
const foo = _.get(bar, `a.${foo5}`);
const foo = _.get(bar, `a.${foo5}.smthng`);
const foo = _.get(bar, someKey);
const foo = _.get(that.foo, that.bar);
