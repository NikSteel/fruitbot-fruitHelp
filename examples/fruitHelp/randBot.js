// This bot chooses a random piece of fruit to target and take

var name = "randBot";

//Global memory
var nextfruit;

function new_game() {
   //clear the global memory at game start
   nextfruit = null;
}

function make_move() {
   //if the targeted fruit does not exist, get a new target
   if (!exists(nextfruit)) {
      nextfruit = getMinFruit(function(fruit) {
         return Math.random() * 1000;
      });
   }
   
   //take a step towards or pickup the fruit
   return moveTo(nextfruit);
}