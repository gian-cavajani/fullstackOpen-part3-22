const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((res) => {
    // console.log(res);
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const validarNum = (num) => {
  let count = 0;
  num.split("").map((n) => {
    if (n === "-") {
      count++;
    }
  });
  if (count === 0) {
    return parseInt(num);
  }
  return (
    (num[2] === "-" && count === 1) ||
    (num[3] === "-" && count === 1) ||
    count === 0
  );
};
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    unique: true,
    validate: {
      validator: (num) => {
        return validarNum(num);
      },
    },
  },
});
personSchema.set("toJSON", {
  //borra las props __v y __id que mongoDB crea.
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
