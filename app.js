const express = require("express");
const app = express();

require("./model/index");

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
