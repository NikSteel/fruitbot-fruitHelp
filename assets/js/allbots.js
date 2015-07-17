var setPlayerScope = function (Player) {
  Object.keys(Player).forEach(function (value, index) {
    //console.log("SET", value, Player[value]);
    window[value] = Player[value];
  });
};

var savePlayerScope = function (Player) {
  Object.keys(Player).forEach(function (value, index) {
    if (value !== "makeMove" && value !== "name") {
      Player[value] = window[value];
    }
  });
};

window._window = Object.keys(window);

var Bots = {

   allBotList: [],
   Player1: null,
   Player2: null,

   init: function() {
      Bots.allBotList.push(Bots.ex1);
      Bots.allBotList.push(Bots.ex2);
      Bots.setPlayers(1,2);
   },


    
   setPlayers: function(A,B) {
      if ((A > 0) && (B > 0) && (A <= Bots.allBotList.length) && (B <= Bots.allBotList.length)){
         Bots.Player1 = Bots.allBotList[A-1];
         Bots.Player2 = Bots.allBotList[B-1]; 
      }
   },

   ex1: {
      name: "donothing",
      
      new_game: function() {
      },

      makeMove: function() {
         return PASS;
      }
   },

   ex2: {
      name: "randombot",
      
      new_game: function() {
      },

      makeMove: function() {
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
   }
};

