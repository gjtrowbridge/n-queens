/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var solution = [];

  for(var row = 0; row < n; row++){
    solution.push([]);
    for( var col = 0; col < n; col++){
      if( row === col ){
        solution[row].push(1);
      } else {
        solution[row].push(0);
      }
    }
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {

  var solutionCount = 1;
  for( var i = 2; i <= n; i++){
    solutionCount *= i;
  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

window.nQueensHelpers = {};
window.nQueensHelpers.isSafe = function(simpleSolution){
  var reservedMajor = {};
  var reservedMinor = {};
  var n = simpleSolution.length;
  for(i = 0; i < n; i++){
    var diffMajor = i - simpleSolution[i];
    var diffMinor = n - 1 - i - simpleSolution[i];
    if( diffMajor in reservedMajor ){
      return false;
    } else {
      reservedMajor[diffMajor] = true;
    }
    if( diffMinor in reservedMinor ){
      return false;
    } else {
      reservedMinor[diffMinor] = true;
    }
  }
  return true;
};

window.nQueensPruneCount = function(n){
  var count = 0;
  var innerPerm = function(soFar, remaining, diag1, diag2){
    if( remaining.length === 0 ) {
      //this is a solution
      count++;

      var lastPushed = soFar[soFar.length -1];
      var diffMajor = soFar.length - 1 - lastPushed;
      var diffMinor = n - 1 - lastPushed - (soFar.length - 1);
      delete diag1[diffMajor];
      delete diag2[diffMinor];

    } else {
      //check if should be pruned
        // add new number to the diags arrays
      for(var i = 0; i < remaining.length; i++){
        var newRemaining = remaining.slice();
        //newSoFar["diags"] = soFar.diags;
        var toPush = newRemaining.splice(i,1)[0];

        var diffMajor = soFar.length - toPush; //diag code1
        var diffMinor = n - 1 - toPush - soFar.length; //diag code2
        if( diffMajor in diag1 || diffMinor in diag2 ) {
          // console.log("prune");
          // console.log("sofar: " + soFar.join(", "));
          // console.log("toPush: " + toPush);
          // console.log("diag1: " + Object.keys(diag1).join(", "));
          // console.log("diag2: " + Object.keys(diag2).join(", "));
          // console.log("---");
        } else {
          diag1[diffMajor] = true; //this may cause a problem
          diag2[diffMinor] = true;
          var newSoFar = soFar.slice();
          newSoFar.push(toPush);
          innerPerm(newSoFar, newRemaining, diag1, diag2);
        }
      }
      var lastPushed = soFar[soFar.length -1];
      var diffMajor = soFar.length - 1 - lastPushed;
      var diffMinor = n - 1 - lastPushed - (soFar.length - 1);
      delete diag1[diffMajor];
      delete diag2[diffMinor];
    }
  };

  innerPerm([], _.range(n), {}, {});
  return count;

};

window.nQueensHelpers.eachPermutation = function(list, iterator){

  var innerPerm = function(soFar, remaining){
    if( remaining.length === 0 ) {
      iterator(soFar);
    } else {
      for(var i = 0; i < remaining.length; i++){
        var newRemaining = remaining.slice();
        var newSoFar = soFar.slice();
        var toPush = newRemaining.splice(i,1)[0];
        newSoFar.push(toPush);
        innerPerm(newSoFar, newRemaining);
      }
    }
  };

  innerPerm([],list);

};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var simpleSolution;
  window.nQueensHelpers.eachPermutation(_.range(n),function(permutation){
    if( window.nQueensHelpers.isSafe(permutation) ){
      simpleSolution = permutation;
    }
  });

  var solution = [];
  for(var row = 0; row < n; row++){
    solution.push([]);
    for(var col = 0; col < n; col++){
      if (simpleSolution === undefined) {
        solution[row][col] = 0;
      } else if ( simpleSolution[row] === col ){
        solution[row][col] = 1;
      } else {
        solution[row][col] = 0;
      }
    }
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
  window.countNQueensSolutions = function(n) {

    var solutionCount = 0;

    window.nQueensHelpers.eachPermutation(_.range(n),function(permutation){
      if( window.nQueensHelpers.isSafe(permutation) ){
        solutionCount++;
      }
    });

    console.log('Number of solutions for ' + n + ' queens:', solutionCount);
    return solutionCount;
  };
