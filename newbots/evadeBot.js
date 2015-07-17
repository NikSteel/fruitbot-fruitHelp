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
      botHelp.init_fruitlist();
      evadeBot.init_opponent_position_list();
      this.my_nextfruit = null;
      this.opponent_nextfruit = null;
   },

   makeMove: function() {
      //update the fruitlist to reflect the current gameboard
      botHelp.update_fruitlist();
      
      //remember the opponent's position
      evadeBot.update_opponent_position_list();

      //estimate the opponent's destination
      evadeBot.choose_opponent_nextfruit();
      
      //update target if necessary
      evadeBot.choose_my_nextfruit();
      
      //take a step towards or pickup the fruit
      return botHelp.move_towards(this.my_nextfruit);
   },

   update_opponent_position_list: function() {
      //forget excess oldest opponent position
      if (this.opponent_position_list.length > this.NUM_POSITION) {
         this.opponent_position_list.shift();
      }

      //remember the opponent's current position
      this.opponent_position_list.push({x:get_opponent_x(), y:get_opponent_y()});

      //debug
      //console.info(this.opponent_position_list);
      //console.log(this.opponent_position_list.length);
   },

   //use the direction of the opponent's moves to assess potential direction
   choose_opponent_nextfruit: function() {
      // calculate the player's change in x and y, giving more precedence to later turns
      var move_vector = { x:0,y:0};
      for (var i = 0; i < this.opponent_position_list.length; ++i) {
         move_vector.x += (i+1) * this.opponent_position_list[i].x;
         move_vector.y += (i+1) * this.opponent_position_list[i].y;
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
      this.opponent_nextfruit = evadeBot.closest_fruit_if_in_range({x:get_opponent_x(),y:get_opponent_y()},region);
      if (this.opponent_nextfruit == null) {
         this.opponent_nextfruit = evadeBot.closest_fruit({x:get_opponent_x(),y:get_opponent_y()});
      }
   },

   //update target if necessary
   choose_my_nextfruit: function() {
      //if my targeted next fruit does not exist, get a new target
      if (!evadeBot.exists(this.my_nextfruit)) {
         this.my_nextfruit = evadeBot.closest_fruit({x:get_my_x(), y:get_my_y()});
      }
      
      //if targeting the same location and the opponent has same or lesser distance, evade
      if ((this.opponent_nextfruit == this.my_nextfruit) && (evadeBot.exists(this.opponent_nextfruit))) { 
         var my_distance = evadeBot.get_distance({x:get_my_x(),y:get_my_y()},this.my_nextfruit);
         var opponent_distance = evadeBot.get_distance({x:get_opponent_x(),y:get_opponent_y()},this.opponent_nextfruit);
         if (my_distance >= opponent_distance) {
            var taboolist = [];
            taboolist.push(this.opponent_nextfruit);
            this.my_nextfruit = evadeBot.closest_fruit_if_not_in_list({x:get_my_x(),y:get_my_y()},taboolist);
         }
      }
      
      //debug
      //console.info(this.opponent_nextfruit);
      //console.info(this.my_nextfruit);
      //console.log(this.opponent_nextfruit == this.my_nextfruit);
   },

   //use the fruitlist to find the closest target
   //but ignore fruit with coords in the range
   closest_fruit_if_in_range: function(player, region) {
      var distance;
      var minimum = {distance:999, fruit:null};
      
      this.fruitlist.forEach(function (fruit) {
         if (evadeBot.exists(fruit)) {
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
      
      this.fruitlist.forEach(function (fruit) {
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
      
      this.fruitlist.forEach(function (fruit) {
         if (evadeBot.exists(fruit)) {
            distance = evadeBot.get_distance(player,fruit);
            if (distance < minimum.distance) {
                  minimum.distance = distance;
                  minimum.fruit = fruit;
            }
         }
      });
      
      return minimum.fruit;
   },

   // delete old memories from old games
   init_opponent_position_list: function() {
      //clear previous game's move memory
      while (this.opponent_position_list.length > 0) {
         this.opponent_position_list.shift();
      }
   },

};

