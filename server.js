const express = require("express");
const init = require("./js/index");
const app = express();

const PORT = process.env.PORT || 3307;

app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

init();
