import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import * as cach from '../middleware/cach.js';

import { Auth, Restrict, AuthSession } from '../middleware/auth.js';
import { s3Uupload } from "../middleware/uploadS3.js";


// Post Methods

router.route('/register').post(s3Uupload.single('profilePhoto'), controller.register); // register user
// router.route('/registerMail').post();
router.route('/authenticate').post(AuthSession, (req, res) => res.end());
router.route('/login').post(controller.verifyUser, controller.login);
router.route('/logout').post(controller.logout);


// Get Methods

router.route('/user/profile').get(AuthSession, cach.getProfileFromCach, controller.getProfile).put(AuthSession, controller.updateProfile).delete(AuthSession, controller.deleteProfile) // user with username
router.route('/user/profile-image').get(AuthSession, cach.getProfileImageFromCach, controller.getProfileImage) // user with username
router.route('/users/:username').get(cach.getUserFromCach, controller.getUser) // user with username
router.route('/users').get(cach.getUsersFromCash, controller.getUsers).put(AuthSession, Restrict('admin'), controller.updateUsers).delete(AuthSession, Restrict('admin'), controller.deleteUsers) // user with username

router.route('/generateOTP').get(controller.generateOTP);
router.route('/sendOTP').post(controller.sendOTP);
router.route('/verifyOTP').post(controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);

// Put Methods
router.route('/resetPassword').put(AuthSession, controller.resetPassword);



export default router;