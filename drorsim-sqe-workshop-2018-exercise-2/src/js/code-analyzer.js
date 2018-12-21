import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

///////////////////////////////////////////////////////// my code starts here
let lineARR = [];
let typeARR = [];
let nameARR = [];
let conditionARR = [];
let valueARR = [];
let varMapLet = [];
let inputMap = {};
let inputMapLet = [];
////////////////
const mainfunc = (parsedCode,inputParsedCode) => {
    lineARR = [];
    typeARR = [];
    nameARR = [];
    conditionARR = [];
    valueARR = [];
    let varMap = {};
    varMapLet = [];
    inputMap = {};
    inputMapLet = [];
    for(let i = 0; i < parsedCode.body.length; i++){
        LineInProgram(parsedCode.body[i],varMap);
    }
    return buildSub(parsedCode,inputParsedCode);
};

const buildSub = (parsedCode,inputParsedCode) => {
    //back the parsed code to string
    buildInputMap(inputParsedCode);
    let str = escodegen.generate(parsedCode);
    let arr = str.split('\n');
    let myTable = '<table width = "100%" dir="ltr" border = "1">';
    for(let i = 0; i < arr.length; i++){
        if(arr[i].indexOf('let ') == -1){
            if(!deleteLine(arr[i])) {
                let color = chooseColor(arr[i]);
                myTable += '<tr width = "100%" bgcolor='+color+'><td>' + arr[i] + '</td></tr>';
            }
        }
    }
    myTable += '</table>';
    return myTable;
};

const LineInProgram = (parsedBlockOrLine,varMap) => {
    if(parsedBlockOrLine.type == 'FunctionDeclaration'){
        funcControl(parsedBlockOrLine,varMap);
    }
    else if(parsedBlockOrLine.type == 'ReturnStatement'){
        returnControl(parsedBlockOrLine,varMap);
    }
    else {
        LineInProgram2(parsedBlockOrLine,varMap);
    }
};

const LineInProgram2 = (parsedBlockOrLine,varMap) => {
    if(parsedBlockOrLine.type == 'ExpressionStatement'){
        expressionControl(parsedBlockOrLine.expression,varMap);
    }
    else  if(parsedBlockOrLine.type == 'IfStatement'){
        ifControl(parsedBlockOrLine,varMap);
    }
    else if(parsedBlockOrLine.type == 'VariableDeclaration'){
        for(let i = 0; i < parsedBlockOrLine.declarations.length; i++){
            varControl(parsedBlockOrLine.declarations[i],varMap);
        }
    }
    else{
        LineInProgram3(parsedBlockOrLine,varMap);
    }
};

const LineInProgram3 = (parsedBlockOrLine,varMap) => {
    if(parsedBlockOrLine.type == 'WhileStatement'){
        whileControl(parsedBlockOrLine,varMap);
    }
    else{
        BlockLine(parsedBlockOrLine,varMap);
    }
};

const BlockLine = (parsedBlockOrLine,varMap) => {
    let newVarMap = {};
    for(let i = 0; i < varMapLet.length; i++){
        newVarMap[varMapLet[i]] = varMap[varMapLet[i]];
    }
    for(let i = 0; i < parsedBlockOrLine.body.length; i++){
        LineInProgram(parsedBlockOrLine.body[i],newVarMap);
    }
};

const whileControl = (myLine,varMap) => {
    lineARR.push(myLine.loc.start.line);
    typeARR.push('While Statement');
    nameARR.push('');
    valueARR.push('');
    conditionARR.push(BinaryExpControl(myLine.test,varMap));
    LineInProgram(myLine.body,varMap);
};


const varControl = (parsedBlockOrLine,varMap) => {
    lineARR.push(parsedBlockOrLine.loc.start.line);
    typeARR.push('Variable Declaration');
    nameARR.push(parsedBlockOrLine.id.name);
    conditionARR.push('');
    if(parsedBlockOrLine.init == null){
        valueARR.push('');
    }
    else{
        valueARR.push(myHelper(parsedBlockOrLine.init,varMap));
        varMap[parsedBlockOrLine.id.name] = buildNewVar(myHelper(parsedBlockOrLine.init,varMap),varMap);
        varMapLet.push(parsedBlockOrLine.id.name);
        parsedBlockOrLine = null;
    }
};

const funcControl = (parsedBlockOrLine,varMap) => {
    lineARR.push(parsedBlockOrLine.loc.start.line);
    typeARR.push('Function Declaration');
    nameARR.push(parsedBlockOrLine.id.name);
    conditionARR.push('');
    valueARR.push('');
    for(let i = 0; i < parsedBlockOrLine.params.length; i++){
        lineARR.push(parsedBlockOrLine.loc.start.line);
        typeARR.push('Variable Declaration');
        nameARR.push(parsedBlockOrLine.params[i].name);
        conditionARR.push('');
        valueARR.push('');
    }
    LineInProgram(parsedBlockOrLine.body,varMap);
};

const returnControl = (parsedBlockOrLine,varMap) => {
    lineARR.push(parsedBlockOrLine.loc.start.line);
    typeARR.push('Return Statement');
    nameARR.push('');
    conditionARR.push('');
    if(parsedBlockOrLine.argument.type == 'Identifier'){
        valueARR.push(parsedBlockOrLine.argument.name);
        parsedBlockOrLine.argument.name = '('+switchIden(varMap,parsedBlockOrLine.argument.name)+')';
    }
    else if(parsedBlockOrLine.argument.type == 'Literal'){valueARR.push(parsedBlockOrLine.argument.raw);}
    else {returnComplexControl(parsedBlockOrLine,varMap);}

};

const returnComplexControl = (myLine,varMap) => {
    if(myLine.argument.type == 'UnaryExpression'){
        if(myLine.argument.argument.type == 'Identifier'){
            valueARR.push(myLine.argument.operator+' '+myLine.argument.argument.name);
            myLine.argument.argument.name = '('+switchIden(varMap,myLine.argument.argument.name)+')';
        }
        else if(myLine.argument.argument.type == 'Literal'){valueARR.push(myLine.argument.operator+' '+myLine.argument.argument.raw);}
    }
    else{
        valueARR.push(myHelper(myLine.argument,varMap));
    }
};

const expressionControl = (parsedBlockOrLine,varMap) => {
    if(parsedBlockOrLine.type == 'AssignmentExpression'){
        lineARR.push(parsedBlockOrLine.loc.start.line);
        typeARR.push('Assignment Expression');
        nameARR.push(parsedBlockOrLine.left.name);
        if(varMapLet.includes(parsedBlockOrLine.left.name)){
            varMap[parsedBlockOrLine.left.name] = buildNewVar(myHelper(parsedBlockOrLine.right,varMap),varMap);
        }
        conditionARR.push('');
        valueARR.push(myHelper(parsedBlockOrLine.right,varMap));
    }
};

const myHelper = (myLine,varMap) => {
    let str='';
    if(myLine.type == 'BinaryExpression'){str+=BinaryExpControl(myLine,varMap);}
    else if(myLine.type == 'Identifier'){
        str+=myLine.name;
        myLine.name = '('+switchIden(varMap,myLine.name)+')';
    }
    //else if(myLine.type == 'MemberExpression'){str += memberControl(myLine,varMap);}
    //else if(myLine.type == 'UpdateExpression'){
    //    str += myLine.argument.name+myLine.operator;
    //}
    else{str+=myLine.raw;}
    return str;
};

const ifControl = (parsedBlockOrLine,varMap) => {
    lineARR.push(parsedBlockOrLine.loc.start.line);
    typeARR.push('If Statement');
    nameARR.push('');
    valueARR.push('');
    conditionARR.push(BinaryExpControl(parsedBlockOrLine.test,varMap));
    LineInProgram(parsedBlockOrLine.consequent,varMap);
    if(parsedBlockOrLine.alternate != null){
        LineInProgram(parsedBlockOrLine.alternate,varMap);
    }
};

const BinaryExpControl = (myLine,varMap) => {
    let str = '';
    if(myLine.left.type == 'BinaryExpression'){str += BinaryExpControl(myLine.left,varMap);}
    else if(myLine.left.type == 'Identifier'){
        str += myLine.left.name;
        myLine.left.name = '('+switchIden(varMap,myLine.left.name)+')';
    }
    //else if(myLine.left.type == 'MemberExpression'){str += memberControl(myLine.left,varMap);}
    else {str += myLine.left.raw;}
    str += ' '+myLine.operator+' '+BinaryExpControlPart2(myLine,varMap);
    return str;
};

const BinaryExpControlPart2 = (myLine,varMap) => {
    let str = '';
    if(myLine.right.type == 'BinaryExpression'){return str+BinaryExpControl(myLine.right,varMap);}
    else if(myLine.right.type == 'Identifier'){
        myLine.right.name = '('+switchIden(varMap,myLine.right.name)+')';
        return str+myLine.right.name;
    }
    //else if(myLine.right.type == 'MemberExpression'){return str + memberControl(myLine.right,varMap);}
    else{return str+myLine.right.raw;}
};

/*const memberControl = (myLine,varMap) => {
    let str='';
    str += myLine.object.name + '[';
    if(myLine.property.type == 'Identifier'){
        myLine.property.name = '('+switchIden(varMap,myLine.property.name)+')';
        str += myLine.property.name;
    }
    else if(myLine.property.type == 'Literal'){str += myLine.property.raw;}
    else {str += BinaryExpControl(myLine.property,varMap);}
    str += ']';
    return str;
};*/

const buildNewVar = (term,varMap) => {
    for(let i = 0; i < varMapLet.length; i++){
        let broken = term.split(varMapLet[i]);
        if(broken.length > 1){
            let newValue = '';
            for(let j = 0; j < broken.length - 1; j++){
                newValue = newValue + broken[j] + varMap[varMapLet[i]];
            }
            newValue = newValue + broken[broken.length - 1];
            term = newValue;
        }
    }
    return term;
};

const switchIden = (varMap,term) =>{
    if(varMapLet.includes(term)){
        term = varMap[term];
    }
    return term;
};

const deleteLine = (term) => {
    let arr = term.split(' =');
    if(arr.length == 2){
        let basearr = arr[0].split(' ');
        if(varMapLet.includes(basearr[basearr.length - 1])){
            return true;
        }
    }
    return false;
};

const buildInputMap = (input) => {
    if(input.body.length == 1){
        if(input.body[0].type == 'VariableDeclaration'){
            for(let i = 0; i < input.body[0].declarations.length; i++){
                if(input.body[0].declarations[i].init != null){
                    inputMap[input.body[0].declarations[i].id.name] = input.body[0].declarations[i].init.raw;
                    inputMapLet.push(input.body[0].declarations[i].id.name);
                }
            }
        }
    }
};
const chooseColor = (str) => {
    let myArr = str.split('if (');
    if(myArr.length == 2){
        let comp = myArr[1].split(') {')[0];
        if(inputMapLet.length == 0){
            return '';
        }
        comp = switchInput(comp);
        if(eval(comp)){
            return '#aaff80';
        }
        else{
            return '#ff6666';
        }
    }
    return '';
};
const switchInput = (str) => {
    for(let i = 0; i < inputMapLet.length; i++){
        let broken = str.split(inputMapLet[i]);
        if(broken.length > 1){
            let newValue = '';
            for(let j = 0; j < broken.length - 1; j++){
                newValue = newValue + broken[j] + inputMap[inputMapLet[i]];
            }
            newValue = newValue + broken[broken.length - 1];
            str = newValue;
        }
    }
    return str;
};
//////////////////////////////////////////////////////////////

export {parseCode,mainfunc};

