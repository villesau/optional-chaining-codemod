// @flow
import _ from "lodash";
import { get } from "lodash";
import gett from "lodash/get";
const foo1 = _.get(bar, "a.b.c");
const foo2 = get(bar, "a.b.c");
const foo3 = gett(bar, ["a", foo5, "c"]);
const foo4 = gett(bar, someVar);
const foo5 = get(bar, someVar);
const foo6 = _.get(bar, someKey);
const foo7 = _.get(that.foo, that.bar);
const foo8 = get(foo, getPath(name));
