const adv = require("./axiosConfig");

// adv
//   .get('init')
//   .then(res => console.log(res.data))
//   .catch(err => console.log(err.message));

// adv
//   .post('move', {direction: 's', next_room_id: "76"})
//   .then(res => console.log("New Room: ", res.data))
//   .catch(err => console.log(err.message, err.response.config));

// Create Empty Graph
var graph = {};

// Record path
var traversalPath = [];

// Record reverse path to go backwards at dead end
var backwardsPath = [];

// Get opposite direction to record in backwardsPath array
function oppositeDir(dir) {
  var result = "";

  if (dir == "n") {
    result = "s";
  } else if (dir == "s") {
    result = "n";
  } else if (dir == "w") {
    result = "e";
  } else if (dir == "e") {
    result = "w";
  }

  return result;
}

//  Global variable - currentRoom, room cool down, prev room id
var currentRoom = null;
var roomCD = 16; // to cover bases... if loop() starts too soon, currentRoom is still null and fx breaks

// Initialization
adv
  .get("init")
  .then(res => {
    console.log("Init: ", res.data);

    // Set Current Room as res.data
    currentRoom = res.data;

    // Check ID and Exit data
    console.log("ID: ", currentRoom.room_id);
    console.log("Exits: ", currentRoom.exits);

    // get cooldown value for current room for setTimeout()
    roomCD = currentRoom.cooldown;
  })
  .catch(err => console.error(err));

//  ============== Recursion to Populate Graph ============
// Loops until graph length is 500

function loop() {
  console.log(" >> Looping ...");

  console.log("Start loop at room #: ", currentRoom.room_id);

  const roomID = currentRoom.room_id;

  // If current room id is not in graph object, add it as new key in graph object

  if (!graph[roomID]) {
    // Add Room ID to graph object
    // var roomID = currentRoom.room_id;
    graph[roomID] = {}; // []
  }

  // Add empty and/or missing exits to graph at roomID
  currentRoom.exits.forEach(exit => {
    // if exit not already listed in object,
    // add it with "?" as it's value (exit unexplored)

    // var roomID = currentRoom.room_id;

    if (graph[roomID][exit] == undefined) {
      graph[roomID][exit] = "?";
    }
  });

  // Check Graph to make sure info added correctly
  console.log("Updated graph with empty dirs: ", graph);
  console.log("Graph length: ", Object.keys(graph).length);

  // Collect list of unexplored move options of roomID in graph ("has "?" as value")
  var moveOptions = [];

  for (var key in graph[roomID]) {
    if (graph[roomID][key] == "?") {
      moveOptions.push(key);
    }
  }

  // Check moveOptions array:
  console.log("Move options: ", moveOptions);

  // ==============  Handle Dead Ends: ==============

  // moveOptions are empty (no unexplored exits) but can reverse route (backwardsPath has length)

  if (moveOptions.length == 0 && backwardsPath.length) {
    console.log("Oops! At dead end. Moving backwards.");
    // break;

    // save last move made
    const movedBack = backwardsPath.pop();

    // add that reverse move to end of traversePath arr
    traversalPath.push(movedBack);

    // save id of room we're moving to as a string for wise explorer
    const backRoomID = graph[roomID][movedBack].toString();
    console.log("Back room ID: ", backRoomID);

    // Post Request to Move api with movedBack var as direction
    setTimeout(() => {
      
      console.log("In Set Timeout Fx for Dead End");

      adv
        .post("move", { direction: movedBack, next_room_id: backRoomID })
        .then(res => {
          currentRoom = res.data;
          roomCD = res.data.cooldown;
          console.log("Reversed! I'm now in room", currentRoom.room_id, "cd: ", roomCD);

          // Recursion
          if (Object.keys(graph).length !== 500) {
            console.log("Moved from dead end, repeating loop.");
            setTimeout(() => {
              loop();
            }, roomCD * 1000);
          }
        })
        .catch(err => console.log("Dead End POST ERR:", err.message));
    }, roomCD * 1000);
  }

  // ==============  Handle Dead Ends: ==============
  // No moveOptions and can't go backwards (back at start)

  else if (moveOptions.length == 0 && backwardsPath.length == 0) {
    console.log("Dead end and can't go back... Graph complete?");
    console.log("Graph length @ Dead End: ", Object.keys(graph).length);
    // break;
    return graph; // yes??
  }

  // ==============  No Dead Ends: ==============

  // But if moveOptions length > 0

  else if (moveOptions.length > 0) {

    // Choose 1st item in moveOptions as next move
    // Reset moveOptions to empty to prep for next room

    var nextMove = moveOptions[0];
    moveOptions = [];

    // Record backwards version of move and push to backwardsPath array
    var backwardsMove = oppositeDir(nextMove);
    backwardsPath.push(backwardsMove);

    traversalPath.push(nextMove);
    // currentRoom = postDirection(nextMove)
    console.log("PUSHED MOVE");

    setTimeout(() => {
      adv
        .post("move", { direction: nextMove })
        .then(res => {
          console.log("New Room: ", res.data);

          // save prev room ID, set new currentRoom
          var prevRoomID = roomID;
          currentRoom = res.data;

          // Update graph values of prevRoom
          graph[prevRoomID][nextMove] = currentRoom.room_id;

          var newRoomID = currentRoom.room_id;

          // Add new room ID key to graph
          if (!graph[newRoomID]) {
            graph[newRoomID] = {};
          }

          // Add newroom exit values
          currentRoom.exits.forEach(exit => {
            if (!graph[newRoomID][exit]) {
              graph[newRoomID][exit] = "?";
            }
          });

          // Update graph values of new current room with prevRoom ID
          graph[newRoomID][backwardsMove] = prevRoomID;

          // check out updated graph
          console.log("Replaced ?s: ", graph);

          // reset room cool down variable
          roomCD = res.data.cooldown;

          // Recursion
          if (Object.keys(graph).length !== 500) {
            console.log("Graph not 500 yet");
            setTimeout(() => {
              loop();
            }, roomCD * 1000);
          }
        })
        .catch(err => console.log("POST ERR:", err.message));
    }, roomCD * 1000);
  }
  
}

setTimeout(() => {
  loop();
}, roomCD * 1000);
