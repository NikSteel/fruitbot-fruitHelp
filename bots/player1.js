// globals

//a list of the fruit on the board with {x, y, type} attributes
var fruitlist = []

//the current target
var target;

// distance to nearest fruit
var nearest = 999;
var nearX = -1;
var nearY = -1;

// start of a new game
function new_game() {
   init_fruitlist();
}

function make_move() {
   //update the fruitlist to reflect the current gameboard
   update_fruitlist();
   
   
   var board = get_board();

   // we found an item! take it!
   if (board[get_my_x()][get_my_y()] > 0) {
       return TAKE;
   }

   // player position
   var myX = get_my_x();
   var myY = get_my_y();

   // if we have reached our goal, reset 
   if (nearX == myX && nearY == myY){
      nearX = -1;
      nearY = -1;
   }

   // if we don't have a target - find the nearest fruit
   if (nearX < 0){
      nearest = 999;

      // loop through board positions
      for (var x = 0; x < board.length; x++){
         for (var y = 0; y < board[0].length; y++){

            // get value of cell being inspected
            var value = board[x][y];



            if (value > 0){ // cell holds a fruit

               distance = Math.abs(myX - x) + Math.abs(myY - y);

               // if it's closest, make it the target
               if (distance < nearest){
                  nearX = x;
                  nearY = y;

                  nearest = distance;
               }
            }
         }
      }
   }

   var direction;

   if (nearX > myX){
      direction = EAST;
   }
   if (nearX < myX){
      direction = WEST;
   }
   if (nearY > myY){
      direction = SOUTH;
   }
   if (nearY < myY){
      direction = NORTH;
   }

   // debug code
   // console.log ("At " + myX + "," + myY + " - Nearest = " + nearX + "," + nearY + " - direction = " + direction);
   return direction;
}

//use the fruitlist to find the closest target
function closestTarget() {
   var me = {x:get_my_x(), y:get_my_Y()};
   var distance;
   var minimum = {distance:999, fruit:null};
   
   fruitlist.forEach(function (fruit) {
      distance = Math.abs(me.x - fruit.x) + Math.abs(me.y - fruit.y);
      
   });
}

// loop through board positions and make global fruitlist
function init_fruitlist() {
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
