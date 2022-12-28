const mongoose = require("mongoose");

const db = process.env.MONGO_URL;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connected to db `);
  })
  .catch((err) => {
    console.log("error connecting to db", err);
  });
