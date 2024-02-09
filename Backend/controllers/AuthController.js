const User = require('../models/User.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../jwt_secret/config");

const ROUTE_FORM_LOGIN = "/auth/login";
const VIEW_FORM_LOGIN = "auth/login";
const ROUTE_FORM_REGISTER = "/auth/register";
const VIEW_FORM_REGISTER = "auth/register";
const PAGINA_INICIAL = "/pagina_inicial";

var authController = {};

authController.loginForm = function (req, res) {
  res.render(VIEW_FORM_LOGIN, { message: "" });
};

authController.login = async function (req, res) {
  try {
    /* Pesquisa USER*/
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      //return res.status(404).send("No user found.");
      res.render(VIEW_FORM_LOGIN, {
        message: "User not found.",
      });
    }

    /* Verifica se user está ativo */
    if (!user.status) {
      //res.status(401).send("User is not active.");
      res.render(VIEW_FORM_LOGIN, {
        message: "User not registed.",
      });
    }

    if(user.role != "ADMIN"){
      res.send("<script>alert('Não tem permições de administrador!'); window.location.href = 'http://localhost:4200/home';</script>");
    }

    /* Verifica se as passwords correspondem */
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      //return res.status(401).send({ auth: false, token: null });
      res.render(VIEW_FORM_LOGIN, {
        message: "Password is not valid.",
      });
    }

    /* Cria token */
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400,
    });

    /* Guardar o token nos cookies */
    res.cookie("auth-token", token, { httpOnly: true, maxAge: 86400 * 1000 });

    console.log("User logged in successfully!");
    console.log("Token: " + token);

    res.redirect(PAGINA_INICIAL);
  } catch (err) {
    //res.status(500).send("Error on the server.");
    res.render("error", {
      message: "Error on the server.",
      error: { status: 500 },
    });
  }
};

authController.logout = function (req, res, next) {
  res.clearCookie("auth-token");
  res.redirect(PAGINA_INICIAL);
};

authController.registerForm = function (req, res) {
  res.render(VIEW_FORM_REGISTER, { message: "" });
};

authController.register = async function (req, res) {
  let updateUser = false;

  await User.findOne({ email: req.body.email })
    .then(function (user) {
      if (user && user.status == true) {
        return res.render(VIEW_FORM_REGISTER, {
          message: "User already exists.",
        });
      }

      var hashedPassword = bcrypt.hashSync(req.body.password, 8);

      if (user && user.status == false) {
        User.findByIdAndUpdate(
          user._id,
          {
            name: req.body.name || "",
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || "USER",
            status: req.body.status || true,
          },
          { new: true }
        )
          .then(function (user) {
            return res.send('<script>alert("User registed successfully!");window.location.href = "/pagina_inicial";</script>')
            //res.redirect(PAGINA_INICIAL);
          })
          .catch(function (err) {
            //return res.status(500).json(err);
            console.log(err);
            return res.render("error", {
              message: "Error on the server.",
              error: { status: 500 },
            });
          });
          updateUser = true;
        }
    })
    .catch(function (err) {
      //return res.status(500).json(err);
      console.log(err);
      return res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      });
    });

  console.log("User updated? " + updateUser);
  if (updateUser) {
    return res.redirect(PAGINA_INICIAL);
  }

  // Encriptar password
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  // Criar user
  User.create({
    name: req.body.name || "",
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role || "USER",
    status: req.body.status || true,
  })
    .then(function (user) {
      return res.send('<script>alert("User registed successfully!");window.location.href = "/pagina_inicial";</script>')
      //res.redirect(PAGINA_INICIAL);
    })
    .catch(function (err) {
      console.log(err);
      //return res.status(500).json(err);
      return res.render("error", {
        message: "Error on the server. x",
        error: { status: 500 },
      });
    });
};

authController.verifyToken = function (req, res, next) {
  /* Verifica o header para token */
  const authToken = req.cookies["auth-token"];
  if (authToken) {
    jwt.verify(authToken, config.secret, function (err, decoded) {
      req.userEmail = decoded;
      next();
    });
  } else {
    res.redirect(ROUTE_FORM_LOGIN);
  }
};

authController.verifyTokenAdmin = async function (req, res, next) {
  /* Verifica o header para token */
  const authToken = req.cookies["auth-token"];
  if (!authToken) {
    return res.redirect(ROUTE_FORM_LOGIN);
  }

  /* Verifica secret e valida exp */
  jwt.verify(authToken, config.secret, function (err, decoded) {
    if (err)
      res.render("error", {
        message: "Failed to authenticate token.",
        error: { status: 400 },
      });

    /* Verifica se o User é ADMIN */
     User.findOne({ _id: decoded.id })
      .exec()
      .then((db_user) => {
        if (db_user.role !== "ADMIN") {
         return res.redirect(ROUTE_FORM_LOGIN);
        }

        /* Guarda o pedido para uso em outras rotas */
        req.userId = decoded.id;
        next();
      })
      .catch((err) => {
        res.render("error", {
          message: "User not found!",
          error: { status: 500 },
        });
      });
  });
};

module.exports = authController;
