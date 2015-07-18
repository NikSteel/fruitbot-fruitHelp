//this bot does nothing

var name = "p2";

function new_game() {
}

function make_move() {
   alert("my name is " + name + "my fruit counts are type1: " + get_my_item_count(1) + ", type 2: " + get_my_item_count(2) + ", type 3: " + get_my_item_count(3) + ", type 4: " + get_my_item_count(4) + ". My opponent's fruit counts are type1: " + get_opponent_item_count(1) + ", type 2: " + get_opponent_item_count(2) + ", type 3: " + get_opponent_item_count(3) + ", type 4: " + get_opponent_item_count(4)); 

   var board = get_board();

   // we found an item! take it!
   if (board[get_my_x()][get_my_y()] > 0) {
       return TAKE;
   }

   var rand = Math.random() * 4;

   if (rand < 1) return NORTH;
   if (rand < 2) return SOUTH;
   if (rand < 3) return EAST;
   if (rand < 4) return WEST;

   return PASS;
}
