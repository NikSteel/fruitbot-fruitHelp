// This bot remembers its opponents last N moves
// and estimates the most likely target fruit.
// If the player can arrive there sooner, it will
// race the opponent.  If not, it will avoid that 
// piece of fruit and target a different one. This is
// using memory for a real competitive advantage.

// Superpowers are
// 1. Reflex
// 2. Memory

var evadeBot = {
   name: "evadeBot",

   //a list of the fruit on the board with {x, y, type} attributes
   fruitlist: [],
   
   //the opponent's previous positions
   opponent_position_list: [],
   
   //maximum number of positions to remember
   NUM_POSITION: 3,

   //the player's current target
   my_nextfruit: null,
   
   //the opponent's likely target
   opponent_nextfruit: null,
      
      
   // start of a new game
   new_game: function() {
      evadeBot.init_fruitlist();
      evadeBot.init_opponent_position_list();
      evadeBot.my_nextfruit = null;
      evadeBot.opponent_nextfruit = null;
   },

   make_move: function() {
      //update the fruitlist to reflect the current gameboard
      evadeBot.update_fruitlist();
      
      //remember the opponent's position
      evadeBot.update_opponent_position_list();

      //estimate the opponent's destination
      evadeBot.choose_opponent_nextfruit();
      
      //update target if necessary
      evadeBot.choose_my_nextfruit();
      
      //take a step towards or pickup the fruit
      return evadeBot.move_towards(evadeBot.my_nextfruit);
   },

   get_distance: function(player,fruit) {
      return Math.abs(player.x - fruit.x) + Math.abs(player.y - fruit.y);
   },

   update_opponent_position_list: function() {
      //forget excess oldest opponent position
      if (evadeBot.opponent_position_list.length > evadeBot.NUM_POSITION) {
         evadeBot.opponent_position_list.shift();
      }

      //remember the opponent's current position
      evadeBot.opponent_position_list.push({x:get_opponent_x(), y:get_opponent_y()});

      //debug
      //console.info(evadeBot.opponent_position_list);
      //console.log(evadeBot.opponent_position_list.length);
   },

   //use the direction of the opponent's moves to assess potential direction
   choose_opponent_nextfruit: function() {
      // calculate the player's change in x and y, giving more precedence to later turns
      var move_vector = { x:0,y:0};
      for (var i = 0; i < evadeBot.opponent_position_list.length; ++i) {
         move_vector.x += (i+1) * evadeBot.opponent_position_list[i].x;
         move_vector.y += (i+1) * evadeBot.opponent_position_list[i].y;
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
      evadeBot.opponent_nextfruit = closest_fruit_if_in_range({x:get_opponent_x(),y:get_opponent_y()},region);
      if (evadeBot.opponent_nextfruit == null) {
         evadeBot.opponent_nextfruit = closest_fruit({x:get_opponent_x(),y:get_opponent_y()});
      }
   },

   //update target if necessary
   choose_my_nextfruit: function() {
      //if my targeted next fruit does not exist, get a new target
      if (!evadeBot.exists(evadeBot.my_nextfruit)) {
         evadeBot.my_nextfruit = closest_fruit({x:get_my_x(), y:get_my_y()});
      }
      
      //if targeting the same location and the opponent has same or lesser distance, evade
      if ((evadeBot.opponent_nextfruit == evadeBot.my_nextfruit) && (exists(evadeBot.opponent_nextfruit))) { 
         var my_distance = evadeBot.get_distance({x:get_my_x(),y:get_my_y()},evadeBot.my_nextfruit);
         var opponent_distance = evadeBot.get_distance({x:get_opponent_x(),y:get_opponent_y()},evadeBot.opponent_nextfruit);
         if (my_distance >= opponent_distance) {
            var taboolist = [];
            taboolist.push(evadeBot.opponent_nextfruit);
            evadeBot.my_nextfruit = closest_fruit_if_not_in_list({x:get_my_x(),y:get_my_y()},taboolist);
         }
      }
      
      //debug
      //console.info(evadeBot.opponent_nextfruit);
      //console.info(evadeBot.my_nextfruit);
      //console.log(evadeBot.opponent_nextfruit == evadeBot.my_nextfruit);
   },

   //use the fruitlist to find the closest target
   //but ignore fruit with coords in the range
   closest_fruit_if_in_range: function(player, region) {
      var distance;
      var minimum = {distance:999, fruit:null};
      
      evadeBot.fruitlist.forEach(function (fruit) {
         if (exists(fruit)) {
            if ((fruit.x >= region.start_x) && (fruit.x <= region.end_x)
               && (fruit.y >= region.start_y) && (fruit.y <= region.end_y)) {
               distance = evadeBot.get_distance(player,fruit);
               if (distance < minimum.distance) {
                     minimum.distance = distance;
                     minimum.fruit = fruit;
               }
            }
         }
      });
      
      return minimum.fruit;
   },

   closest_fruit_if_not_in_list: function(player, flist) {
      var distance;
      var minimum = {distance:999, fruit:null};
      
      evadeBot.fruitlist.forEach(function (fruit) {
         if (evadeBot.exists(fruit)) {
            var not_in_list = true;    
            flist.forEach(function (badfruit) {
               if (fruit == badfruit) { //is in the list
                  not_in_list = false;
               }
            });
            if (not_in_list) {
               distance = evadeBot.get_distance(player,fruit);
               if (distance < minimum.distance) {
                     minimum.distance = distance;
                     minimum.fruit = fruit;
               }
            }
         }
      });
      
      return minimum.fruit;
   },

   //use the fruitlist to find the closest target
   closest_fruit: function(player) {
      var distance;
      var minimum = {distance:999, fruit:null};
      
      evadeBot.fruitlist.forEach(function (fruit) {
         if (exists(fruit)) {
            distance = evadeBot.get_distance(player,fruit);
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

   // delete old memories from old games
   init_opponent_position_list: function() {
      //clear previous game's move memory
      while (evadeBot.opponent_position_list.length > 0) {
         evadeBot.opponent_position_list.shift();
      }
   },

   // loop through board positions and make global fruitlist
   init_fruitlist: function() {
      //if fruitlist contains info, remove it.
      while (evadeBot.fruitlist.length > 0) {
         evadeBot.fruitlist.shift();
      }
      
      var board = get_board();
      for (var x = 0; x < board.length; ++x){
         for (var y = 0; y < board[0].length; ++y){
            // get value of cell being inspected
            var value = board[x][y];
            if (value > 0){ // cell holds a fruit
               evadeBot.fruitlist.push({x:x,y:y,type:value});
            }
         }
      }
      //uncomment to view the fruitlist in browser
      //console.info(evadeBot.fruitlist);
      
      //to traverse the list of fruit use this form:
      //evadeBot.fruitlist.forEach(function (fruit) {
      //   code...
      //});
   },

   // update the fruitlist to match the board 
   // when fruit is removed from the board, it stays in the fruitlist but has type 0
   update_fruitlist: function() {
      var board = get_board();
      
      evadeBot.fruitlist.forEach(function (fruit) {
         fruit.type = board[fruit.x][fruit.y];
      });
   }
};

