//fruitHelp API by Nik Steel

//The fruitHelp API gives players a list of fruit objects with the structure
//    <fruit> = {x,y,type}
//and functions for operating with those fruit objects

//You define a function that takes a fruit object as a parameter and pass
//that function into this one as a parameter. Your function will be executed
//for each currently available fruit object.
forEachFruit( <function(fruit)> );

//Some functions have a <purpose> parameter. Use these constants to indicate which
//player's perspective to use with those functions.
<purpose> = FOR_ME
<purpose> = FOR_OPPONENT

//the number of tiles between the player and the fruit, assuming minimum path
//lower is better
getDistance( <purpose>, <fruit> );

//the number of fruit needed of the fruit's type for the player to get a point for that type
//lower is better
getNumNeededToTie( <purpose>, <fruit> );
//if opponent already has a point in the category, the num need is equal to this constant:
HOPELESS

//uses the supplied calculation function to find the best fruit for the player
getMinFruit( <purpose>, <function(fruit) to calculate a priority value> );
//you may force getMinFruit to ignore a fruit by returning this constant from your calculate function
POS_INFINITY

//uses the supplied calculation function to find the best fruit for the player
getMaxFruit( <purpose>, <function(fruit) to calculate a priority value> );
//you may force getMaxFruit to ignore a fruit by returning this constant from your calculate function
NEG_INFINITY

//returns a player action constant (like NORTH, SOUTH, TAKE, etc.) to move with the
//minimum distance path towards a piece of fruit
moveTo( <fruit> );
//if you move to a fruit that does not exist (because it is null or taken), the player will PASS

//returns true if the fruit object is not null and is available to be taken
exists( <fruit> );
//note that all of these API functions will check existence, so it is safe to pass a null fruit object to any API function.