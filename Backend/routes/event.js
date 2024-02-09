var express = require('express');
var router = express.Router();
const eventController = require('../controllers/EventController');
const monumentController = require('../controllers/MonumentController');
const authController = require('../controllers/AuthController');



router.post('/create', authController.verifyTokenAdmin, eventController.create);

router.get("/creates", authController.verifyTokenAdmin, monumentController.showAll, (req, res, next) => {

  });

router.get('/show',authController.verifyTokenAdmin, eventController.showAll);

router.get("/delete",authController.verifyTokenAdmin, eventController.getAll);

router.post('/deletes', authController.verifyTokenAdmin, eventController.delete);

 //router.get("/edit", (req, res) => {
   // res.render("edit_event.ejs", locationController.showAllE /*, eventController.getAllE*/);
  //}); 
router.post('/edits', authController.verifyTokenAdmin, eventController.edit);

router.post("/edita", authController.verifyTokenAdmin, eventController.placeholder, (req, res, next) => {

    });

router.get("/edit",authController.verifyTokenAdmin, eventController.getAllE, (req, res, next) => {

    });
module.exports = router;
