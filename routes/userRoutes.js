/* eslint-disable prettier/prettier */
const express = require("express");
const { getAllUsers,
        getUser,
        updateUser,
        deleteUser,
        createUser,
        updateMe,
        deleteMe,
        getMe,
        uploadUserPhoto,
        resizeUserPhoto
    } = require('../controllers/userController');

const { 
  signup,
  login, 
  forgotPassword,
  resetPassword, 
  protect,
  updatePassword,
  restrictTo,
  logout
} = require('../controllers/authController');

// 3) ROUTES

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.post('/signup', signup);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect All Routes Under This Middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);

router.get('/me', getMe, getUser);

router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);

router.delete('/deleteMe', deleteMe);
 
router.use(restrictTo('admin'));

router
  .route("/")
  .get(getAllUsers)
  .post(createUser)

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)



module.exports = router;