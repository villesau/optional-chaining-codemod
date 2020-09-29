// @flow
import _ from "lodash/fp";
import { get } from "lodash/fp";
import gett from "lodash/fp/get";
const foo1  = _.get("a.b.c");
const foo2  = get("a.b.c");
const foo3  = gett("a.b.c");
const foo4  = gett("a[2].c");
const foo5  = gett(["a", foo5, "c"]);
const foo6  = gett(["a", 321, "c"]);
const foo7  = gett(["a", this.smthng, "c"]);
const foo8  = gett(["a", foo5, "c"]);
const foo9 = _.get(`a.${foo5}`);
const foo10 = _.get(`a.${foo5}.smthng`);
const foo11 = _.get(someKey);
const foo12 = _.get(that.bar);
const foo13 = get('bar[0]["60"]');
const foo14 = get("bar.data-thing");
const foo15 = get("data-bar[0].baz.data-thing");
