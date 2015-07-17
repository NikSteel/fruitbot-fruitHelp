var nearBot = function() {

//name your fruitbot here:
var name = "nikbot2";

// This bot detects the nearest piece of fruit,
// decides to go get it, and moves towards its
// destination until it arrives and gets it or 
// the fruit disappears. (it remembers its choice).

// It's superpowers are
// 1. Reflex
// 2. Memory

// globals
   //a list of the fruit on the board with {x, y, type} attributes
   var fruitlist = [];

   //the current target
   var nextfruit;

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
      nextfruit = closest_fruit();
   }
   
   //take a step towards or pickup the fruit
   return move_towards(nextfruit);
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

}
