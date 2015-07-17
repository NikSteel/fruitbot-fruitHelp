var Player1 = null;
var Player2 = null;

function init_players() {
      set_players(2,2);
}

function set_players(A,B) {
   if ((A > 0) && (B > 0) && (A <= allBotList.length) && (B <= allBotList.length)){
      Player1 = allBotList[A-1];
      Player2 = allBotList[B-1]; 
   }
}

/*
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
*/
//window._window = Object.keys(window);

var  nothingBot = {
   name: "nothingBot",
   
   new_game: function() {
   },

   makeMove: function() {
      return PASS;
   }
};

var randomBot = {
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
};

var allBotList = [nothingBot, randomBot];