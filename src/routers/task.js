const Task = require('../models/task');
const express = require('express');
const routes = new express.Router();
const auth = require('../middleware/auth');

routes.post('/tasks', auth, async (req, res) => {
  console.log(req);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  console.log(task);
  try {
    const data = await task.save();
    await res.status(201).send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

routes.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const data = req.query.sortBy.split(':');
    sort[data[0]] = data[1] === 'desc' ? -1 : 1;
  }

  try {
    //logic for pagination and skip limit will give records depend upon how much data we want and skip will skip that much of data
    //sortedBy=createdAt:dec
    const result = await Task.find({ owner: req.user._id, ...match })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.limit) * parseInt(req.query.skip))
      .sort(sort);

    //////////////////////////////
    // await req.user
    //   .populate({
    //     path: 'tasks',
    //     match,
    //   })
    //   .execPopulate();
    // console.log('31', req.user);
    //////////////////////////////////
    res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.get('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    // const result = await Task.findById(_id);
    const result = await Task.findOne({ _id, owner: req.user._id });
    if (!result) res.status(404).send(result);
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.patch('/tasks/:id', auth, async (req, res) => {
  const taskFelids = ['description', 'completed'];
  const modelKeys = Object.keys(req.body);
  const isValid = modelKeys.every((task) => taskFelids.includes(task));

  if (!isValid) {
    return res.status(400).send({ error: 'invalid task' });
  }

  try {
    const taskData = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    // const taskData = await Task.findById(req.params.id);
    if (!taskData) {
      return res.status(404).send('task not found');
    }
    modelKeys.forEach((el) => (taskData[el] = req.body[el]));
    await taskData.save();
    // const taskData = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.send({ body: taskData, message: 'Successfully updated' });
  } catch (e) {
    res.status(500).send(e);
  }
});

routes.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const owner = req.user._id;
    const data = await Task.findOneAndDelete({ _id, owner });
    if (!data) {
      return res.status(404).send(data);
    }
    res.send({ data: data, message: 'deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = routes;
