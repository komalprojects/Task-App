require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('649be5d143a7d441ec3f01c1')
//   .then((res) => Task.countDocuments({ completed: false }))
//   .then((count) => console.log(count))
//   .catch((err) => console.log(err));

const deleteByIdAndGetCount = async (id) => {
  await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

console.log(deleteByIdAndGetCount('649bea83efe45c44e899e1c1'));
