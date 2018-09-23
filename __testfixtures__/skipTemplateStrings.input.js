// @flow
import _ from "lodash";
import { get } from "lodash";
import gett from "lodash/get";
const foo = _.get(bar, "a.b.c");
const foo = gett(bar, ["a", foo5, "c"]);
const foo = get(bar, `a.${foo5}`);
const foo = gett(bar, `a.${foo5}`);
const foo = _.get(bar, `a.${foo5}`);
const foo = _.get(bar, `a.${foo5}.smthng`);
