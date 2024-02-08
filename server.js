const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { User, mongoDB } = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/users', async (req, res) => {
  try {
    
    if (!req.body.name || !req.body.email || !req.body.age) {
      return res.status(400).send({ msg: 'Incomplete data. Please provide name, email, and age.' });
    }

    const existingUser = await User.findOne({ email: req.body.email });



    if (existingUser) {
      return res.status(400).send({ msg: 'Email already exists.' });
    }
   

    if (!isValidEmailFormat(req.body.email)) {
        return res.status(400).send({ msg: 'Invalid email format.' });
      }
   
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      
    });


    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


function isValidEmailFormat(email) {
    return email.includes('@') && email.includes('.');
  }




app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});
  

app.get('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ msg: 'Invalid user ID.' });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send({ msg: 'User not found.' });
      }
  
      res.status(200).send(user);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});
  



app.put('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ msg: 'Invalid user ID.' });
      }


      const user = await User.findByIdAndUpdate(
        userId,
        {
          name: req.body.name,
          email: req.body.email,
          age: req.body.age,
        },
        { new: true, runValidators: true }
      );
  

      if (!user) {
        return res.status(404).send({ msg: 'User not found.' });
      }
  
      res.status(200).send(user);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  



  app.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ msg: 'Invalid user ID.' });
      }
  
      
      const deletedUser = await User.findByIdAndDelete(userId);
  
     
      if (!deletedUser) {
        return res.status(404).send({ msg: 'User not found.' });
      }
  
      res.status(200).send({ msg: 'User deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  