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
   //alert("hopeless is " + HOPELESS + ", POS_INFINITY is " + POS_INFINITY + ", NEG_INFINITY is " + NEG_INFINITY);
   
   //if the targeted fruit does not exist or will not affect the score, get a new target
   if ((!exists(nextfruit)) || (getNumNeededToTie(FOR_ME,nextfruit) == HOPELESS)) {
      alert("new target");
      nextfruit = getMinFruit(function(fruit) {
         var num_needed = getNumNeededToTie(FOR_ME,fruit);
         if (num_needed == HOPELESS) {
            alert("avoiding f type " + fruit.type);
            return POS_INFINITY;
         }
         return getDistance(FOR_ME,fruit) + (num_needed*100);
      });
      alert("targeting x: " + nextfruit.x + ", y: " + nextfruit.y + ", type: " + nextfruit.type + ". getNumNeededToTie = " + getNumNeededToTie(FOR_ME,nextfruit) + " and getDistance() = " + getDistance(FOR_ME,nextfruit));
   }
   

   
   //take a step towards or pickup the fruit
   return moveTo(nextfruit);
}