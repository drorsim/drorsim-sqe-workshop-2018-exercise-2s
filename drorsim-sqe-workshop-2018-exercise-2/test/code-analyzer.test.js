import assert from 'assert';
import {parseCode,mainfunc} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing a simple var dec correctly', () => {
        assert.equal(
            mainfunc(parseCode('function test1(x,y){\n' +
                '    if(x == y){\n' +
                '       x = x + 1;\n' +
                '    }\n' +
                '    else{ \n' +
                '        y = y + 1;\n' +
                '    }\n' +
                '}'),parseCode('let x = 1, y = 2;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function test1(x, y) {</td></tr><tr width = "100%" bgcolor=#ff6666><td>    if ((x) == (y)) {</td></tr><tr width = "100%" bgcolor=><td>        x = (x) + 1;</td></tr><tr width = "100%" bgcolor=><td>    } else {</td></tr><tr width = "100%" bgcolor=><td>        y = (y) + 1;</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('is parsing a example 1', () => {
        assert.equal(
            mainfunc(parseCode('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '        return x + y + z + c;\n' +
                '    }\n' +
                '}\n'),parseCode('let x = 1, y = 2, z = 3;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function foo(x, y, z) {</td></tr><tr width = "100%" bgcolor=#ff6666><td>    if ((((x) + 1) + ((y))) < (z)) {</td></tr><tr width = "100%" bgcolor=><td>        return (x) + (y) + (z) + (0 + 5);</td></tr><tr width = "100%" bgcolor=#aaff80><td>    } else if ((((x) + 1) + ((y))) < (z) * 2) {</td></tr><tr width = "100%" bgcolor=><td>        return (x) + (y) + (z) + (0 + (x) + 5);</td></tr><tr width = "100%" bgcolor=><td>    } else {</td></tr><tr width = "100%" bgcolor=><td>        return (x) + (y) + (z) + (0 + (z) + 5);</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('test3', () => {
        assert.equal(
            mainfunc(parseCode('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}'),parseCode('let x = 1, y = 2, z = 3;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function foo(x, y, z) {</td></tr><tr width = "100%" bgcolor=><td>    while (((x) + 1) < (z)) {</td></tr><tr width = "100%" bgcolor=><td>        z = ((x) + 1 + (((x) + 1) + ((y)))) * 2;</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>    return (z);</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('test4', () => {
        assert.equal(
            mainfunc(parseCode('function test(x,y){\n' +
                '    if(x == y){\n' +
                '        return -1\n' +
                '    }\n' +
                '    else if(x > y){\n' +
                '        return -x\n' +
                '    }\n' +
                '    else{\n' +
                '        return -y\n' +
                '    }\n' +
                '}'),parseCode('let x = 1, y = 2;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function test(x, y) {</td></tr><tr width = "100%" bgcolor=#ff6666><td>    if ((x) == (y)) {</td></tr><tr width = "100%" bgcolor=><td>        return -1;</td></tr><tr width = "100%" bgcolor=#ff6666><td>    } else if ((x) > (y)) {</td></tr><tr width = "100%" bgcolor=><td>        return -(x);</td></tr><tr width = "100%" bgcolor=><td>    } else {</td></tr><tr width = "100%" bgcolor=><td>        return -(y);</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('test5', () => {
        assert.equal(
            mainfunc(parseCode('function test(x,y){\n' +
                '    if(x == y){\n' +
                '        return 1\n' +
                '    }\n' +
                '    else if(x > y){\n' +
                '        return -x\n' +
                '    }\n' +
                '    else{\n' +
                '        return y\n' +
                '    }\n' +
                '}'),parseCode('let x = 1, y = 2;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function test(x, y) {</td></tr><tr width = "100%" bgcolor=#ff6666><td>    if ((x) == (y)) {</td></tr><tr width = "100%" bgcolor=><td>        return 1;</td></tr><tr width = "100%" bgcolor=#ff6666><td>    } else if ((x) > (y)) {</td></tr><tr width = "100%" bgcolor=><td>        return -(x);</td></tr><tr width = "100%" bgcolor=><td>    } else {</td></tr><tr width = "100%" bgcolor=><td>        return (y);</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('test6', () => {
        assert.equal(
            mainfunc(parseCode('function swipe(x,y){\n' +
                '    let temp  = x;\n' +
                '    x = y;\n' +
                '    y = temp;\n' +
                '}'),parseCode('let x = 1, y = 2;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function swipe(x, y) {</td></tr><tr width = "100%" bgcolor=><td>    x = (y);</td></tr><tr width = "100%" bgcolor=><td>    y = ((x));</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('test7', () => {
        assert.equal(
            mainfunc(parseCode('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = 2*a + y;\n' +
                '    let c = 0;\n' +
                '\n' +
                '    while(c < 10){\n' +
                '        c = c + 1;\n' +
                '    }\n' +
                '\n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } \n' +
                '    else {\n' +
                '        c = c + z + 5 + a + b;\n' +
                '        return 20*c;\n' +
                '    }\n' +
                '}'),parseCode('let x = 1, y = 2, z = 3;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function foo(x, y, z) {</td></tr><tr width = "100%" bgcolor=><td>    while ((0) < 10) {</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=#ff6666><td>    if ((2 * (((x) + 1)) + ((y))) < (z)) {</td></tr><tr width = "100%" bgcolor=><td>        return (x) + (y) + (z) + (0 + 5);</td></tr><tr width = "100%" bgcolor=><td>    } else {</td></tr><tr width = "100%" bgcolor=><td>        return 20 * (0 + (z) + 5 + ((x) + 1) + (2 * (((x) + 1)) + ((y))));</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('test8', () => {
        assert.equal(
            mainfunc(parseCode('function test(x,y){\n' +
                '    if(x + y < 10){\n' +
                '        return 10;\n' +
                '    }\n' +
                '    else if(x - y > 20){\n' +
                '        return -20;\n' +
                '    }\n' +
                '    else if(x + y > 20){\n' +
                '        return 6 + x + y;\n' +
                '    }\n' +
                '    else{\n' +
                '        return x - y + 5;\n' +
                '    }\n' +
                '}'),parseCode('let x = 14, y = 3;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function test(x, y) {</td></tr><tr width = "100%" bgcolor=#ff6666><td>    if ((x) + (y) < 10) {</td></tr><tr width = "100%" bgcolor=><td>        return 10;</td></tr><tr width = "100%" bgcolor=#ff6666><td>    } else if ((x) - (y) > 20) {</td></tr><tr width = "100%" bgcolor=><td>        return -20;</td></tr><tr width = "100%" bgcolor=#ff6666><td>    } else if ((x) + (y) > 20) {</td></tr><tr width = "100%" bgcolor=><td>        return 6 + (x) + (y);</td></tr><tr width = "100%" bgcolor=><td>    } else {</td></tr><tr width = "100%" bgcolor=><td>        return (x) - (y) + 5;</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('test9', () => {
        assert.equal(
            mainfunc(parseCode('function test(x,y){\n' +
                '    while(x < y){\n' +
                '        x = x + 1;\n' +
                '    }\n' +
                '    if(y < 10){\n' +
                '        y = 20;\n' +
                '    }\n' +
                '    return x;\n' +
                '}'),parseCode('let x = 14, y = 3;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function test(x, y) {</td></tr><tr width = "100%" bgcolor=><td>    while ((x) < (y)) {</td></tr><tr width = "100%" bgcolor=><td>        x = (x) + 1;</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=#aaff80><td>    if ((y) < 10) {</td></tr><tr width = "100%" bgcolor=><td>        y = 20;</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>    return (x);</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });
    it('test10', () => {
        assert.equal(
            mainfunc(parseCode('function test(x,y){\n' +
                '    let a = x;\n' +
                '    let b = y;\n' +
                '    let c = a + b;\n' +
                '    while(a < b){\n' +
                '        a = a + 1;\n' +
                '    }\n' +
                '    if(a > c){\n' +
                '        return c;\n' +
                '    }\n' +
                '    else{\n' +
                '        return b;\n' +
                '    }\n' +
                '}'),parseCode('let x = 5, y = 10;')),
            '<table width = "100%" dir="ltr" border = "1"><tr width = "100%" bgcolor=><td>function test(x, y) {</td></tr><tr width = "100%" bgcolor=><td>    while (((x)) < ((y))) {</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=#ff6666><td>    if (((x)) > (((x)) + (((y))))) {</td></tr><tr width = "100%" bgcolor=><td>        return (((x)) + (((y))));</td></tr><tr width = "100%" bgcolor=><td>    } else {</td></tr><tr width = "100%" bgcolor=><td>        return ((y));</td></tr><tr width = "100%" bgcolor=><td>    }</td></tr><tr width = "100%" bgcolor=><td>}</td></tr></table>'
        );
    });


});
