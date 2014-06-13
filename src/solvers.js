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

//Easiest solution is a board with rooks on all diagonals
//This function does exactly that
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
// The number of "rooks" solutions is simply n! -- so our function simply returns n!
window.countNRooksSolutions = function(n) {

  var solutionCount = 1;
  for( var i = 2; i <= n; i++){
    solutionCount *= i;
  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

//Create an object to store all helper functions
window.nQueensHelpers = {};

//Checks whether a given solution for n queens is valid
//Specifically, checks the diagonals for conflicts
//(the way the solution is stored implicitly avoids row/col conflicts)
window.nQueensHelpers.isSafe = function(simpleSolution){
  var reservedMajor = {};
  var reservedMinor = {};
  var n = simpleSolution.length;

  for(var row = 0; row < n; row++){
    //Get the indices of each of the two diagonals
    //from the row and col
    var diffMajor = row - simpleSolution[row];
    var diffMinor = n - 1 - row - simpleSolution[row];

    //Stores each diagonal index in the corresponding "reserved"
    //object. If diagonal is "taken" by more than one queen,
    //there is a conflict
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

  //If no conflicts found, return true
  return true;
};

//Calls an iterator on each permutation of the given list
//Not specific to nQueens necessarily (could be used for other applications)
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
  //Finds the solution using a one-dimensional array representation
  var simpleSolution;
  window.nQueensHelpers.eachPermutation(_.range(n),function(permutation){
    if( window.nQueensHelpers.isSafe(permutation) ){
      simpleSolution = permutation;
    }
  });

  //Converts the "simple" array representation into
  //a matrix representation
  var solution = [];
  for(var row = 0; row < n; row++){
    solution.push([]);
    for(var col = 0; col < n; col++){
      //If no solution found, place no queens
      if (simpleSolution === undefined) {
        solution[row][col] = 0;
      //Otherwise place queens according to the solution
      } else if ( simpleSolution[row] === col ){
        solution[row][col] = 1;
      //Non-queen squares represented by 0
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

  //Loop through all possible permutations, count all solutions
  //that did not violate the rules of N Queens
  window.nQueensHelpers.eachPermutation(_.range(n),function(permutation){
    if( window.nQueensHelpers.isSafe(permutation) ){
      solutionCount++;
    }
  });

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

//Counts the number of N Queens solutions
//Prunes invalid possibilities as soon as they are
//identified
window.countNQueensSolutionsPruning = function(n){
  var count = 0;

  //Branches through all possible permutations, but
  //immediately "prunes" branches with invalid solutions
  var innerPerm = function(soFar, remaining, diag1, diag2){
    //If we reach the end of the "remaining" array,
    //the current permutation violated no rules,
    //and is a solution
    if( remaining.length === 0 ) {
      count++;

      //Removes unnecessary items from object
      //so that next "branch" of tree has the correct
      //starting point
      var lastPushed = soFar[soFar.length -1];
      var diffMajor = soFar.length - 1 - lastPushed;
      var diffMinor = n - 1 - lastPushed - (soFar.length - 1);
      delete diag1[diffMajor];
      delete diag2[diffMinor];

    } else {

      //Creates permutations recursively (very similiar to eachPermutation, above)
      for(var i = 0; i < remaining.length; i++){
        //Creates a copy of the "remaining" list
        var newRemaining = remaining.slice();

        //Pops out the ith value
        var toPush = newRemaining.splice(i,1)[0];

        //calculates diagonal indices
        var diffMajor = soFar.length - toPush;
        var diffMinor = n - 1 - toPush - soFar.length;

        //If diagonal indices show no conflicts, continue with this branch
        if( !(diffMajor in diag1 || diffMinor in diag2) ) {
          diag1[diffMajor] = true;
          diag2[diffMinor] = true;
          var newSoFar = soFar.slice();
          newSoFar.push(toPush);
          innerPerm(newSoFar, newRemaining, diag1, diag2);
        }
      }

      //After completing all branches at a particular level,
      //fix object so that next section of the tree "starts"
      //with the correct information
      var lastPushed = soFar[soFar.length -1];
      var diffMajor = soFar.length - 1 - lastPushed;
      var diffMinor = n - 1 - lastPushed - (soFar.length - 1);
      delete diag1[diffMajor];
      delete diag2[diffMinor];
    }
  };

  //Calls the recursive loop
  innerPerm([], _.range(n), {}, {});

  //Returns total # of valid solutions
  return count;

};
