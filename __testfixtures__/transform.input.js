import _ from 'lodash';
import { get } from 'lodash';
import gett from 'lodash/get';
const lol = _.get(jep, 'a.b.c');
const lol1 = get(jep, 'a.b.c');
const lol2 = gett(jep, 'a.b.c');
