//name your fruitbot here:
var name = "mathomatic";

//ours

// globals
   //a list of the fruit on the board with {x, y, type} attributes
   var fruitlist = [];

   //the current target
   var nextfruit;
	
	//constant defines the default max for the best_fruit functions
   //it must be greater than any possible value for fruit.
   var INFINITY = 999998;
   
   //this is the factor of importance given to fruit value
   var VALUE_FACTOR = 1;
   
   //this is the offset to be given to fruit that cannot improve the score
   var WORTHLESS = INFINITY / 2;
   
   //these constants may be passed to functions to distinguish the player and opponent
   var FOR_ME = 1;
   var FOR_OPPONENT = 2;
	
	//weight factor
	var DIST_WEIGHT = 1;
	var VAL_WEIGHT = 3;
	

// start of a new game
function new_game() {
   init_fruitlist();
   nextfruit = null;
}

function make_move() {
   //update the fruitlist to reflect the current gameboard
   update_fruitlist();

	//if the targeted fruit does not exist, get a new target
   if (!exists(nextfruit)) {
		//prioritize fruit in the window
		var radius = WIDTH;
		var candidate;
		for (var i = 1; i <= get_number_of_item_types(); ++i) {
			radius = (get_number_of_item_types() + 1) - i;
			if (get_value(FOR_ME, {x:0,y:0,type:i}) != WORTHLESS) {
				
				//alert("hey");
				candidate = best_fruit_of_type_in_radius(FOR_ME, i, radius);
				//console.info(candidate);
				if (exists(candidate)) {
					nextfruit = candidate;
					return move_towards(nextfruit);
				}
			}
		}
		
      nextfruit = best_fruit(FOR_ME);
   }
   
   //take a step towards or pickup the fruit
   return move_towards(nextfruit);
}

//use the fruitlist to find the closest target
function best_fruit(purpose) {
   var priority;
   var minimum = {priority:INFINITY, fruit:null};
   
   fruitlist.forEach(function (fruit) {
      if (exists(fruit)) {
         priority = (get_distance(purpose,fruit) * DIST_WEIGHT) + (get_value(purpose,fruit) * VAL_WEIGHT);
         if (priority < minimum.priority) {
               minimum.priority = priority;
               minimum.fruit = fruit;
         }
      }
   });
   
   return minimum.fruit;
} 

//use the fruitlist to find the closest target
function best_fruit_of_type_in_radius(purpose, fruittype, radius) {
   var priority;
   var minimum = {priority:INFINITY, fruit:null};
   
   fruitlist.forEach(function (fruit) {
      if (exists(fruit)) {
			var distance = get_distance(purpose,fruit);
			if ((distance < radius) && (fruit.type == fruittype)) {
				
				//debug
				//console.log("We found this:");
				//console.info(fruit);
				
				priority = (distance * DIST_WEIGHT) + (get_value(purpose,fruit) * VAL_WEIGHT);
				if (priority < minimum.priority) {
						minimum.priority = priority;
						minimum.fruit = fruit;
				}
			}
      }
   });
   
   return minimum.fruit;
} 

//the distance between a player and a fruit
function get_distance(purpose,fruit) {
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

//the value of a piece of fruit
function get_value(purpose,fruit) {
   var critical_value = get_total_item_count(fruit.type) / 2;
   var value = 0;
   if (purpose == FOR_ME) {
      value = (critical_value - get_my_item_count(fruit.type)) * VALUE_FACTOR;
   }
   if (purpose == FOR_OPPONENT) {
      value = (critical_value - get_opponent_item_count(fruit.type)) * VALUE_FACTOR;
   }
   
   //ignore fruit for which the player already has more than half
   if (value < 0) {
      value = WORTHLESS;
   }
   
   //debug
   //alert("purpose is " + purpose + " and critical value of type " + fruit.type + " is " + critical_value + " and value is " + value);
   
   return value;
}

//use the fruitlist to find the closest target
function closest_fruit() {
   var me = {x:get_my_x(), y:get_my_y()};
   var distance;
   var minimum = {distance:999, fruit:null};
   
   fruitlist.forEach(function (fruit) {
      if (exists(fruit)) {
         distance = Math.abs(me.x - fruit.x) + Math.abs(me.y - fruit.y);
         if (distance < minimum.distance) {
               minimum.distance = distance;
               minimum.fruit = fruit;
         }
      }
   });
   
   return minimum.fruit;
}

function exists(fruit) {
   if (fruit == null)
      return false;
   return (fruit.type > 0);
}

//make a move towards the target or pick it up if arrived
function move_towards(fruit) {
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

// loop through board positions and make global fruitlist
function init_fruitlist() {
   //if fruitlist contains info, remove it.
   while (fruitlist.length > 0) {
      fruitlist.shift();
   }
   
   var board = get_board();
   for (var x = 0; x < board.length; ++x){
      for (var y = 0; y < board[0].length; ++y){
         // get value of cell being inspected
         var value = board[x][y];
         if (value > 0){ // cell holds a fruit
            fruitlist.push({x:x,y:y,type:value});
         }
      }
   }
   //uncomment to view the fruitlist in browser
   //console.info(fruitlist);
   
   //to traverse the list of fruit use this form:
   //fruitlist.forEach(function (fruit) {
   //   console.info(fruit.x, fruit.y, fruit.type);
   //});
}

// update the fruitlist to match the board 
// when fruit is removed from the board, it stays in the fruitlist but has type 0
function update_fruitlist() {
   var board = get_board();
   
   fruitlist.forEach(function (fruit) {
      fruit.type = board[fruit.x][fruit.y];
   });
}

// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
