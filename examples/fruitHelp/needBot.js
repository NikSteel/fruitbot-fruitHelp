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
   //if the targeted fruit does not exist, get a new target
   if (!exists(nextfruit)) {
      nextfruit = getMinFruit(function(fruit) {
         var num_needed = getNumNeeded(FOR_ME,fruit);
         if (num_needed == HOPELESS) {
            return POS_INFINITY;
         }
         return getDistance(FOR_ME,fruit) + (num_needed*100);
      });
   }
   
   //take a step towards or pickup the fruit
   return moveTo(nextfruit);
}