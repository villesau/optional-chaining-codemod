// @flow
import _ from "lodash";
import { get } from "lodash/fp";
import gett from "lodash/fp/get";
const foo1  = _.get("a.b.c", bar);
const foo2  = get("a.b.c", bar);
const foo3  = gett("a.b.c", bar);
const foo4  = gett("a[2].c", bar);
const foo5  = gett(["a", foo5, "c"], bar);
const foo6  = gett(["a", 321, "c"], bar);
const foo7  = gett(["a", this.smthng, "c"], bar);
const foo8  = gett(["a", foo5, "c"], bar);
const foo9 = _.get(`a.${foo5}`, bar);
const foo10 = _.get(`a.${foo5}.smthng`, bar);
const foo11 = _.get(someKey, bar);
const foo12 = _.get(that.bar, that.foo);
const foo13 = get('bar[0]["60"]', foo);
const foo14 = get("bar.data-thing", foo);
const foo15 = get("data-bar[0].baz.data-thing", foo);
