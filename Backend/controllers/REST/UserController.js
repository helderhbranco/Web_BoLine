const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../jwt_secret/config");
const fs = require("fs");
const multer = require("multer");

const User = require("../../models/User");
const Ticket = require("../../models/Ticket");
const Event = require("../../models/Event");
const Monument = require("../../models/Monument");

//#region Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
//#endregion

var restUserController = {};

restUserController.getUser = async function (req, res) {
  let id;
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided." });
  }

  try {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(401).json({ auth: false, message: "Unauthorized" });
      }
      id = decoded.id;
    });

    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ auth: false, message: "User not found" });
    }
    return res.status(200).json({ auth: true, user: user });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error retrieving user", error: err });
  }
};

restUserController.updateUser = async function (req, res) {
  let id;
  let emptyPassword = false;
  const token = req.headers["x-access-token"];

  // Verifica se o token existe
  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided." });
  }

  // Verifica se o body está vazio
  if (!req.body) {
    return res.status(400).json({ message: "User content can not be empty" });
  }

  // Verifica se o password está vazio
  if (!req.body.password) {
    emptyPassword = true;
  }

  // verifica se body tem os campos necessários
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ message: "User content can not be empty" });
  }

  try {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(401).json({ auth: false, message: "Unauthorized" });
      }
      id = decoded.id;
    });

    // Procura o utilizador na BD
    let oldUser = await User.findById(id).exec();
    if (!oldUser) {
      return res.status(404).json({ auth: false, message: "User not found" });
    }

    // se password vazia cria um newUser com a password antiga, se não cria um newUser com a nova password encritada
    let newUser;
    if (emptyPassword) {
      newUser = new User({
        _id: id,
        name: req.body.name || oldUser.name,
        email: req.body.email || oldUser.email,
        password: oldUser.password,
        role: req.body.role || oldUser.role,
        status: req.body.status || oldUser.status,
      });
    } else {
      newUser = new User({
        _id: id,
        name: req.body.name || oldUser.name,
        email: req.body.email || oldUser.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role || oldUser.role,
        status: req.body.status || oldUser.status,
      });
    }

    // Atualiza o utilizador na BD
    let updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: newUser }, // Use $set to update the fields while excluding _id
      { new: true }
    ).exec();
    if (!updatedUser) {
      return res.status(404).json({ auth: false, message: "User not found" });
    }

    return res.status(200).json({ auth: true, user: updatedUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating user", error: err });
  }
};

restUserController.tickets = async function (req, res) {
  let id;
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided." });
  }

  try {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(401).json({ auth: false, message: "Unauthorized" });
      }
      id = decoded.id;
    });
  } catch (err) {
    console.log("1: " + err);
    return res
      .status(500)
      .json({ message: "Error retrieving user", error: err });
  }

  try {
    const tickets = await Ticket.find({ user_id: id }).exec();

    if (!tickets) {
      return res.status(404).json({ message: "No tickets found" });
    }

    const transformedTickets = [];

    for (const ticket of tickets) {
      const event = await Event.findById(ticket.event_id).exec();

      if (!event) {
        return res.status(404).json({ message: "No events found" });
      }

      const monument = await Monument.findOne({
        place_id: event.monument_id,
      }).exec();

      if (!monument) {
        return res.status(404).json({ message: "No monument found" });
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

    //console.log(transformedTickets);
    return res.status(200).json(transformedTickets);
  } catch (err) {
    console.log("2: " + err);
    return res
      .status(500)
      .json({ message: "Error retrieving tickets", error: err });
  }
};

module.exports = restUserController;
