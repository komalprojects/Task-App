require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('649beb2a57102a489d6b510d', { age: 10 })
  .then((res) => {
    console.log(res);
    return User.countDocuments({ age: 10 });
  })
  .then((count) => {
    console.log(count);
  })
  .catch((err) => console.log(err));
