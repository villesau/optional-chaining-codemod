const foo1 = a && a.b && a.b.c && a.b.c.d;
const foo2 = a || a.b;
const foo3 = a?.b.c.d;
const foo4 = a && a.b.c.d;
const foo5 = a && a.b && a.b.c.d;
const foo6 = a && a.b && a.d.c.d;
const foo7 = a && a.b.c && a.b.c.d;
const foo8 = a.b && a.b.c;
const foo9 = a.b && a.b.b.b;
const foo10 = a.b && a.b.b.b.b.b;
const foo11 = a && a.b.b.b.b.b;
const foo12 = a && a.b && a.b.c || a.b.c.d;
const foo13 = a && a[j.k];
this.a.b && this.b.c;
