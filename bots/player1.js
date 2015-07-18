//This bot memorizes its opponent's previous moves and attempts to predict 
//its next target and avoid that piece of fruit
//Example by Nik Steel

var name = "evadeBot";


// Global memory
//the opponent's previous positions
var opponent_position_list = [];
   
//maximum number of positions to remember
var NUM_POSITION = 3;

//the player's current target
var my_nextfruit;
   
//the opponent's likely target
var opponent_nextfruit;
   
   
// start of a new game
function new_game() {
   init_opponent_position_list();
   my_nextfruit = null;
   opponent_nextfruit = null;
}

function make_move() {
   //remember the opponent's position
   update_opponent_position_list();

   //estimate the opponent's next fruit target
   choose_opponent_nextfruit();
   
   //choose my next fruit target
   if ((!exists(my_nextfruit)) || (getNumNeededToTie(FOR_ME,my_nextfruit) == HOPELESS)) {
      my_nextfruit = getMinFruit(function(fruit) {
         //ignore the the fruit that you think the opponent might be targeting
         if (fruit == opponent_nextfruit) {
            return POS_INFINITY;
         }
         //ignore fruit that is worthless
         var num_needed = getNumNeededToTie(FOR_ME,fruit);
         if (num_needed == HOPELESS) {
            return POS_INFINITY;
         }
         //otherwise, choose a nearby fruit of moderate significance
         return getDistance(FOR_ME,fruit) + (num_needed * 1.5);
         //the bot will go a little out of its way to get more valuable fruit, dependant on the multiplier 
      });
   }
   
   //take a step towards or pickup the fruit
   return moveTo(my_nextfruit);
}

//use the direction of the opponent's moves to assess potential direction
function choose_opponent_nextfruit() {
   // calculate the player's change in x and y, giving more precedence to later turns
   var move_vector = { x:0,y:0};
   for (var i = 0; i < opponent_position_list.length; ++i) {
      move_vector.x += (i+1) * opponent_position_list[i].x;
      move_vector.y += (i+1) * opponent_position_list[i].y;
   }
   
   // determine the window of coords on the game board that might be of interest
   var region = {start_x:0,start_y:0,end_x:(WIDTH-1),end_y:(HEIGHT-1)};
   if (move_vector.x > 0) {
      region.start_x = get_opponent_x();
   }
   if (move_vector.x < 0) {
      region.end_x = get_opponent_x();
   }
   if (move_vector.y > 0) {
      region.start_y = get_opponent_y();
   }
   if (move_vector.y < 0) {
      region.end_y = get_opponent_y();
   }
   
   // select the best fruit in the region
   var nexttemp = getMinFruit( function (fruit) {
      //if the fruit is in the region, choose the closest one
      if ((fruit.x >= region.start_x) && (fruit.x <= region.end_x)
         && (fruit.y >= region.start_y) && (fruit.y <= region.end_y)) {
         return getDistance(FOR_OPPONENT,fruit);
      }
      //otherwise, ignore the rest that are outside the region
      return POS_INFINITY;
   });
   
   // if no fruit could be found in the region, just get the nearest one
   if (!exists(nexttemp)) {
      nexttemp = getMinFruit( function (fruit) {
         return getDistance(FOR_OPPONENT,fruit);
      });
   }
   
   opponent_nextfruit = nexttemp;
}

// delete old memories from old games
function init_opponent_position_list() {
   //clear previous game's move memory
   while (opponent_position_list.length > 0) {
      opponent_position_list.shift();
   }
}

function update_opponent_position_list() {
   //forget excess oldest opponent position
   if (opponent_position_list.length > NUM_POSITION) {
      opponent_position_list.shift();
   }
   //remember the opponent's current position
   opponent_position_list.push({x:get_opponent_x(), y:get_opponent_y()});
}
