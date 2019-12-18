// @flow
import _ from "lodash";
import { get } from "lodash";
import gett from "lodash/get";
const foo1 = bar?.a?.b?.c;
const foo2 = bar?.a?.[foo5]?.c;
const foo3 = get(bar, `a.${foo5}`);
const foo4 = gett(bar, `a.${foo5}`);
const foo5 = _.get(bar, `a.${foo5}`);
const foo6 = _.get(bar, `a.${foo5}.smthng`);
