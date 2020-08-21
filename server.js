/* eslint-disable prettier/prettier */
const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!! SHUTTING DOWN>>>>>>");
  console.log(err.name, err.message);
  process.exit(1);
});


dotenv.config({ path: "./config.env" });
const app = require('./app');

const DB = process.env.DATABASE_CS.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => console.log('DB connection successful!'))
  // .catch(err => console.log(err))
  
  
  // 4) START SERVER
  const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App Running On ${port}...`)
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!! SHUTTING DOWN>>>>>>');
  console.log(err.name, err.message, err)
  server.close(() => {
    process.exit(1);
  })
})












// const testTour = new Tour({
//   name: 'The Park Camper',
//   rating: 4.7,
//   price: 496
// });

// testTour
//   .save()
//   .then(doc => console.log(doc))
//   .catch(err => console.log('Error', err))