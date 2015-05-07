
"use strict";
//load file grammar.pegjs
var parser;
window.variables = {}; //var holder for parser
$(function() {

  $.get("grammar.pegjs", function(data) {
    parser = PEG.buildParser(data);
    window.parse = parser.parse;
    refreshCanvas();

    test();
  });
  //reload at change at console
  $("#console-input").change(refreshCanvas);

});

var refreshCanvas = function() {
  variables = {}; //clean up vars
  var result = parser.parse(($("#console-input").val()).replace(/ /g, ""));
  var new_can = $('<div>');


  for(var i = 0; i < result.length; i++){
    var line = $('<p>');
    for(var j = 0; j < result[i].length; j++){
      if(j != 0){
        var color = "black-ignored";
        if(!isNaN(result[i][j-1].c) && !isNaN(result[i][j].c)){
          if(result[i][j].c == result[i][j-1].c){
            color = "green-valid";
          }else{
            color = "red-wrong";
          }
        }

        line.append($("<span>").attr('class', 'MathJax ' + color).text(" = "));
      }

      line.append($("<span>").text("`" + result[i][j].d + "`"));
    }

    new_can.append(line);
  }

  //debugger;
  $("#canvas-field").empty().append(new_can);
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
};

//little unit test
function test(){
  console.assert(parseAndReturnNumber("sumi*i+2overifrom0to4") == 40, "summation test #1 failed");
  console.assert(parseAndReturnNumber("(2+2)*(5+10)") == 60, "bracket test #1 failed");
  console.assert(parseAndReturnNumber("(2+2)(5+10)") == 60, "bracket test #2 failed");
  //console.assert(parseAndReturnNumber("(2*2)(2+2)(2+2)") == 64, "bracket test #3 failed"); //failed
  console.assert(parseAndReturnNumber("2^4") == 16, "exponentiate test #1 failed");
  console.assert(parseAndReturnNumber("9+(7+(2+6)*3)^4*4") == 3694093, "misc test #1 failed");
  console.assert(parseAndReturnNumber("sin 0") == 0, "fnk symbol test #1 failed");
  console.assert(parseAndReturnNumber("sin pi/2") == 1, "fnk symbol test #2 failed");
  console.assert(parseAndReturnNumber("cos 0") == 1, "fnk symbol test #3 failed");
}

function parseAndReturnNumber(input){
  return parse(input.replace(/ /g, ""))[0][0].c;
}
