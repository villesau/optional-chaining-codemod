import _ from 'lodash';
import { get } from 'lodash';
import gett from 'lodash/get';
const lol = _.get(jep, 'a.b.c');
const lol1 = get(jep, 'a.b.c');
const lol2 = gett(jep, 'a.b.c');
const lol3 = gett(jep, 'a[2].c');
const lol4 = gett(jep, ['a', lol5, 'c']);
