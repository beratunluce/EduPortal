const express = require("express");

const port = 1000;
const app = express();
app.listen(port, () => {
	console.log(`App started on ${port}`);
});
