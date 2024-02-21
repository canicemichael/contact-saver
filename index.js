const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnection");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv").config();

const port = process.env.PORT;

connectDb();

const app = express();

// middlewares
app.use(cors()); // used to connect frontend fetching of api to the backend. Should be called first
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.get('/contactPage', async (req, res) => {
  res.render("contact/contact_query");
})
app.use(errorHandler);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
