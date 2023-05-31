import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';
import initializeSocket from './app/socket/index.js'

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.use(router);

const server = http.createServer(app);
initializeSocket(server);

const port = process.env.PORT || 3000;
server.listen(port, 'localhost', () => {
    console.log('Example app listening on port ' + port + '!');
});
