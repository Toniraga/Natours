/* eslint-disable prettier/prettier */
const express = require('express');
const {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages
} = require('../controllers/tourController');


const reviewRouter = require('../routes/reviewRoutes')

const {
  protect,
  restrictTo,
} = require('../controllers/authController');

// 3) ROUTES
const router = express.Router();

// router.param('id', checkID)

router.route("/tour-stats").get(getTourStats)

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router
  .route('/monthly-plan/:year')
  .get(
    protect,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  );

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)

router
  .route('/distances/:latlng/unit/:unit')
  .get(getDistances)

 
router
  .route('/')
  .get(getAllTours)
  .post(
    protect,
    restrictTo('admin', 'lead-guide'),
    createTour
  );

router
    .route("/:id")
    .get(getSingleTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), uploadTourImages, resizeTourImages, updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);


module.exports = router