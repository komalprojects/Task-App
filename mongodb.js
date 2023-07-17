//CRUD operations
const { MongoClient, ObjectId } = require('mongodb');

const connectionUrl = 'mongodb://localhost:27017';
//database name
const databaseName = 'task-manager';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(connectionUrl, options);

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = await client.db(databaseName);
  const userCollection = await db.collection('users');
  const taskCollection = await db.collection('task');

  //for users
  const result = await userCollection.findOne({ _id: ObjectId('649a8059df841c2576f90e5f') });
  console.log(result);
  //find many
  const findMany = await userCollection.find({ age: 30 }).count();
  console.log(findMany);

  //challenge for task
  //find last element from collection by id
  console.log('------users collections-------');
  const getById = await taskCollection.findOne({ _id: ObjectId('649a84aeaed49129e231519b') });
  console.log(getById);
  //fetch all task not completed
  console.log('----task collection---------');
  const fetchNotCompletedTask = await taskCollection.find({ completed: false }).toArray();
  console.log(fetchNotCompletedTask);

  console.log('-------------------update------------------');
  // const updateUserById = await userCollection.updateOne(
  //   { _id: ObjectId('649a8059df841c2576f90e5f') },
  //   {
  //     $inc: {
  //       age: 1,
  //     },
  //   }
  // );
  // console.log(updateUserById);

  // console.log('----update many-------');
  // const updateManyForTask = await taskCollection.updateMany(
  //   { completed: false },
  //   {
  //     $set: {
  //       completed: true,
  //     },
  //   }
  // );
  // console.log(updateManyForTask);

  console.log('-----delete one-----');
  // const deleteOne = await taskCollection.deleteMany({ description: 'task3' });
  // console.log(deleteOne);
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
