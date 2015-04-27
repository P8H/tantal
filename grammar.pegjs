/*
 * Classic example grammar, which recognizes simple arithmetic expressions like
 * "2*(3+4)". The parser generated from this grammar then computes their value.
 */

//variablen *
//natur konstanten *
//trigonometrische fnk etc. *
//summen zeichen (fnk) *
//multiplikations zeichen (fnk)
//matrizen
//eigene funktionen
//sonder vars (_before, _value) *
//freitext
//komma um in einer Zeile zu bleiben, bei mehreren Gleichungen
//exponenten

{


  function searchAndExecuteAssignment(equations){
    for(var i = 0; i < equations.length; i++){
      if(typeof(equations[i].c) == 'undefined' && equations[i].d.length == 1){
        if(i == 0){ //currently only assignment on the first or last part supported
          variables[equations[i].d] = equations[i+1].c;
        }else if(i == equations.length - 1){
          variables[equations[i].d] = equations[i-1].c;
        }
      }
    }

  }

  function summation(over, from, to, sum){
    var safe_var = variables[over];
    var acc = 0;
    for(var i = from; i <= to; (from < to) ? i++:i--){
      //variables[over] = i; //deprecated
      debugger;
      var res = parse("i=" + i + ";" + sum);
      acc += res[1][0].c;

    }
    variables[over] = safe_var;
    return acc;
  }
}




start = line+

line  = eqs:equation+ ";"? { searchAndExecuteAssignment(eqs); return eqs; }

equation = left:additive "=" { variables._v = {d: left.c , c: left.c}; variables._b = {d: left.d , c: left.c}; return {d: left.d , c: left.c}; } / additive

additive
  = left:subtractive "+" right:additive { return { d: left.d  + "+" + right.d, c: left.c + right.c}; }
  / subtractive

subtractive
  = left:multiplicative "-" right:subtractive { return { d: left.d  + "-" + right.d, c: left.c - right.c}; }
  / multiplicative

multiplicative
  = left:division "*" right:multiplicative { return { d: left.d + "*" + right.d, c: left.c * right.c}; }
  / division

division
  = left:primary "/" right:division { return { d: left.d + "/" + right.d, c: left.c / right.c}; }
  / primary

primary
  = integer
  / "(" da:additive ")" { return {d: "(" + da.d + ")", c: da.c}; }

integer "integer"
  = vars
    / digits:[0-9]+ { return {d: digits.join(""), c: parseInt(digits.join(""), 10)}; }

vars
  = special_vars / char:[a-z]i { return {d: char, c: variables[char] };}

special_vars
  = const / char:("_"[a-z]) { return {d: variables["_" + char[1]].d, c: variables["_" + char[1]].c };}

const
  = fnk / "e" { return {d: "e", c: Math.E }; } / "pi" { return {d: "pi", c: Math.PI }; }

fnk
  =  big_fnk / sym:fnk_symbol pr:additive { return { d: sym.d + "(" + pr.d + ")", c: sym.f(pr.c) }; }

big_fnk = "sum" sum:additive "over" over:vars "from" from:additive "to" to:additive "."?{
  return { d: "sum_(" + over.d + "=" + from.d + ")^" + to.d + " " + sum.d + " ", c: summation(over.d, from.c, to.c, sum.d) };
}


//Resources
fnk_symbol = "sin" { return { d: "sin", f: Math.sin }; }
