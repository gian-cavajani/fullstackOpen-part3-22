const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "a",
    number: "39-23-6423122",
  },
];

//--------------GET------------------------------------

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = data.find((p) => p.id === id);
  if (!person) {
    res.status(404).send("404 person not found");
  }
  res.json(person);
});

app.get("/info", (req, res) => {
  const peopleCount = data.length;
  res.send(
    `<p>phonebook has info for ${peopleCount} people</p><p>${new Date()}</p>`
  );
});

//--------------DELETE------------------------------------

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  data = data.filter((p) => p.id !== id);
  res.status(204).send({});
});

//--------------POST------------------------------------

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.number || !body.name) {
    return res.status(400).json({ error: "name or number is missing" }).end();
  }
  if (data.some((p) => p.name.toUpperCase() == body.name.toUpperCase())) {
    return res.status(400).json({ error: "name repeated" }).end();
  }
  const newPerson = {
    id: Math.random() * 100,
    name: body.name,
    number: body.number,
  };

  data = data.concat(newPerson);
  res.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {});
