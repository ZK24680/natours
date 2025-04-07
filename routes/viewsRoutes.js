const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLogin);

router.get('/', viewsController.getOverview);

router.get('/tours/:slug', viewsController.getTour);

router.get('/login', viewsController.getLoginForm);

module.exports = router;
