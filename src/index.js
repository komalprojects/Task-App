const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRoutes = require('./routers/user');
const taskRoutes = require('./routers/task');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

const multer = require('multer');
const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('please upload word'));
    }
    
    cb(undefined, true);
    // cb(new Error('file must be pdf'));
    // cb(undefined, true);
    // cb(undefined, false);
  },
});

//upload is name from form data
app.post('/upload', upload.single('upload'), (req, res) => {
  res.send();
});

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.listen(port, () => {
  console.log('server is running' + port);
});






//add middleware using express

// app.use(auth);

// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('testing middleware');
//   } else {
//     next();
//   }
// });

//middleware for mentainense
// app.use((req, res, next) => {
//   res.status(503).send('Web site on mentainense mode try after some time');
// });



// const myFunction=async()=>{
//   //create token
//   const token=jwt.sign({ _id:'abc123' },'this is my new token',{expiresIn:'7 days'})
//   console.log(token)

//   //verify token
//   const verifyToken=jwt.verify(token,'this is my new token');
//   console.log(verifyToken)
// }

// myFunction()

// const myFu = async () => {
//   const password = 'komal123';
//   const hashPassword = await bcrypt.hash(password, 8);
//   console.log(hashPassword);

//   const isMatch = await bcrypt.compare(password, hashPassword);
//   console.log(isMatch);

// };