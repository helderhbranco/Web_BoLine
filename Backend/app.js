var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerUi = require("swagger-ui-express");
//var swaggerDocument = require('./swagger.json');


// #region Import Routes
  var indexRouter = require("./routes/index");
  var usersRouter = require("./routes/users");
  var authRouter = require("./routes/auth");
  var monumentRouter = require("./routes/monument");
  var eventRouter = require("./routes/event");
  var ticketsRouter = require("./routes/tickets");

  var restAuthRouter = require("./routes/REST/auth");
  var restUserRouter = require("./routes/REST/user");
  var restEventRouter = require("./routes/REST/events");
  var restMonumentRouter = require("./routes/REST/monument");
  var restTicketRouter = require("./routes/REST/ticket");
// #endregion



//#region MongoDB Connection
  var mongoose = require("mongoose");
const restEventController = require("./controllers/REST/EventController");
const router = require("./routes/index");
  mongoose.Promise = global.Promise;
  mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.is6600r.mongodb.net/tp",
      //'mongodb://localhost:27017/monuments',
      { useNewUrlParser: true }
    )
    .then(() => console.log("connection succesful"))
    .catch((err) => console.error(err));
//#endregion

var app = express();

const cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

  res.header(
      'Access-Control-Expose-Headers',
      'x-access-token, x-refresh-token'
  );

  next();
});

// #region View Engine Setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
// #endregion

// #region Routes
  app.use("/", indexRouter);
  app.use("/auth", authRouter)
  app.use("/users", usersRouter);
  app.use("/monument", monumentRouter);
  app.use("/event", eventRouter);
  app.use("/ticket", ticketsRouter);

  app.use("/api/v1/auth", restAuthRouter);
  app.use("/api/v1/user", restUserRouter);
  app.use("/api/v1/event", restEventRouter);
  app.use("/api/v1/monument", restMonumentRouter);
  app.use("/api/v1/ticket", restTicketRouter);
// #endregion

// #region Errors
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
// #endregion

module.exports = app;
