const adv = require('./axiosConfig');

adv
  .get('init')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
