// This bot detects the nearest piece of fruit,
// decides to go get it, and moves towards its
// destination until it arrives and gets it or 
// the fruit disappears. (it remembers its choice).

// It's superpowers are
// 1. Reflex
// 2. Memory

var nearBot = {
   name: "nearBot",

   //a list of the fruit on the board with {x, y, type} attributes
   fruitlist: [],

   //the current target
   nextfruit: null,

   // start of a new game
   new_game: function() {
      nearBot.init_fruitlist();
      nearBot.nextfruit = null;
   },

   makeMove: function() {
      //update the fruitlist to reflect the current gameboard
      nearBot.update_fruitlist();
      
      //if the targeted fruit does not exist, get a new target
      if (!nearBot.exists(nearBot.nextfruit)) {
         nearBot.nextfruit = nearBot.closest_fruit();
      }
      
      //take a step towards or pickup the fruit
      return nearBot.move_towards(nearBot.nextfruit);
   },

   //use the fruitlist to find the closest target
   closest_fruit: function() {
      var me = {x:get_my_x(), y:get_my_y()};
      var distance;
      var minimum = {distance:999, fruit:null};
      
      nearBot.fruitlist.forEach(function (fruit) {
         if (nearBot.exists(fruit)) {
            distance = Math.abs(me.x - fruit.x) + Math.abs(me.y - fruit.y);
            if (distance < minimum.distance) {
                  minimum.distance = distance;
                  minimum.fruit = fruit;
            }
         }
      });
      
      return minimum.fruit;
   },

   exists: function(fruit) {
      if (fruit == null)
         return false;
      return (fruit.type > 0);
   },

   //make a move towards the target or pick it up if arrived
   move_towards: function(fruit) {
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
   },

   // loop through board positions and make global fruitlist
   init_fruitlist: function() {
      //if fruitlist contains info, remove it.
      while (nearBot.fruitlist.length > 0) {
         nearBot.fruitlist.shift();
      }
      
      var board = get_board();
      for (var x = 0; x < board.length; ++x){
         for (var y = 0; y < board[0].length; ++y){
            // get value of cell being inspected
            var value = board[x][y];
            if (value > 0){ // cell holds a fruit
               nearBot.fruitlist.push({x:x,y:y,type:value});
            }
         }
      }
      //uncomment to view the fruitlist in browser
      //console.info(nearBot.fruitlist);
      
      //to traverse the list of fruit use this form:
      //nearBot.fruitlist.forEach(function (fruit) {
      //   console.info(fruit.x, fruit.y, fruit.type);
      //});
   },

   // update the fruitlist to match the board 
   // when fruit is removed from the board, it stays in the fruitlist but has type 0
   update_fruitlist: function() {
      var board = get_board();
      
      nearBot.fruitlist.forEach(function (fruit) {
         fruit.type = board[fruit.x][fruit.y];
      });
   }
};