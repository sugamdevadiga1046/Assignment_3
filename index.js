const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

//MongoDB connection
mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

//User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model('User', userSchema);

//Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

//API endpoints
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    console.log(`Created user ${user._id}`);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//update
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      console.log(`User with ID ${req.params.id} not found`);
      return res.status(404).send('User not found');
    }
    console.log(`Updated user ${user._id}`);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//display
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log(`Retrieved ${users.length} users`);
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

//Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Export for testing
module.exports = app;