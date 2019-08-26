const adv = require("./axiosConfig");

// var coolDown = null;

// adv
//   .get('init')
//   .then(res => console.log(res.data))
//   .catch(err => console.log(err.message));

// adv
//   .post('move', {direction: 's'})
//   .then(res => console.log("New Room: ", res.data))
//   .catch(err => console.log(err.message));

// POST with Function
function postDirection(dir) {
  adv
    .post("move", { direction: dir })
    .then(res => console.log("New Room: ", res.data))
    .catch(err => console.log(err.message));
}

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

//  Global variable - currentRoom
var currentRoom = null;
var roomCD = 1;

// Initialization
adv
  .get("init")
  .then(res => {
    console.log(res.data);

    // Set Current Room as res.data
    currentRoom = res.data;

    // Check ID and Exit data
    console.log("ID: ", currentRoom.room_id);
    console.log("Exits: ", currentRoom.exits);

    // get cooldown value for current room for setTimeout()
    roomCD = currentRoom.cooldown;
  })
  .catch(err => console.error(err));

//  ================ LOOP BELOW in setTimeout==========

// While not all rooms have been explored (length of graph is not 500)

function loop() {
  console.log("LOOPING...");

  console.log("Start of loop, room #: ", currentRoom.room_id);

  // If current room id is not in graph object, add it as new key in graph object

  if (!graph[currentRoom.room_id]) {
    // Add Room ID to graph object
    var roomID = currentRoom.room_id;
    graph[roomID] = {}; // []

    //  Check Graph content and length
    console.log("Room ID added as new key: ", graph);
    console.log("Graph length: ", Object.keys(graph).length);
  }

  // Add empty and/or missing exits to graph at roomID
  currentRoom.exits.forEach(exit => {
    // if exit not already listed in object,
    // add it with "?" as it's value (exit unexplored)

    if (!graph[roomID][exit]) {
      graph[roomID][exit] = "?";
    }
  });

  // Check Graph to make sure info added correctly
  console.log("Updated graph with empty dirs: ", graph);

  // Collect list of unexplored move options of roomID in graph ("has "?" as value")
  var moveOptions = [];

  for (var key in graph[roomID]) {
    if (graph[roomID][key] == "?") {
      moveOptions.push(key);
    }
  }

  // Check moveOptions array:
  console.log("Move options: ", moveOptions);

  // Handle Dead Ends:
  // moveOptions are empty (no unexplored exits) but can reverse route (backwardsPath has length)

  while (moveOptions.length == 0 && backwardsPath.length) {
    console.log("Oops! At dead end. Moving backwards.");
    break;

    var movedBack = backwardsPath.pop(); // the last move made
    traversalPath.push(movedBack);

    // Post Request to Move api with movedBack var as direction

    // Reset current room to new returned data
    // currentRoom = res.data
    // console.log("I'm now at room", currentRoom.room_id)

    var new_moveOptions = [];

    for (var key in graph[currentRoom.room_id]) {
      if (graph[currentRoom.room_id][key] == "?") {
        new_moveOptions.push(key);
      }
    }

    // set moveOptions to these new moveOptions
    // if still empty, the dead end while loop will repeat
    moveOptions = new_moveOptions;
  }

  // Handle Dead End:
  // No moveOptions and can't go backwards (back at start)
  if (moveOptions.length == 0 && backwardsPath.length == 0) {
    console.log("Dead end and can't go back!");
    // break
  }

  // Choose 1st item in moveOptions as next move
  // Reset moveOptions to empty to prep for next room

  var nextMove = moveOptions[0];
  moveOptions = [];

  // Record backwards version of move and push to backwardsPath array
  var backwardsMove = oppositeDir(nextMove);
  backwardsPath.push(backwardsMove);

  // ============= GETTING ID OF NEXT ROOM =============

  // Get ID of the room in the next move direction
  // Through Post?
  // postDirection(nextMove);
  // console.log("POST REQ HERE")
  // adv
  //   .post('move', {direction: nextMove})
  //   .then(res => {
  //     console.log("Post Worked!");
  //     console.log("Post Data: ", res.data)
  //     var nextRoomID = res.data.room_id
  //   })
  //   .catch(err => console.error("WHOOPS - POST ERROR!", err.response))
  // break

  // ========= REPLACING ? WITH ROOM IDs IN GRAPH

  // Update Graph - replace "?" with room ID values
  // Problematic for when creating new key in graph at beginning of while loop
  // graph[roomID][nextMove] = nextRoomID;
  // graph[nextRoomID] = {}; // do I need this line?
  // graph[nextRoomID][backwardsMove] = roomID;

  // Check Graph
  console.log("Updated Graph: ", graph);

  // Push nextMove to traversalPath
  // Move to next room (POST req)
  // Set currentRoom as new returned data to repeat while loop for next room

  traversalPath.push(nextMove);
  // currentRoom = postDirection(nextMove)
  console.log("PUSHED MOVE");

  setTimeout(() => {
    adv
      .post("move", { direction: nextMove })
      .then(res => {
        console.log("New Room: ", res.data);
        currentRoom = res.data;
        roomCD = res.data.cooldown;

        // Recursion
        if (Object.keys(graph).length !== 500) {
          console.log("Graph not 500 yet")
          setTimeout(() => { loop(); }, roomCD * 1000);
        }
      })
      .catch(err => console.log("POST ERR:", err.message));


  }, roomCD * 1000)
  

  

}



setTimeout(() => {loop();}, roomCD * 1000)









//  =========== WHILE LOOP
// while (Object.keys(graph).length !== 500) {
//   console.log("LOOPING...");

//   console.log("Start of loop, room #: ", currentRoom.room_id);

//   // If current room id is not in graph object, add it as new key in graph object

//   if (!graph[currentRoom.room_id]) {
//     // Add Room ID to graph object
//     var roomID = currentRoom.room_id;
//     graph[roomID] = {}; // []

//     //  Check Graph content and length
//     console.log("Room ID added as new key: ", graph);
//     console.log("Graph length: ", Object.keys(graph).length);
//   }

//   // Add empty and/or missing exits to graph at roomID
//   currentRoom.exits.forEach(exit => {
//     // if exit not already listed in object,
//     // add it with "?" as it's value (exit unexplored)

//     if (!graph[roomID][exit]) {
//       graph[roomID][exit] = "?";
//     }
//   });

//   // Check Graph to make sure info added correctly
//   console.log("Updated graph with empty dirs: ", graph);

//   // Collect list of unexplored move options of roomID in graph ("has "?" as value")
//   var moveOptions = [];

//   for (var key in graph[roomID]) {
//     if (graph[roomID][key] == "?") {
//       moveOptions.push(key);
//     }
//   }

//   // Check moveOptions array:
//   console.log("Move options: ", moveOptions);

//   // Handle Dead Ends:
//   // moveOptions are empty (no unexplored exits) but can reverse route (backwardsPath has length)

//   while (moveOptions.length == 0 && backwardsPath.length) {
//     console.log("Oops! At dead end. Moving backwards.");
//     break;

//     var movedBack = backwardsPath.pop(); // the last move made
//     traversalPath.push(movedBack);

//     // Post Request to Move api with movedBack var as direction

//     // Reset current room to new returned data
//     // currentRoom = res.data
//     // console.log("I'm now at room", currentRoom.room_id)

//     var new_moveOptions = [];

//     for (var key in graph[currentRoom.room_id]) {
//       if (graph[currentRoom.room_id][key] == "?") {
//         new_moveOptions.push(key);
//       }
//     }

//     // set moveOptions to these new moveOptions
//     // if still empty, the dead end while loop will repeat
//     moveOptions = new_moveOptions;
//   }

//   // Handle Dead End:
//   // No moveOptions and can't go backwards (back at start)
//   if (moveOptions.length == 0 && backwardsPath.length == 0) {
//     console.log("Dead end and can't go back!");
//     // break
//   }

//   // Choose 1st item in moveOptions as next move
//   // Reset moveOptions to empty to prep for next room

//   var nextMove = moveOptions[0];
//   moveOptions = [];

//   // Record backwards version of move and push to backwardsPath array
//   var backwardsMove = oppositeDir(nextMove);
//   backwardsPath.push(backwardsMove);

//   // Get ID of the room in the next move direction
//   // Through Post?
//   // postDirection(nextMove);
//   // console.log("POST REQ HERE")
//   // adv
//   //   .post('move', {direction: nextMove})
//   //   .then(res => {
//   //     console.log("Post Worked!");
//   //     console.log("Post Data: ", res.data)
//   //     var nextRoomID = res.data.room_id
//   //   })
//   //   .catch(err => console.error("WHOOPS - POST ERROR!", err.response))
//   // break

//   // Update Graph - replace "?" with room ID values
//   // Problematic for when creating new key in graph at beginning of while loop
//   // graph[roomID][nextMove] = nextRoomID;
//   // graph[nextRoomID] = {}; // do I need this line?
//   // graph[nextRoomID][backwardsMove] = roomID;

//   // Check Graph
//   console.log("Updated Graph: ", graph);

//   // Push nextMove to traversalPath
//   // Move to next room (POST req)
//   // Set currentRoom as new returned data to repeat while loop for next room

//   traversalPath.push(nextMove);
//   // currentRoom = postDirection(nextMove)
//   console.log("PUSHED MOVE");

//   adv
//     .post("move", { direction: nextMove })
//     .then(res => {
//       console.log("New Room: ", res.data);
//       currentRoom = res.data;
//       // setTimeout(() => {
//       //   currentRoom = res.data
//       // }, res.data.cooldown * 1000)
//     })
//     .catch(err => console.log(err.message));
//   // break
// }

// setTimeout(() => {}, roomCD * 1000);



