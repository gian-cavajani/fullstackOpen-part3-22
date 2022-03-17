const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const Person = require("./models/person");

const morgan = require("morgan");
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

//--------------GET------------------------------------

//all
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});
//individual
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send("404: person does not exist");
      }
    })
    .catch((err) => {
      next(err);
    });
});
//info
app.get("/info", (req, res) => {
  Person.find({})
    .then((persons) => {
      console.log(persons.length);
      res.send(
        `<p>phonebook has info for ${
          persons.length
        } people</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => next(error));
});

//--------------DELETE------------------------------------

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(res.status(204).send({}))
    .catch((err) => {
      next(err);
    });
});

//--------------POST------------------------------------

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});
//-------------UPDATE--------------------------------------------------------

app.put("/api/persons/:id", (req, res, next) => {
  console.log(req.body);
  const newPerson = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
    .then((updPerson) => {
      res.json(updPerson);
    })
    .catch((error) => next(error));
});
//---------------------------------------------------------------------

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {});
