
//console.assert(parse("sumi*i+2overifrom0to4")[0][0].c == 40);
//load file grammar.pegjs
var parser;
window.variables = {}; //var holder for parser
$(function() {

  $.get("grammar.pegjs", function(data) {
    parser = PEG.buildParser(data);
    window.parse = parser.parse;
    refreshCanvas();
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
