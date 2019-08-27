/*

1. Set global variables for graph object, traversalPath arr, and backwardsPath arr

2. Create function that accepts a direction and returns its opposite

3. Get request to init endpoint to and set res.data as currentRoom

Within the Get request:

4. While loops that repeats until graph length reaches 500 (all rooms are in graph/all rooms visited)

5. If currentRoom ID not in graph, add it 

Ex result:
graph = {
    0: {}
}

6. If exits are not listed in graph for that roomID, add the exits as keys, with "?" as their values

Ex result:
graph = {
    0: {
        "n": "?",
        "s": "?",
        "e": "?"
    },
}

7. Collect list of unexplored move options for current room in moveOptions array (if value is "?" in graph[roomID], push the key)

8. set nextMove variable as 1st item in moveOptions array

9. pass nextMove variable in opposireDir() function and save result as backwardsMove

10. push this backwardsMove to the backwardsPath array

11. clear moveOptions array to prepare for next room

12. We can do the checks here for items in the room

13. if currentRoom.items.length > 0, post req to take items

14. also check if player inventory is full, if so, swap lower value items in inventory for higher value items in room 

15. when ready to move to next room, need to find a way to retrieve the ID of the room we're moving to (through POST req??) to save it in the graph and replace one of the "?" (and do the reverse for the nextRoom)

16. when ready to move to the next room, pass the nextMove variable with POST request to /move endpoint

ex: .post("move", {direction: nextMove})


*/