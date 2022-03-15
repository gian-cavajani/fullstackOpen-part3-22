const express = require("express");
const app = express();

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
];

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

const PORT = 3001;
app.listen(PORT, () => {});
