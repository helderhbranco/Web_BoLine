var mongoose = require("mongoose");
var Monument = require("../models/Monument");
var Event = require("../models/Event");
var Users = require("../models/User");
var Ticket = require("../models/Ticket");

var ticketsController = {};

ticketsController.create = async function (req, res) {
  console.log(req.body);

  /*
  console.log(req.body.users == "new");
  if ((req.body.users == "new")) {    
    return res.render("error", {
      message: "invalid user",
      error: { status: 123 },
    });
  }
  */


  if (req.body.users == "new") {
    let exist = null;

    await Users.find({ email: req.body.email })
      .exec()
      .then((dbusers) => {
        if (dbusers.length == 0) {
          exist = false;
          return null;
        } else {
          exist = true;
          req.body.users = dbusers[0]._id;
        }
      })
      .catch((err) => {
        //console.error(err);
        //res.status(500).json({ message: "Error on the server." });
        res.render("error", {
          message: "Error on the server.\n" + err + "\n" + err.stack + "\n",
          error: { status: 500 },
        });
      });

    if (!exist) {
      //criar novo user
      const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: "",
        role: "USER",
        status: false,
      });

      // Save the new user
      const savedUser = await user.save();
      req.body.users = savedUser._id;
      console.log("Successfully created a user: ", savedUser);
    }
  }

  //

  var ticket = new Ticket();
  Event.find({ _id: req.body.event })
    .exec()
    .then((dbevents) => {
      if (!dbevents) {
        return res.json("No events found.");
      }
      //console.log(dbevents[0].price);
      ticket.price = dbevents[0].price;
      ticket.event_id = dbevents[0]._id;
      ticket.status = "Active";
      Users.find({ _id: req.body.users })
        .exec()
        .then((dbusers) => {
          if (!dbusers) {
            return res.json("No users found.");
          }
          ticket.user_id = dbusers[0]._id;

          //console.log(ticket);
          Event.find({ _id: req.body.event })
            .exec()
            .then((dbeventes) => {
              if (!dbevents) {
                return res.json("No events found.");
              }
              if (dbeventes[0].instante_capacity < dbeventes[0].capacity) {

                if(req.body.usepoints === "false"){
                Users.findByIdAndUpdate(dbusers[0]._id, { $inc: { points: dbevents[0].price } }).exec()
                }else{
                 if(dbevents[0].price > 50){
                  return res.send("<script>alert('Price is to high to use points'); window.location.href = '/pagina_inicial';</script>")
                }
                 if(req.body.usepoints === "true" && dbusers[0].points >= 50){
                  Users.findByIdAndUpdate(dbusers[0]._id, { $inc: { points: -50 } }).exec()
                  ticket.price = 0;
                }else{
                  return res.send("<script>alert('Not enough points'); window.location.href = '/pagina_inicial';</script>")
                }
                }
                console.log("Price: " + ticket.price);
                //console.log(req.body.usepoints);
                ticket
                  .save()
                  .then((savedTicket) => {
                    Event.findByIdAndUpdate(dbevents[0]._id, { $inc: { instante_capacity: 1 } }).exec()
                    console.log("Successfully created a ticket: ", savedTicket);
                    //res.redirect("/pagina_inicial");
                    res.send("<script>alert('Ticket bought successfully!'); window.location.href = '/pagina_inicial';</script>")
                  })
                  .catch((err) => {
                    console.log(err);
                    //res.redirect("/pagina_inicial");
                    res.send("<script>alert('Error buying ticket!'); window.location.href = '/pagina_inicial';</script>")
                  });
              } else {
                console.log("Event is full");
                //res.redirect("/pagina_inicial");
                res.send("<script>alert('Event is full!'); window.location.href = '/pagina_inicial';</script>")
              }
            });
        });
    });
    
};

ticketsController.showCreate = function (req, res) {
  Event.find({})
    .exec()
    .then((dbevents) => {
      if (!dbevents) {
        return res.json("No events found.");
      }
      Users.find({})
        .exec()
        .then((dbusers) => {
          if (!dbusers) {
            return res.json("No users found.");
          }
          return res.render("../views/buy_ticket", {
            events: dbevents,
            users: dbusers,
          });
        })
        .catch((err) => {
          console.error(err);
          res.json(err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.json(err);
    });
};

module.exports = ticketsController;
