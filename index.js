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

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

//--------------GET------------------------------------

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => {
      res.status(404).send("404 person not found");
    });
});

app.get("/info", (req, res) => {
  const peopleCount = data.length;
  res.send(
    `<p>phonebook has info for ${peopleCount} people</p><p>${new Date()}</p>`
  );
});

//--------------DELETE------------------------------------

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(res.status(204).send({}))
    .catch((err) => {
      console.log(err);
    });
});

//--------------POST------------------------------------

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.number || !body.name) {
    return res.status(400).json({ error: "name or number is missing" }).end();
  }
  // if (data.some((p) => p.name.toUpperCase() == body.name.toUpperCase())) {
  //   return res.status(400).json({ error: "name repeated" }).end();
  // }
  const newPerson = new Person({
    // id: Math.random() * 100,
    name: body.name,
    number: body.number,
  });
  newPerson.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {});
