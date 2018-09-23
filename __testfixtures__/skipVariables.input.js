// @flow
import _ from "lodash";
import { get } from "lodash";
import gett from "lodash/get";
const foo = _.get(bar, "a.b.c");
const foo = get(bar, "a.b.c");
const foo = gett(bar, ["a", foo5, "c"]);
const foo = gett(bar, someVar);
const foo = get(bar, someVar);
const foo = _.get(bar, someKey);
const foo = _.get(that.foo, that.bar);
