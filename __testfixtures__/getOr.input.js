// @flow
import _ from "lodash/fp";
import { getOr } from "lodash/fp";
import gettOr from "lodash/fp/getOr";
const foo1  = _.getOr(1, "a.b.c", bar);
const foo2  = getOr(2, "a.b.c", bar);
const foo3  = gettOr(3, "a.b.c", bar);
const foo4  = gettOr(4, "a[2].c", bar);
const foo5  = gettOr(5, ["a", foo5, "c"], bar);
const foo6  = gettOr(6, ["a", 321, "c"], bar);
const foo7  = gettOr(7, ["a", this.smthng, "c"], bar);
const foo8  = gettOr(8, ["a", foo5, "c"], bar);
const foo9 = _.getOr([], `a.${foo5}`, bar);
const foo10 = _.getOr({}, `a.${foo5}.smthng`, bar);
const foo11 = _.getOr([], someKey, bar);
const foo12 = _.getOr({}, that.bar, that.foo);
const foo13 = getOr([], 'bar[0]["60"]', foo);
const foo14 = getOr({}, "bar.data-thing", foo);
const foo15 = getOr("test", "data-bar[0].baz.data-thing", foo);
