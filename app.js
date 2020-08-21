const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES

// Serving Static Files
app.use(express.static(`${__dirname}/public`));

// Set security HTTP Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too Many Request from this IP. Please try again in an Hour!'
});
app.use('/api', limiter);

// Body parser ( Reading Data From The Body into req.body)
// app.use(express.json());
// or
app.use(express.json({ limit: '10kb' }));
app.use(
  express.urlencoded({ extended: true, limit: '10kb' })
);
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent query param pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty'
    ]
  })
);

// Test middleWare
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

// Test MiddleWare
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mounting The Router...

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server!`
  // })

  // const err = new Error(
  //   `Can't find ${req.originalUrl} on this server!`
  // );
  // err.status = 'fail';
  // err.statusCode = 404;
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;

// Get All Tours (emit/listen)
// app.get('/api/v1/tours', getAllTours)
// Get single Tour (emit/listen)
// app.get("/api/v1/tours/:id", getSingleTour);
// Create New Tour (emit/listen)
// app.post('/api/v1/tours', createTour)
// Update Existing Tour (emit/listen)
// app.patch('/api/v1/tours/:id', updateTour)
// Delete Tour (emit/listen)
// app.delete("/api/v1/tours/:id", deleteTour)
