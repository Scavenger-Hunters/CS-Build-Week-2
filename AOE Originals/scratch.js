while (Object.keys(graph).length !== 500) {
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

  adv
    .post("move", { direction: nextMove })
    .then(res => {
      console.log("New Room: ", res.data);
      currentRoom = res.data;
      // setTimeout(() => {
      //   currentRoom = res.data
      // }, res.data.cooldown * 1000)
    })
    .catch(err => console.log(err.message));
  // break
}


// =============== new_moveOptions code:
// I don't think I need to get new move options anymore...
// get new move options
// const new_moveOptions = [];
// for (var key in graph[currentRoom.room_id]) {
//   if (graph[currentRoom.room_id][key] == "?") {
//     new_moveOptions.push(key);
//   }
// }

// // set moveOptions to these new moveOptions
// moveOptions = new_moveOptions;



// Examine

curl -X POST -H 'Authorization: Token f8aba2dd011d7' -H "Content-Type: application/json" -d '{"name":"[Player123]"}' https://lambda-treasure-hunt.herokuapp.com/api/adv/examine/

// GRAPH SO FAR:
{ '0': { n: 10, s: 2, e: 4, w: 1 },
  '1': { e: 0 },
  '2': { n: 0, s: 6, e: 3 },
  '3': { s: 9, e: 5, w: 2 },
  '4': { n: 23, e: 13, w: 0 },
  '5': { w: 3 },
  '6': { n: 2, w: 7 },
  '7': { n: 8, e: 6, w: 56 },
  '8': { s: 7, w: 16 },
  '9': { n: 3, s: 12, e: 11 },
  '10': { n: 19, s: 0, w: 43 },
  '11': { e: 17, w: 9 },
  '12': { n: 9, s: 18, e: 14, w: 21 },
  '13': { e: 15, w: 4 },
  '14': { s: 34, e: 37, w: 12 },
  '15': { w: 13 },
  '16': { n: 58, e: 8, w: 67 },
  '17': { n: 24, e: 42, w: 11 },
  '18': { n: 12, s: 22, w: 25 },
  '19': { n: 20, s: 10, w: 77 },
  '20': { n: 63, s: 19, e: 27, w: 46 },
  '21': { e: 12, w: 29 },
  '22': { n: 18, s: 78, w: 36 },
  '23': { s: 4, e: 26 },
  '24': { s: 17 },
  '25': { e: 18 },
  '26': { e: 55, w: 23 },
  '27': { n: 40, s: 28, e: 30, w: 20 },
  '28': { n: 27 },
  '29': { s: 45, e: 21, w: 49 },
  '30': { s: 31, e: 32, w: 27 },
  '31': { n: 30, e: 33 },
  '32': { n: 39, e: 54, w: 30 },
  '33': { e: 38, w: 31 },
  '34': { n: 14, s: 50, e: 35 },
  '35': { s: 52, w: 34 },
  '36': { s: 48, e: 22, w: 60 },
  '37': { w: 14 },
  '38': { s: 59, e: 66, w: 33 },
  '39': { n: 53, s: 32, e: 51, w: 41 },
  '40': { s: 27 },
  '41': { e: 39 },
  '42': { n: 44, s: 80, e: 118, w: 17 },
  '43': { e: 10, w: 47 },
  '44': { s: 42 },
  '45': { n: 29, s: 60 },
  '46': { e: 20, w: 62 },
  '47': { n: 71, e: 43 },
  '48': { n: 36, s: 105, w: 149 },
  '49': { s: 79, e: 29, w: 136 },
  '50': { n: 34, s: 89 },
  '51': { n: 69, e: 57, w: 39 },
  '52': { n: 35, s: 68, e: 75 },
  '53': { n: 95, s: 39, w: 88 },
  '54': { w: 32 },
  '55': { w: 26 },
  '56': { e: 7, w: 61 },
  '57': { e: 145, w: 51 },
  '58': { s: 16, w: 65 },
  '59': { n: 38, s: 104, e: 92 },
  '60': { n: 45, e: 36, w: 70 },
  '61': { e: 56, w: 171 },
  '62': { n: 64, e: 46, w: 84 },
  '63': { n: 72, s: 20, w: 73 },
  '64': { s: 62, w: 82 },
  '65': { n: 74, e: 58, w: 139 },
  '66': { n: 169, e: 123, w: 38 },
  '67': { e: 16, w: 162 },
  '68': { n: 52, e: 100 },
  '69': { n: 94, s: 51, e: 103 },
  '70': { s: 163, e: 60, w: 98 },
  '71': { s: 47 },
  '72': { s: 63, w: 76 },
  '73': { e: 63 },
  '74': { n: 87, s: 65, w: 161 },
  '75': { e: 85, w: 52 },
  '76': { n: 83, e: 72, w: 110 },
  '77': { e: 19 },
  '78': { n: 22, s: 108 },
  '79': { n: 49 },
  '80': { n: 42, s: 81, e: 86 },
  '81': { n: 80 },
  '82': { n: 191, e: 64 },
  '83': { s: 76, e: 130, w: 125 },
  '84': { e: 62, w: 91 },
  '85': { e: 154, w: 75 },
  '86': { s: 96, e: 90, w: 80 },
  '87': { s: 74 },
  '88': { e: 53, w: 122 },
  '89': { n: 50, s: 93 },
  '90': { e: 178, w: 86 },
  '91': { n: 180, s: 101, e: 84, w: 99 },
  '92': { w: 59 },
  '93': { n: 89, w: 108 },
  '94': { n: 152, s: 69 },
  '95': { n: 119, s: 53, w: 115 },
  '96': { n: 86, e: 97 },
  '97': { e: 181, w: 96 },
  '98': { n: 102, s: 126, e: 70, w: 109 },
  '99': { n: 190, e: 91, w: 146 },
  '100': { s: 106, e: 112, w: 68 },
  '101': { n: 91, w: 113 },
  '102': { s: 98, w: 142 },
  '103': { n: 160, w: 69 },
  '104': { n: 59, e: 107 },
  '105': { n: 48, w: 202 },
  '106': { n: 100, s: 111, w: 135 },
  '107': { s: 120, e: 121, w: 104 },
  '108': { n: 78, s: 117, e: 93 },
  '109': { s: 185, e: 98, w: 175 },
  '110': { e: 76 },
  '111': { n: 106, s: 367, e: 158 },
  '112': { s: 141, e: 140, w: 100 },
  '113': { s: 114, e: 101 },
  '114': { n: 113, w: 176 },
  '115': { n: 116, e: 95 },
  '116': { n: 132, s: 115 },
  '117': { n: 108, s: 131, e: 166, w: 133 },
  '118': { e: 137, w: 42 },
  '119': { n: 134, s: 95 },
  '120': { n: 107, e: 127 },
  '121': { n: 128, e: 143, w: 107 },
  '122': { n: 124, e: 88 },
  '123': { w: 66 },
  '124': { n: 157, s: 122 },
  '125': { n: 165, e: 83, w: 237 },
  '126': { n: 98, s: 129 },
  '127': { e: 184, w: 120 },
  '128': { s: 121, e: 189 },
  '129': { n: 126, e: 194, w: 170 },
  '130': { w: 83 },
  '131': { n: 117, s: 244, w: 138 },
  '132': { s: 116 },
  '133': { e: 117, w: 173 },
  '134': { n: 147, s: 119, e: 144 },
  '135': { s: 150, e: 106 },
  '136': { e: 49, w: 148 },
  '137': { w: 118 },
  '138': { s: 211, e: 131, w: 195 },
  '139': { e: 65, w: 188 },
  '140': { w: 112 },
  '141': { n: 112, e: 156 },
  '142': { e: 102, w: 159 },
  '143': { e: 212, w: 121 },
  '144': { e: 155, w: 134 },
  '145': { n: 174, e: 220, w: 57 },
  '146': { n: 215, s: 177, e: 99, w: 257 },
  '147': { n: 200, s: 134, e: 153, w: 151 },
  '148': { e: 136, w: 292 },
  '149': { e: 48 },
  '150': { n: 135, w: 166 },
  '151': { n: 172, e: 147, w: 207 },
  '152': { s: 94 },
  '153': { e: 329, w: 147 },
  '154': { e: 193, w: 85 },
  '155': { s: 187, e: 316, w: 144 },
  '156': { s: 168, e: 164, w: 141 },
  '157': { n: 210, s: 124, w: 182 },
  '158': { s: 167, w: 111 },
  '159': { e: 142, w: 196 },
  '160': { s: 103 },
  '161': { e: 74 },
  '162': { e: 67 },
  '163': { n: 70 },
  '164': { n: 217, e: 298, w: 156 },
  '165': { n: 203, s: 125, w: 204 },
  '166': { s: 198, e: 150, w: 117 },
  '167': { n: 158, s: 262, e: 260 },
  '168': { n: 156, e: 340 },
  '169': { s: 66, e: 186 },
  '170': { e: 129 },
  '171': { e: 61 },
  '172': { n: 267, s: 151 },
  '173': { e: 133, w: 214 },
  '174': { n: 192, s: 145, e: 224 },
  '175': { s: 183, e: 109, w: 179 },
  '176': { e: 114, w: 402 },
  '177': { n: 146, w: 346 },
  '178': { n: 209, e: 243, w: 90 },
  '179': { s: 233, e: 175, w: 213 },
  '180': { s: 91 },
  '181': { w: 97 },
  '182': { e: 157, w: 208 },
  '183': { n: 175, s: 229 },
  '184': { e: 221, w: 127 },
  '185': { n: 109 },
  '186': { e: 205, w: 169 },
  '187': { n: 155 },
  '188': { e: 139, w: 335 },
  '189': { e: 255, w: 128 },
  '190': { s: 99 },
  '191': { s: 82 },
  '192': { n: 201, s: 174, e: 223 },
  '193': { e: 251, w: 154 },
  '194': { s: 214, w: 129 },
  '195': { s: 228, e: 138, w: 225 },
  '196': { n: 222, e: 159, w: 197 },
  '197': { n: 232, e: 196, w: 276 },
  '198': { n: 166, s: 239, e: 199 },
  '199': { s: 230, w: 198 },
  '200': { n: 227, s: 147, e: 206 },
  '201': { s: 192 },
  '202': { e: 105 },
  '203': { n: 268, s: 165, e: 299 },
  '204': { n: 219, e: 165, w: 216 },
  '205': { s: 241, e: 479, w: 186 },
  '206': { n: 288, e: 380, w: 200 },
  '207': { n: 231, e: 151, w: 290 },
  '208': { e: 182 },
  '209': { s: 178 },
  '210': { s: 157 },
  '211': { n: 138 },
  '212': { w: 143 },
  '213': { e: 179, w: 420 },
  '214': { n: 194, e: 173, w: 226 },
  '215': { n: 246, s: 146 },
  '216': { n: 234, e: 204, w: 218 },
  '217': { s: 164, e: 247 },
  '218': { s: 263, e: 216, w: 242 },
  '219': { s: 204 },
  '220': { w: 145 },
  '221': { s: 253, e: 240, w: 184 },
  '222': { n: 305, s: 196 },
  '223': { n: 283, w: 192 },
  '224': { w: 174 },
  '225': { s: 278, e: 195 },
  '226': { s: 300, e: 214 },
  '227': { n: 269, s: 200 },
  '228': { n: 195, s: 281 },
  '229': { n: 183, s: 250, w: 236 },
  '230': { n: 199, s: 307, e: 297 },
  '231': { s: 207, w: 248 },
  '232': { n: 272, s: 197, w: 235 },
  '233': { n: 179, w: 238 },
  '234': { n: 368, s: 216, w: 252 },
  '235': { n: 330, e: 232, w: 355 },
  '236': { s: 264, e: 229 },
  '237': { e: 125, w: 245 },
  '238': { e: 233 },
  '239': { n: 198, w: 244 },
  '240': { n: 249, e: 386, w: 221 },
  '241': { n: 205, e: 266 },
  '242': { n: 287, s: 259, e: 218, w: 275 },
  '243': { s: 293, e: 256, w: 178 },
  '244': { n: 131, e: 239 },
  '245': { s: 254, e: 237 },
  '246': { s: 215 },
  '247': { e: 261, w: 217 },
  '248': { n: 296, e: 231, w: 280 },
  '249': { n: 265, s: 240, e: 282 },
  '250': { n: 229, s: 294, e: 289 },
  '251': { e: 315, w: 193 },
  '252': { n: 284, e: 234 },
  '253': { n: 221, e: 258 },
  '254': { n: 245, w: 314 },
  '255': { w: 189 },
  '256': { s: 360, e: 327, w: 243 },
  '257': { n: 320, e: 146, w: 364 },
  '258': { e: 306, w: 253 },
  '259': { n: 242, w: 310 },
  '260': { w: 167 },
  '261': { s: 277, e: 322, w: 247 },
  '262': { n: 167, s: 370, e: 358 },
  '263': { n: 218 },
  '264': { n: 236, s: 274, w: 273 },
  '265': { n: 279, s: 249, e: 270 },
  '266': { w: 241 },
  '267': { n: 285, s: 172, w: 271 },
  '268': { s: 203, e: 411, w: 312 },
  '269': { n: 319, s: 227 },
  '270': { n: 416, e: 338, w: 265 },
  '271': { n: 337, e: 267 },
  '272': { n: 295, s: 232 },
  '273': { n: 343, e: 264 },
  '274': { n: 264, w: 308 },
  '275': { e: 242, w: 456 },
  '276': { e: 197, w: 419 },
  '277': { n: 261, e: 323 },
  '278': { n: 225 },
  '279': { s: 265 },
  '280': { n: 325, e: 248 },
  '281': { n: 228, s: 318, e: 309, w: 317 },
  '282': { w: 249 },
  '283': { n: 331, s: 223, e: 313 },
  '284': { n: 302, s: 252, w: 303 },
  '285': { n: 286, s: 267 },
  '286': { n: 336, s: 285, w: 291 },
  '287': { s: 242, w: 339 },
  '288': { s: 206 },
  '289': { w: 250 },
  '290': { e: 207 },
  '291': { n: 410, e: 286, w: 347 },
  '292': { n: 301, e: 148 },
  '293': { n: 243 },
  '294': { n: 250, s: 334 },
  '295': { s: 272 },
  '296': { s: 248 },
  '297': { w: 230 },
  '298': { s: 324, w: 164 },
  '299': { e: 311, w: 203 },
  '300': { n: 226, s: 377, w: 389 },
  '301': { n: 304, s: 292 },
  '302': { n: 422, s: 284 },
  '303': { n: 361, e: 284, w: 405 },
  '304': { s: 301 },
  '305': { n: 365, s: 222 },
  '306': { e: 397, w: 258 },
  '307': { n: 230, s: 373, e: 371, w: 321 },
  '308': { e: 274 },
  '309': { s: 333, e: 326, w: 281 },
  '310': { e: 259, w: 412 },
  '311': { w: 299 },
  '312': { n: 328, e: 268 },
  '313': { w: 283 },
  '314': { e: 254 },
  '315': { w: 251 },
  '316': { n: 344, w: 155 },
  '317': { s: 387, e: 281, w: 409 },
  '318': { n: 281, s: 487 },
  '319': { n: 359, s: 269, e: 345 },
  '320': { n: 348, s: 257 },
  '321': { s: 413, e: 307 },
  '322': { n: 382, e: 435, w: 261 },
  '323': { e: 433, w: 277 },
  '324': { n: 298, s: 349, e: 354 },
  '325': { n: 353, s: 280, w: 374 },
  '326': { s: 342, w: 309 },
  '327': { e: 427, w: 256 },
  '328': { n: 332, s: 312, e: 357, w: 363 },
  '329': { w: 153 },
  '330': { n: 369, s: 235, w: 383 },
  '331': { s: 283, e: 446 },
  '332': { n: 350, s: 328 },
  '333': { n: 309, s: 378 },
  '334': { n: 294, s: 393, e: 341, w: 391 },
  '335': { e: 188, w: 366 },
  '336': { s: 286 },
  '337': { s: 271 },
  '338': { s: 379, w: 270 },
  '339': { e: 287, w: 445 },
  '340': { w: 168 },
  '341': { s: 449, w: 334 },
  '342': { n: 326, s: 432 },
  '343': { s: 273, w: 351 },
  '344': { n: 392, s: 316, e: 390 },
  '345': { s: 375, w: 319 },
  '346': { e: 177 },
  '347': { n: 452, s: 442, e: 291 },
  '348': { s: 320 },
  '349': { n: 324, s: 352, e: 384, w: 356 },
  '350': { n: 436, s: 332, e: 404 },
  '351': { s: 491, e: 343, w: 478 },
  '352': { n: 349, s: 362, e: 485 },
  '353': { s: 325 },
  '354': { w: 324 },
  '355': { e: 235 },
  '356': { e: 349 },
  '357': { w: 328 },
  '358': { e: 401, w: 262 },
  '359': { s: 319 },
  '360': { n: 256, e: 398 },
  '361': { n: 408, s: 303 },
  '362': { n: 352, s: 399, w: 463 },
  '363': { n: 372, e: 328 },
  '364': { n: 429, s: 381, e: 257, w: 448 },
  '365': { s: 305 },
  '366': { e: 335 },
  '367': { n: 111 },
  '368': { s: 234 },
  '369': { n: 400, s: 330, w: 376 },
  '370': { n: 262, s: 434, e: 407 },
  '371': { s: 475, w: 307 },
  '372': { n: 441, s: 363 },
  '373': { n: 307, s: 480 },
  '374': { e: 325 },
  '375': { n: 345, e: 385 },
  '376': { e: 369 },
  '377': { n: 300 },
  '378': { n: 333 },
  '379': { n: 338, e: 395 },
  '380': { n: 424, w: 206 },
  '381': { n: 364, w: 394 },
  '382': { s: 322, e: 388 },
  '383': { e: 330, w: 495 },
  '384': { w: 349 },
  '385': { w: 375 },
  '386': { e: 414, w: 240 },
  '387': { n: 317, s: 417, w: 431 },
  '388': { e: 477, w: 382 },
  '389': { e: 300 },
  '390': { w: 344 },
  '391': { s: 396, e: 334, w: 428 },
  '392': { s: 344, e: 462 },
  '393': { n: 334, s: 482 },
  '394': { e: 381 },
  '395': { s: 403, e: 421, w: 379 },
  '396': { n: 391 },
  '397': { w: 306 },
  '398': { e: 438, w: 360 },
  '399': { n: 362, s: 467 },
  '400': { s: 369 },
  '401': { w: 358 },
  '402': { e: 176, w: 451 },
  '403': { n: 395 },
  '404': { n: 481, w: 350 },
  '405': { n: 406, e: 303 },
  '406': { s: 405, w: 415 },
  '407': { s: 496, w: 370 },
  '408': { n: 458, s: 361, w: 423 },
  '409': { e: 317 },
  '410': { s: 291 },
  '411': { w: 268 },
  '412': { s: 488, e: 310 },
  '413': { n: 321 },
  '414': { w: 386 },
  '415': { e: 406, w: 418 },
  '416': { s: 270 },
  '417': { n: 387 },
  '418': { n: 425, s: 474, e: 415 },
  '419': { e: 276 },
  '420': { s: 444, e: 213, w: 437 },
  '421': { n: 440, w: 395 },
  '422': { n: 426, s: 302 },
  '423': { e: 408, w: 454 },
  '424': { s: 380, e: 473 },
  '425': { s: 418, w: 469 },
  '426': { n: 457, s: 422 },
  '427': { e: 430, w: 327 },
  '428': { e: 391 },
  '429': { s: 364 },
  '430': { n: 443, e: 439, w: 427 },
  '431': { e: 387, w: 492 },
  '432': { n: 342 },
  '433': { s: 455, e: 460, w: 323 },
  '434': { n: 370 },
  '435': { w: 322 },
  '436': { s: 350 },
  '437': { e: 420, w: 497 },
  '438': { e: 465, w: 398 },
  '439': { w: 430 },
  '440': { s: 421, w: 476 },
  '441': { s: 372 },
  '442': { n: 347 },
  '443': { s: 430, e: 471 },
  '444': { n: 420, w: 490 },
  '445': { n: 447, e: 339, w: 450 },
  '446': { e: 466, w: 331 },
  '447': { s: 445 },
  '448': { e: 364 },
  '449': { n: 341 },
  '450': { e: 445 },
  '451': { e: 402, w: 453 },
  '452': { s: 347 },
  '453': { s: 464, e: 451 },
  '454': { n: 470, e: 423 },
  '455': { n: 433 },
  '456': { e: 275, w: 499 },
  '457': { n: 461, s: 426 },
  '458': { s: 408, w: 459 },
  '459': { e: 458 },
  '460': { w: 433 },
  '461': { s: 457 },
  '462': { w: 392 },
  '463': { s: 468, e: 362 },
  '464': { n: 453 },
  '465': { e: 498, w: 438 },
  '466': { s: 486, e: 472, w: 446 },
  '467': { n: 399 },
  '468': { n: 463 },
  '469': { e: 425 },
  '470': { s: 454 },
  '471': { w: 443 },
  '472': { w: 466 },
  '473': { e: 494, w: 424 },
  '474': { n: 418 },
  '475': { n: 371, s: 484 },
  '476': { e: 440 },
  '477': { e: 483, w: 388 },
  '478': { e: 351 },
  '479': { w: 205 },
  '480': { n: 373 },
  '481': { s: 404 },
  '482': { n: 393 },
  '483': { w: 477 },
  '484': { n: 475 },
  '485': { w: 352 },
  '486': { n: 466 },
  '487': { n: 318, s: 489 },
  '488': { n: 412 },
  '489': { n: 487 },
  '490': { e: 444, w: 493 },
  '491': { n: 351 },
  '492': { e: 431 },
  '493': { e: 490 },
  '494': { w: 473 },
  '495': { e: 383 },
  '496': { n: 407 },
  '497': { e: 437 },
  '498': { w: 465 },
  '499': { e: 456 } 
}

0 s 
2 e 
3 s 
9 s 
12 s 
18 s 
22 s 
78 s 
108 s 
117 e 
166 e 
150 n 
135 e 
106 n 
100 e 
112 s 
141 e 
156 e 
164 e 
298 s 
324 s 
349 s 
352 s 
362 s 
399 s 
467

// Hint for Mining Coins:
10000010 - 130
00000000 - 0
00100100 - 36
10000010 - 130
00000001 - 1
00110110 - 54
10100000 - 160
00000000 - 0
00000001 - 1
10000010 - 130
00000001 - 1
10101010 - 170
10101010 - 170
00000000 - 0
00000001 - 1
01000111 - 71
00000000 - 0
00000001 - 1
10000010 - 130
00000000 - 0
01001001 - 73
01000111 - 71
00000000 - 0
00000001 - 1


// ===================



const miner = () => {
  // make sure we're in the mining room
  if (currentRoom.room_id === 250) {
    let prevBlock = '';
    axios.get(`${baseUrl}/bc/last_proof`, authHeader)
      .then(res => {
        console.log(res.data);
        let difficulty = res.data.difficulty;
        prevBlock = JSON.stringify(res.data.proof)
        console.log(prevBlock);
        let p = 550867667
        while (test_proof(prevBlock, p, difficulty) !== true) {
          if (p % 10000 === 0) {
            console.log('p is now', p);
          }
          p = Math.floor(Math.random() * 1000000000);
        }
        console.log('proof', p);
        setTimeout(() => {
          axios.post(`${baseUrl}/bc/mine`, {"proof": p}, authHeader)
            .then(res => console.log(res))
            .catch(err => console.log(err))
        }, 1000);
      })
      .catch(err => console.log(err))
  }
}
const test_proof = (block_string, proof, difficulty) => {
  let guess = `${block_string}${proof}`
  let guessHash = hash(guess)
  if (proof % 10000 === 0) {
    console.log('guessHash', guessHash);
  }
  let startString = ''
  for (let i = 0; i < difficulty; i++) {
    startString += 0
  }
  return guessHash.slice(0, difficulty) === startString
}
const hash = string => {
  return shajs('sha256').update(string).digest('hex')
}