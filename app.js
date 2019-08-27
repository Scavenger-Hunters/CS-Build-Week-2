const adv = require('./axiosConfig');

currentRoom = {};

adv
  .post('move', { direction: 'n' })
  .then(res => {
    console.log(res.data);
    currentRoom = res.data;
  })
  .catch(err => console.error(err));
// setTimeout(() => {
//   adv
//     .post('move', {
//       direction: 'w'
//     })
//     .then(res => {
//       console.log(res.data);
//       currentRoom = res.data;
//     });
// }, currentRoom.cooldown * 1000);
