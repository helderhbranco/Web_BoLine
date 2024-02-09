const Event = require("../../models/Event");
const User = require("../../models/User");
const Ticket = require("../../models/Ticket");
const jwt = require("jsonwebtoken");
const config = require("../../jwt_secret/config");

const FREE_TICKET = 50;

var restTicketController = {};

restTicketController.buyTicket = async function (req, res) {
    const token = req.headers["x-access-token"];
    let user_id = "";

    let boughtTickets = [];
    let boughtTicketsFree = [];
    let boughtTicketsPaid = [];

    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(401).json({ buy: false, message: "Unauthorized" });
            }
            user_id = decoded.id;
        });
    } else {
        return res.status(403).send({
            buy: false,
            message: "No token provided.",
        });
    }

    const user = await User.findById(user_id).exec();
    console.log(user);
    if (!user) {
        return res.status(404).json({ buy: false, message: "User not found" });
    }

    console.log(req.params);

    const event_id = req.params.event_id;
    var qntTotal = req.params.qntTotal;
    var qntFree = req.params.qntFree;

    if (qntTotal < 0 || qntFree < 0) {
        return res
            .status(400)
            .json({
                buy: false,
                message: "Impossivel buy tickets with negative quantity",
            });
    } else if (qntTotal == 0 && qntFree == 0) {
        return res
            .status(400)
            .json({
                buy: false,
                message: "Impossivel buy tickets with quantity zero",
            });
    } else if (qntTotal < qntFree) {
        return res
            .status(400)
            .json({
                buy: false,
                message: "Impossible to buy tickets with unbalanced quantities",
            });
    }

    if (event_id == null || event_id == undefined) {
        return res.status(400).json({ buy: false, message: "Event id not found" });
    }

    console.log("--------------------")
    console.log("event_id: " + event_id);
    console.log("qntTotal: " + qntTotal);
    console.log("qntFree: " + qntFree);
    console.log("--------------------")

    const event = await Event.findOne({ _id: event_id }).exec();

    // Registar tickets gratuitos
    for(i = 0; i < qntFree; i++){
        if(event.capacity == event.instante_capacity){
            return res
                .status(400)
                .json({ buy: false, message: "Event is full" });
        }
        var ticket = new Ticket();
        ticket.event_id = event_id;
        ticket.user_id = user_id;
        ticket.price = 0;
        ticket.status = "Active";

        await ticket
            .save()
            .then((ticket_db) => {
                console.log(ticket_db);
                boughtTicketsFree.push(ticket_db);
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(500)
                    .json({ buy: false, message: "Internal server error" });
            });
        // decrementar pontos no user na BD
        user.points -= FREE_TICKET;
        await user.save();
        // aumentar instant_capacity no event na BD
        event.instante_capacity++;
        await event.save();
    }

    // Registar tickets pagos
    for(i = 0; i < qntTotal - qntFree; i++){
        if(event.capacity == event.instante_capacity){
            return res
                .status(400)
                .json({ buy: false, message: "Event is full" });
        }
        var ticket = new Ticket();
        ticket.event_id = event_id;
        ticket.user_id = user_id;
        ticket.price = event.price;
        ticket.status = "Active";

        await ticket
            .save()
            .then((ticket_db) => {
                console.log(ticket_db);
                boughtTicketsPaid.push(ticket_db);
            })
            .catch((err) => {
                console.log(err);
                return res
                    .status(500)
                    .json({ buy: false, message: "Internal server error" });
            });
        // incrementar pontos no user na BD
        user.points += event.price;
        await user.save();
        // aumentar instant_capacity no event na BD
        event.instante_capacity++;
        await event.save();
    }

    boughtTickets = boughtTicketsFree.concat(boughtTicketsPaid);

    qntTotal = req.params.qntTotal;
    // percorrer o array de tickets e contar os que têm preço 0
    let freeTickets = 0;
    let paidTickets = 0;
    for (i = 0; i < boughtTickets.length; i++) {
        console.log("Ticket : " + boughtTickets[i].price)
        if (boughtTickets[i].price == 0) {
            freeTickets++;
        } else {
            paidTickets++;
        }
    };

    console.log(boughtTickets);

    console.log("--------------------")
    console.log("freeTickets: " + freeTickets);
    console.log("paidTickets: " + paidTickets);
    console.log("qntTotal: " + qntTotal);
    console.log("--------------------")
    console.log(boughtTickets.length, " | ", boughtTickets == null)
    console.log("[]", " | ", boughtTickets.length == 0)
    console.log(boughtTickets.length, " | ", boughtTickets.length != qntTotal)

    if (
        boughtTickets.length == 0 ||
        boughtTickets == null ||
        boughtTickets.length != qntTotal
    ) {
        console.error("Error on buy tickets");
        return res
            .status(400)
            .json({ buy: false, message: "Error on buy tickets" });
    } else if (freeTickets != qntFree) {
        console.error("Error buying tickets free");
        return res
            .status(400)
            .json({ buy: false, message: "Error buying tickets free" });
    } else if (freeTickets + paidTickets != qntTotal) {
        console.error("Error buying tickets paid");
        return res
            .status(400)
            .json({ buy: false, message: "Error buying tickets paid" });
    } else if (boughtTickets.length < qntTotal && boughtTickets.length > 0) {
        console.error("Not buy total tickets");
        return res
            .status(400)
            .json({ buy: false, message: "Not buy total tickets" });
    }

    console.log(boughtTickets)

    return res
        .status(200)
        .json({ buy: true, message: "Tickets bought", tickets: boughtTickets });
};

restTicketController.freeTickets = async function (req, res) {
    const token = req.headers["x-access-token"];
    let user_id = "";

    let numberTicketFree = 0;

    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(401).json({ buy: false, message: "Unauthorized" });
            }
            user_id = decoded.id;
        });
    } else {
        return res.status(403).send({
            buy: false,
            message: "No token provided.",
        });
    }

    const user = await User.findById(user_id).exec();
    console.log(user);
    if (!user) {
        return res.status(404).json({ buy: false, message: "User not found" });
    }

    console.log(req.params)

    const event_id = req.params.event_id;
    const qnt = req.params.qnt;

    try {
        for (let idx = 0; idx < qnt; idx++) {
            const event = await Event.findOne({ _id: event_id }).exec();

            if (event.instante_capacity < event.capacity) {
                if ((event.price <= FREE_TICKET) && (user.points >= FREE_TICKET)) {
                    numberTicketFree++;
                    user.points -= FREE_TICKET;
                } else {
                    return res.status(200).json({ number: numberTicketFree });
                }
            } else {
                return res.status(200).json({ number: numberTicketFree });
            }
        }

        return res.status(200).json({ number: numberTicketFree });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ buy: false, message: "Internal server error" });
    }
};

module.exports = restTicketController;
