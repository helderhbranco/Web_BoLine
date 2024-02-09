/*
    Controller for the User model

    using the mongoose model User
    using the methods from the model to perform the CRUD operations
    using the user route
*/

const User = require("../models/User");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const Monument = require("../models/Monument");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../jwt_secret/config");

const VIEW_FORM_LIST = "users/users_list";
const ROUTE_FORM_LIST = "/users/show";
const VIEW_FORM_SHOW = "users/users_show";
const ROUTE_FORM_SHOW = "/users/show/";
const VIEW_FORM_CREATE = "users/users_create";
const VIEW_FORM_EDIT = "users/users_edit";
const VIEW_FORM_DELETE = "users/users_delete";

var userController = {};

userController.showAll = async function (req, res) {
  User.find({})
    .exec()
    .then((dbusers) => {
      if (!dbusers) {
        //return res.json("No users found.");
        return res.render("error", {
          message: "No users found.",
          error: { status: 404 },
        });
      }
      res.render(VIEW_FORM_LIST, { users: dbusers });
    })
    .catch((err) => {
      //return next(err);
      return res.render("error", {
        message: "Error on the server.",
        error: { status: 500 },
      });
    });
};

userController.show = async function (req, res) {

  // res.render(VIEW_FORM_SHOW, { user: db_user });
    
  let user = new User({})

  await User.findOne({ _id: req.params.id })
    .exec()
    .then((db_user) => {
      if (!db_user) {
        //return res.json("No users found.");
        return res.render("error", {
          message: "No user found.",
          error: { status: 404 },
        });
      }
      user = db_user;
    })
    .catch((err) => {
      //res.status(500).send({ message: "User not found!" });
      return res.render("error", {
        message: "User not found!",
        error: { status: 500 },
      });
    });

    console.log(user);

    let tickets = [];
    await Ticket.find({ user_id: req.params.id })
    .exec()
    .then((db_tickets) => {
      tickets = db_tickets;
    })
    .catch((err) => {
      //res.status(500).send({ message: "Tickets not found!" });
      return res.render("error", {
        message: "Internal server error in find tickets!",
        error: { status: 500 },
      });
    });

    const transformedTickets = [];

    for (const ticket of tickets) {
      const event = await Event.findOne({_id : ticket.event_id}).exec();

      if (!event) {
        return res.render("error", {
          message: "No event found",
          error: { status: 404 },
        });
      }

      const monument = await Monument.findOne({
        place_id: event.monument_id,
      }).exec();

      if (!monument) {
        return res.render("error", {
          message: "No monument found",
          error: { status: 404 },
        });
      }

      const transformedTicket = {
        _id: ticket._id,
        price: ticket.price,
        event: {
          _id: event._id,
          name: event.name,
          description: event.description,
          date: event.date,
          monument: {
            address: {
              street: monument.address.street,
              city: monument.address.city,
              county: monument.address.county,
              postcode: monument.address.postcode,
              country: monument.address.country,
              formatted: monument.address.formatted,
            },
            coordinates: monument.coordinates,
            _id: monument._id,
            name: monument.name,
            place_id: monument.place_id,
            status: monument.status,
          },
          price: event.price,
          date_final: event.date_final,
          event_place_name: event.event_place_name,
        },
        status: ticket.status,
      };

      transformedTickets.push(transformedTicket);
    }

    const ticketsUser = [];
    const ticketMap = {};

    for (const ticket of transformedTickets) {
      if (!ticketMap[ticket.event._id]) {
        // Se o event_id ainda não existir no mapa, crie uma entrada com as informações iniciais
        ticketMap[ticket.event._id] = {
          event: ticket.event,
          qnt: 1,
          total: ticket.price,
        };
      } else {
        // Se o event_id já existir no mapa, atualize as informações
        ticketMap[ticket.event._id].qnt++;
        ticketMap[ticket.event._id].total += ticket.price;
      }
    }

    for (const key in ticketMap) {
      ticketsUser.push(ticketMap[key]);
    }

    console.log(ticketsUser);

    return res.render(VIEW_FORM_SHOW, { user: user, tickets: transformedTickets, compiledTickets: ticketsUser });};

userController.formCreate = function (req, res) {
  return res.render(VIEW_FORM_CREATE);
};

userController.create = async function (req, res) {
  try {
    if (!req.body) {
      //return res.status(400).send({ message: "Content can not be empty!" });
      return res.render("error", {
        message: "Content can not be empty!",
        error: { status: 400 },
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const user = new User({ ...req.body, password: hashedPassword });

    const savedUser = await user.save();
    //return res.status(201).send(savedUser);
    return res.render(VIEW_FORM_SHOW, { user: savedUser , tickets: [], compiledTickets: []});
  } catch (error) {
    console.error(error);
    /*return res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating a create operation",
    });*/
    return res.render("error", {
      message: "Some error occurred while creating a create operation",
      error: { status: 500 },
    });
  }
};

userController.formEdit = function (req, res) {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        /*return res.status(404).send({
          message: `User with id=${userId} not found`,
        });*/
        return res.render("error", {
          message: `User with id=${userId} not found`,
          error: { status: 404 },
        });
      }
      //res.status(200).send(user);
      res.render(VIEW_FORM_EDIT, { user: user });
    })
    .catch((err) => {
      console.log(err);
      //return res.status(500).send("Error to load user data");
      return res.render("error", {
        message: "Error to load user data",
        error: { status: 500 },
      });
    });
};

userController.edit = function (req, res) {
  if (!req.body) {
    return res.render("error", {
      message: "Data to update cannot be empty",
      error: { status: 400 },
    });
  }

  const userId = req.params.id;
  let editedUser = req.body;

  User.findById(userId)
    .then(async (db_user) => {
      if (!db_user) {
        return res.render("error", {
          message: `Cannot update user with id=${userId}. Maybe user was not found!`,
          error: { status: 404 },
        });
      }

      if (req.body.password === "") {
        editedUser.password = db_user.password;
      } else if (
        req.body.password !== "" &&
        !bcrypt.compareSync(req.body.password, db_user.password)
      ) {
        editedUser.password = await bcrypt.hash(req.body.password, 8);
      }

      User.findByIdAndUpdate(userId, editedUser, {
        useFindAndModify: false,
        new: true,
      })
        .then((updatedUser) => {
          if (!updatedUser) {
            return res.render("error", {
              message: `Cannot update user with id=${userId}. Maybe user was not found!`,
              error: { status: 404 },
            });
          }

          console.log(updatedUser);
          res.redirect(ROUTE_FORM_SHOW + userId);
        })
        .catch((err) => {
          console.log(err);
          return res.render("error", {
            message: "Error updating user with id=" + userId,
            error: { status: 500 },
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.render("error", {
        message: "Error loading user data",
        error: { status: 500 },
      });
    });
};

userController.formDelete = function (req, res) {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        /*return res.status(404).send({
          message: `User with id=${userId} not found`,
        });*/
        return res.render("error", {
          message: `User with id=${userId} not found`,
          error: { status: 404 },
        });
      }
      //res.status(200).send(user);
      res.render(VIEW_FORM_DELETE, { user: user });
    })
    .catch((err) => {
      console.log(err);
      //return res.status(500).send("Error to load user data");
      return res.render("error", {
        message: "Error to load user data",
        error: { status: 500 },
      });
    });
};

userController.delete = function (req, res) {
  const userId = req.params.id;

  User.findByIdAndRemove(userId)
    .then((user) => {
      res.send("<script>alert('User deleted successfully'); window.location.href = '/users/show';</script>");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      return res.render("error", {
        message: "Error to delete user data",
        error: { status: 500 },
      });
    });
};

module.exports = userController;
