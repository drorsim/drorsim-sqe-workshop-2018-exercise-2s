import $ from 'jquery';
import {parseCode,mainfunc} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        document.getElementById('parseTable').innerHTML = '';
        let codeToParse = $('#codePlaceholder').val();
        let inputCodeToParse = $('#codePlaceholder2').val();
        let parsedCode = parseCode(codeToParse);
        let inputParsedCode = parseCode(inputCodeToParse);
        document.getElementById('parseTable').innerHTML = mainfunc(parsedCode,inputParsedCode);
    });
});
