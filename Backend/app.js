
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');


const restaurantRouter = require('./routes/users1');

const Restaurant = require('./models/RestaurantsUser'); 


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 4001; 


app.use(cors());


app.use(logger('dev'));



app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurantdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); 
  });


app.use('/api/restaurants', restaurantRouter);


app.use('/', indexRouter);
app.use('/users', usersRouter);






app.put('/api/restaurants/:id', async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );
    
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(updatedRestaurant);
  } catch (err) {
    console.error('Error updating restaurant:', err);
    res.status(500).json({ message: 'Failed to update restaurant' });
  }
});


app.delete('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    console.error('Error deleting restaurant:', err);
    res.status(500).json({ message: 'Failed to delete restaurant' });
  }
});


app.get('/api/restaurants/search', async (req, res) => {
  const { query, district } = req.query; 

  let searchConditions = {};

  if (query) {
    searchConditions.$or = [
      { name: { $regex: query, $options: 'i' } },
      { cuisine: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
    ];
  }

  if (district) {
    searchConditions.location = { $regex: district, $options: 'i' };
  }

  try {
    const results = await Restaurant.find(searchConditions);
    res.json(results);
  } catch (err) {
    console.error('Error during search:', err);
    res.status(500).json({ message: 'Failed to search restaurants' });
  }
});


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); 
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1); 
});


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
