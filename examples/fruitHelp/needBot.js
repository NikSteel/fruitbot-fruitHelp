//This bot uses the fruitHelp API to seek the nearest fruit of the most needed type
//Example by Nik Steel

var name = "needBot";

//Global memory
var nextfruit;

function new_game() {
   //clear the global memory at game start
   nextfruit = null;
}

function make_move() {
   //if the targeted fruit does not exist or will not affect the score, get a new target
   if ((!exists(nextfruit)) || (getNumNeededToTie(FOR_ME,nextfruit) == HOPELESS)) {
      nextfruit = getMinFruit(function(fruit) {
         var num_needed = getNumNeededToTie(FOR_ME,fruit);
         if (num_needed == HOPELESS) {
            return POS_INFINITY;
         }
         return getDistance(FOR_ME,fruit) + (num_needed*100);
      });
   }
   
   //take a step towards or pickup the fruit
   return moveTo(nextfruit);
}