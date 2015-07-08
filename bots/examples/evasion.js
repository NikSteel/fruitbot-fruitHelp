// This bot remembers its opponents last N moves
// and estimates the most likely target fruit.
// If the player can arrive there sooner, it will
// race the opponent.  If not, it will avoid that 
// piece of fruit and target a different one. This is
// using memory for a real competitive advantage.

// Superpowers are
// 1. Reflex
// 2. Memory

// globals
   //a list of the fruit on the board with {x, y, type} attributes
   var fruitlist = [];

   //the player's current target
   var my_nextfruit;
   
   //the opponent's previous positions
   var opponent_position_memory = [];
   
   //maximum number of positions to remember
   var MOVE_MEMORY = 3;
   
// start of a new game
function new_game() {
   init_fruitlist();
   init_opponent_position_memory();
}

function make_move() {
   //update the fruitlist to reflect the current gameboard
   update_fruitlist();
   
   //remember the opponent's position
   observe_opponent();

   //estimate the opponent's destination
   var opponent_nextfruit = estimate_opponent_destination();
   
   //if the targeted fruit does not exist, get a new target
   if (!exists(my_nextfruit)) {
      my_nextfruit = closest_fruit({x:get_my_x(), y:get_my_y()}, fruitlist);
   }
   
   //take a step towards or pickup the fruit
   return move_towards(my_nextfruit);
}

function observe_opponent() {
   //forget excess oldest opponent position
   if (opponent_position_memory.length > MOVE_MEMORY) {
      opponent_position_memory.shift();
   }

   //remember the opponent's current position
   opponent_position_memory.push({x:get_opponent_x(), y:get_opponent_y()});

   //debug
   //console.info(opponent_position_memory);
   //console.log(opponent_position_memory.length);
}

//use the direction of the opponent's moves to assess potential direction
function estimate_opponent_destination() {
   // calculate the player's change in x and y, giving more precedence to later turns
   var move_vector = { x:0,y:0};
   for (var i = 0; i < opponent_position_memory.length; ++i) {
      move_vector.x += (i+1) * opponent_position_memory[i].x;
      move_vector.y += (i+1) * opponent_position_memory[i].y;
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
   
   // make a list of the fruit in that region
   var flist = find_fruit_in(region);
   if (flist == null) {
      flist = fruitlist;
   }
   
   //return the nearest fruit in the region
   return closest_fruit({x:get_opponent_x(), y:get_opponent_y()}, flist);
}

function find_fruit_in(region) {
   var board = get_board();
   var flist = [];
   
   for (var x = region.start_x; ((x < board.length) && (x < region.end_x)); ++x){
      for (var y = region.start_y; ((y < board[0].length) && (y < region.end_y)); ++y){
         // get value of cell being inspected
         var value = board[x][y];
         if (value > 0){ // cell holds a fruit
            flist.push({x:x,y:y,type:value});
         }
      }
   }
   if (flist.length == 0) {
      return null;
   }
   
   return flist;
}

//use the fruitlist to find the closest target
//takes in a pair of x and y coordinates and a fruitlist
//returns a fruit
function closest_fruit(position, flist) {
   var distance;
   var minimum = {distance:999, fruit:null};
   
   flist.forEach(function (fruit) {
      if (exists(fruit)) {
         distance = Math.abs(position.x - fruit.x) + Math.abs(position.y - fruit.y);
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
function init_opponent_position_memory() {
   //clear previous game's move memory
   while (opponent_position_memory.length > 0) {
      opponent_position_memory.shift();
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
