//name your fruitbot here:
var name = "nikbot4";

// This bot considers the value of fruit in its calculation of
// which should be its next target.  That is, it selects the closest
// fruit that will improve its score.  If a fruit cannot improve its
// score, the bot ignores it.

// Superpowers are
// 1. Reflex
// 2. Memory
// 3. Reasoning

// globals
   //a list of the fruit on the board with {x, y, type} attributes
   var fruitlist = [];
   
   //the opponent's previous positions
   var opponent_position_list = [];
   
   //maximum number of positions to remember
   var NUM_POSITION = 3;

   //the player's current target
   var my_nextfruit;
   
   //the opponent's likely target
   var opponent_nextfruit;
   
   //constant defines the default max for the best_fruit functions
   //it must be greater than any possible value for fruit.
   var INFINITY = 999998;
   
   //this is the factor of importance given to fruit value
   var VALUE_FACTOR = 10;
   
   //this is the offset to be given to fruit that cannot improve the score
   var WORTHLESS = INFINITY / 2;
   
   //these constants may be passed to functions to distinguish the player and opponent
   var FOR_ME = 1;
   var FOR_OPPONENT = 2;
   
// start of a new game
function new_game() {
   init_fruitlist();
   init_opponent_position_list();
   my_nextfruit = null;
   opponent_nextfruit = null;
}

function make_move() {
   //update the fruitlist to reflect the current gameboard
   update_fruitlist();
   
   //remember the opponent's position
   update_opponent_position_list();

   //estimate the opponent's destination
   choose_opponent_nextfruit();
   
   //update target if necessary
   choose_my_nextfruit();
   
   //take a step towards or pickup the fruit
   return move_towards(my_nextfruit);
}

function update_opponent_position_list() {
   //forget excess oldest opponent position
   if (opponent_position_list.length > NUM_POSITION) {
      opponent_position_list.shift();
   }

   //remember the opponent's current position
   opponent_position_list.push({x:get_opponent_x(), y:get_opponent_y()});

   //debug
   //console.info(opponent_position_list);
   //console.log(opponent_position_list.length);
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
   
   // select the closest fruit in the range
   opponent_nextfruit = best_fruit_if_in_range(FOR_OPPONENT,region);
   if (opponent_nextfruit == null) {
      opponent_nextfruit = best_fruit(FOR_OPPONENT);
   }
}

//update target if necessary
function choose_my_nextfruit() {
   //if my targeted next fruit does not exist, get a new target
   if (!exists(my_nextfruit)) {
      my_nextfruit = best_fruit(FOR_ME);
   }
   
   //if targeting the same location and the opponent has same or lesser distance, evade
   if ((opponent_nextfruit == my_nextfruit) && (exists(opponent_nextfruit))) { 
      var my_distance = get_distance(FOR_ME,my_nextfruit);
      var opponent_distance = get_distance(FOR_OPPONENT,opponent_nextfruit);
      if (my_distance >= opponent_distance) {
         var taboolist = [];
         taboolist.push(opponent_nextfruit);
         my_nextfruit = best_fruit_if_not_in_list(FOR_ME,taboolist);
      }
   }
   
   //debug
   //console.info(opponent_nextfruit);
   //console.info(my_nextfruit);
   //console.log(opponent_nextfruit == my_nextfruit);
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
//but ignore fruit with coords in the range
function best_fruit_if_in_range(purpose, region) {
   var priority;
   var minimum = {priority:INFINITY, fruit:null};
   
   fruitlist.forEach(function (fruit) {
      if (exists(fruit)) {
         if ((fruit.x >= region.start_x) && (fruit.x <= region.end_x)
            && (fruit.y >= region.start_y) && (fruit.y <= region.end_y)) {
            priority = get_distance(purpose,fruit) + get_value(purpose,fruit);
            if (priority < minimum.priority) {
                  minimum.priority = priority;
                  minimum.fruit = fruit;
            }
         }
      }
   });
   
   return minimum.fruit;
}

function best_fruit_if_not_in_list(purpose, flist) {
   var priority;
   var minimum = {priority:INFINITY, fruit:null};
   
   fruitlist.forEach(function (fruit) {
      if (exists(fruit)) {
         var not_in_list = true;    
         flist.forEach(function (badfruit) {
            if (fruit == badfruit) { //is in the list
               not_in_list = false;
            }
         });
         if (not_in_list) {
            priority = get_distance(purpose,fruit) + get_value(purpose,fruit);
            if (priority < minimum.priority) {
                  minimum.priority = priority;
                  minimum.fruit = fruit;
            }
         }
      }
   });
   
   return minimum.fruit;
}

//use the fruitlist to find the closest target
function best_fruit(purpose) {
   var priority;
   var minimum = {priority:INFINITY, fruit:null};
   
   fruitlist.forEach(function (fruit) {
      if (exists(fruit)) {
         priority = get_distance(purpose,fruit) + get_value(purpose,fruit);
         if (priority < minimum.priority) {
               minimum.priority = priority;
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

// delete old memories from old games
function init_opponent_position_list() {
   //clear previous game's move memory
   while (opponent_position_list.length > 0) {
      opponent_position_list.shift();
   }
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
   //   code...
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

