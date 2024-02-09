var express = require('express');
var router = express.Router();

const authController = require('../controllers/AuthController');

/* GET home page. */
router.get('/', authController.verifyTokenAdmin, function(req, res, next) {
  res.redirect("/pagina_inicial");
});
router.get("/pagina_inicial", authController.verifyTokenAdmin, (req, res) => {
  res.render("pagina_inicial.ejs");
});

module.exports = router;
