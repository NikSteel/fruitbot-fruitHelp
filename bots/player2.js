//This bot uses the fruitHelp API to seek the nearest fruit
//Example by Nik Steel

var name = "nearBot";

//Global memory
var nextfruit;

function new_game() {
   nextfruit = null;
}

function make_move() {
   //if the targeted fruit does not exist or will not affect the score, get a new target
   if ((!exists(nextfruit)) || (getNumNeededToTie(FOR_ME,nextfruit) == HOPELESS)) {
      nextfruit = getMinFruit(function(fruit) {
         return getDistance(FOR_ME,fruit);
      });
   }
   
   //take a step towards or pickup the fruit
   return moveTo(nextfruit);
}