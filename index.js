const express = require("express");
const app = express();

require("dotenv").config();

const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const router = require("./routes/router");
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan("dev"));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
