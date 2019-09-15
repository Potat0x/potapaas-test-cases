const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/:text', (req, res) => res.send(req.params.text.toLowerCase()));

app.listen(port, () => console.log(`Tolower app listening on port ${port}!`));
