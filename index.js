const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const postgresPort = process.env.POSTGRES_PORT || 5432;

const pgp = require('pg-promise')();
const databaseHost = process.env.POSTGRES_HOST;
const databasePassword = process.env.POSTGRES_PASSWORD;
const db = pgp(`postgres://postgres:${databasePassword}@${databaseHost}:${postgresPort}/postgres`);

app.get('/', (req, res) => res.send('Hello World: nodejs+postgres'));

app.get('/read-iter', (req, res) => {
    return readIter()
        .then(data => {
            console.log('read iter: ' + JSON.stringify(data));
            sendResponse(res, '' + data[0].iter);
        })
        .catch(error => sendResponse(res, 'read iter error: ' + error, 500));
});

app.get('/increment-iter', (req, res) => {
    return updateIter()
        .then(() => sendResponse(res, 'iter incremented'))
        .catch(error => sendResponse(res, 'increment iter error: ' + error, 500));
});

app.get('/init-iter', (req, res) => {
    return createAndInitTestTableIfNotExists()
        .then(() => sendResponse(res, 'test table initialized'))
        .catch(error => sendResponse(res, 'init table error: ' + error, 500));
});

app.listen(port, () => console.log('Example app (nodejs+postgres) listening on port ' + port));

sendResponse = (expressjsResponse, message, httpStatusCode = 200) => {
    console.log(message);
    expressjsResponse.status(httpStatusCode);
    expressjsResponse.send(message);
};

const testTableName = 'hello_world_test_table';

readIter = () => {
    return db.any(`SELECT iter FROM ${testTableName};`);
};

updateIter = () => {
    return db.none(`update ${testTableName} set iter = iter+1;`);
};

createAndInitTestTableIfNotExists = () => {
    return db.none(`create table if not exists ${testTableName}(iter int); 
    insert into ${testTableName}(iter) select 0 where not exists (select 1 from ${testTableName});`);
};
