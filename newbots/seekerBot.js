var seekerBot = {
   name: 'seekerBot',
   
   // distance to nearest fruit
   nearest: 999,
   nearX: -1,
   nearY: -1,

   new_game: function() {
      seekerBot.nearest = 999;
      seekerBot.nearX = -1;
      seekerBot.nearY = -1;
   },

   makeMove: function() {
      var board = get_board();

      // we found an item! take it!
      if (board[get_my_x()][get_my_y()] > 0) {
          return TAKE;
      }

      // player position
      var myX = get_my_x();
      var myY = get_my_y();

      // if we have reached our goal, reset 
      if (seekerBot.nearX == myX && seekerBot.nearY == myY){
         seekerBot.nearX = -1;
         seekerBot.nearY = -1;
      }

      // if we don't have a target - find the nearest fruit
      if (seekerBot.nearX < 0){
         seekerBot.nearest = 999;

         // loop through board positions
         for (var x = 0; x < board.length; x++){
            for (var y = 0; y < board[0].length; y++){

               // get value of cell being inspected
               var value = board[x][y];



               if (value > 0){ // cell holds a fruit

                  distance = Math.abs(myX - x) + Math.abs(myY - y);

                  // if it's closest, make it the target
                  if (distance < seekerBot.nearest){
                     seekerBot.nearX = x;
                     seekerBot.nearY = y;

                     seekerBot.nearest = distance;
                  }
               }
            }
         }
      }

      var direction;

      if (seekerBot.nearX > myX){
         direction = EAST;
      }
      if (seekerBot.nearX < myX){
         direction = WEST;
      }
      if (seekerBot.nearY > myY){
         direction = SOUTH;
      }
      if (seekerBot.nearY < myY){
         direction = NORTH;
      }

      // debug code
      // console.log ("At " + myX + "," + myY + " - Nearest = " + seekerBot.nearX + "," + seekerBot.nearY + " - direction = " + direction);
      return direction;
   }
};