const mysql = require('mysql');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mysqlPort = process.env.MYSQL_PORT || 3306;

const databaseHost = process.env.MYSQL_HOST;
const databasePassword = process.env.MYSQL_PASSWORD;

const connection = mysql.createConnection({
    host: databaseHost,
    port: mysqlPort,
    user: 'root',
    password: databasePassword,
    database: 'mysql'
});

connection.connect();

app.get('/', (req, res) => res.send('Hello World: nodejs+mysql'));

app.get('/read-iter', (req, res) => {
    const onSuccess = data => {
        console.log('read iter: ' + JSON.stringify(data));
        sendResponse(res, '' + data[0].iter);
    };
    const onError = error => sendResponse(res, 'read iter error: ' + error, 500);
    readIter(onSuccess, onError);
});

app.get('/increment-iter', (req, res) => {
    const onSuccess = () => sendResponse(res, 'iter incremented');
    const onError = error => sendResponse(res, 'increment iter error: ' + error, 500);
    updateIter(onSuccess, onError);
});

app.get('/init-iter', (req, res) => {
    return createAndInitTestTableIfNotExists(
        () => sendResponse(res, 'test table initialized'),
        error => sendResponse(res, 'init table error: ' + error, 500)
    );
});

app.listen(port, () => console.log('Example app (nodejs+mysql) listening on port ' + port));

sendResponse = (expressjsResponse, message, httpStatusCode = 200) => {
    console.log(message);
    expressjsResponse.status(httpStatusCode);
    expressjsResponse.send(message);
};

const testTableName = 'hello_world_test_table';

readIter = (onSuccess, onError) => {
    return connection.query(`SELECT iter FROM ${testTableName};`,
        (error, results, fields) => {
            if (results == undefined) {
                onError(error);
                return;
            }
            onSuccess(results);
        });
};

updateIter = (onSuccess, onError) => {
    return connection.query(`update ${testTableName} set iter = iter+1;`,
        (error, results, fields) => {
            if (results == undefined) {
                onError(error);
                return;
            }
            onSuccess();
        });
};

createAndInitTestTableIfNotExists = (onSuccess, onError) => {
    connection.query(`create table if not exists ${testTableName}(iter int);`);
    connection.query(`insert into ${testTableName} (iter) select 0 where not exists(select 1 from ${testTableName}); `,
        (error, results, fields) => {
            if (results == undefined) {
                onError(error);
                return;
            }
            onSuccess();
        });
};
