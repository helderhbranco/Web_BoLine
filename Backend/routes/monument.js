var express = require('express');
const monumentController = require('../controllers/MonumentController');
const authController = require('../controllers/AuthController');
var router = express.Router();

router.get('/request/send', authController.verifyTokenAdmin, monumentController.page_req);
router.get('/request/accept', authController.verifyTokenAdmin, monumentController.page_req);
router.post('/request/send', authController.verifyTokenAdmin, monumentController.request_send);
router.post('/request/accept', authController.verifyTokenAdmin, monumentController.request_accept);

router.get("/create", authController.verifyTokenAdmin, monumentController.formCreate);
router.post("/create", authController.verifyTokenAdmin, monumentController.create);

router.get("/list", authController.verifyTokenAdmin, monumentController.list);

router.get("/delete/:id", authController.verifyTokenAdmin, monumentController.formDelete);
router.post('/delete/:id', authController.verifyTokenAdmin, monumentController.delete);

module.exports = router;