//The fruitHelp API gives players a list of fruit objects with the structure
//    fruit = {x,y,type}
//and functions for operating with the fruit objects

var fruitHelp = {
   //a list of positions where fruit has existed on the board
   //When fruit is taken, it remains in the list but with type == 0
   fruitlist: [],
   
   // to be called before the player's new game functions
   init: function() {
      //if fruitlist contains info, remove it.
      while (this.fruitlist.length > 0) {
         this.fruitlist.shift();
      }
      
      // loop through board positions and make global fruitlist
      var board = get_board();
      for (var x = 0; x < board.length; ++x){
         for (var y = 0; y < board[0].length; ++y){
            // get value of cell being inspected
            var value = board[x][y];
            if (value > 0){ // cell holds a fruit
               this.fruitlist.push({x:x,y:y,type:value});
            }
         }
      }
      //debug
      //console.info(this.fruitlist);
   },
       
   // to be called before the player's makeMove functions
   update: function() {
      var board = get_board();
      
      // update the fruitlist to match the board 
      this.fruitlist.forEach(function (fruit) {
         fruit.type = board[fruit.x][fruit.y];
      });
   }
};

//API functions and constants
//Don't assume the values of these constants
var FOR_ME = 1;
var FOR_OPPONENT = 2;

//value returned by getNumNeeded if impossible to get a point
var HOPELESS = -1;

//you may force getMinFruit to ignore a fruit by returning this constant from your calculate function
var POS_INFINITY = 999998;
//you may force getMaxFruit to ignore a fruit by returning this constant from your calculate function
var NEG_INFINITY = POS_INFINITY * (-1);

function moveTo(fruit) {
   if (fruit == null) {
      return PASS;
   }
   
   var me = {x:get_my_x(), y:get_my_y()};
   var action;

   if (fruit.x > me.x){
      action = EAST;
   }
   if (fruit.x < me.x){
      action = WEST;
   }
   if (fruit.y > me.y){
      action = SOUTH;
   }
   if (fruit.y < me.y){
      action = NORTH;
   }
   if ((fruit.x == me.x) && (fruit.y == me.y)){
      action = TAKE;
   }
   
   return action;
}

// performs a passed in function on each fruit that is available to be taken
function forEachFruit(in_func) {
   fruitHelp.fruitlist.forEach( function(fruit) {
      if (exists(fruit)) {
         in_func(fruit);
      }
   });
}

// tells the player if the fruit object exists
function exists(fruit) {
   if (fruit == null)
      return false;
   return (fruit.type > 0);
}

//the distance between a player and a fruit, lower is better
//POS_INFINITY if does not exist
function getDistance(purpose,fruit) {
   if (!exists(fruit)) {
      return POS_INFINITY;
   }
   
   var position = {x:0,y:0};
   if (purpose == FOR_ME) {
      position.x = get_my_x();
      position.y = get_my_y();
   }
   if (purpose == FOR_OPPONENT) {
      position.x = get_opponent_x();
      position.y = get_opponent_y();
   }
   
   return Math.abs(position.x - fruit.x) + Math.abs(position.y - fruit.y);
}

//the number of fruit needed of the fruit's type for the player to get a point for that type, lower is better
//HOPELESS if does not exist or if the opponent already has the point or if all of the type are gone
function getNumNeededToTie(purpose,fruit) {
   if (!exists(fruit)) {
      return HOPELESS;
   }
   
   //the number of fruit of a particular fruit type for which the players tie
   var critical_value = (get_total_item_count(fruit.type) / 2);
   
   //the number of fruit remaining for the current player to get a point for the type
   var my_value = (critical_value - get_my_item_count(fruit.type));
   //the number of fruit remaining for the opponent to get a point for the type
   var opp_value = (critical_value - get_opponent_item_count(fruit.type));
   
   //debug
   //alert("f type " + fruit.type + ", c val " + critical_value + ", tot count " + get_total_item_count(fruit.type) + ", my count " + get_my_item_count(fruit.type) + ", opp count " + get_opponent_item_count(fruit.type) + ", my val " + my_value + ", opp val " + opp_value + ", hopeless is " + HOPELESS + ", POS_INFINITY is " + POS_INFINITY + ", NEG_INFINITY is " + NEG_INFINITY); 
   
   //if either player is eligible to get a point or tie
   if ((my_value >= 0) && (opp_value >= 0)) {
      if (purpose == FOR_ME) {
         return my_value;
      }
   
      if (purpose == FOR_OPPONENT) {
         return opp_value;
      }
   }
   
   //otherwise, no one is eligible to get a point for that fruit category
   return HOPELESS;
}

//for each available fruit, calculate a value using the supplied function and return the minimum fruit
function getMinFruit(priority_val_calc) {
   var minimum = {priority:POS_INFINITY, fruit:null};
   
   fruitHelp.fruitlist.forEach(function (fruit) {
      if (exists(fruit)) {
         var priority = priority_val_calc(fruit);
         if (priority < minimum.priority) {
               minimum.priority = priority;
               minimum.fruit = fruit;
         }
      }
   });
   
   return minimum.fruit;
} 

//for each available fruit, calculate a value using the supplied function and return the maximum fruit
function getMaxFruit(priority_val_calc) {
   var maximum = {priority:NEG_INFINITY, fruit:null};
   
   fruitHelp.fruitlist.forEach(function (fruit) {
      if (exists(fruit)) {
         var priority = priority_val_calc(fruit);
         if (priority > maximum.priority) {
               maximum.priority = priority;
               maximum.fruit = fruit;
         }
      }
   });
   
   return maximum.fruit;
} 