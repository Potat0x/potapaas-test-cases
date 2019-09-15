const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/:text', (req, res) => res.send(req.params.text.toUpperCase()));

app.listen(port, () => console.log(`Toupper app listening on port ${port}!`));
