//The following are support functions for use with fruitbots

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
   },
   
   exists: function(fruit) {
      if (fruit == null)
         return false;
      return (fruit.type > 0);
   },
   
   get_distance: function(player,fruit) {
      return Math.abs(player.x - fruit.x) + Math.abs(player.y - fruit.y);
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


   /*
   forEachFruit: function(testFunc) {
     this.fruitlist.forEach(function (fruit) {
         if (botHelp.exists(fruit) {
            testFunc(fruit);
         }
      }
   },
   */
   
   
};