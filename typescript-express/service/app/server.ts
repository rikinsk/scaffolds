import express from 'express';
import bodyParser from 'body-parser';
import {WelcomeController} from './controllers';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.json());
app.use('/', WelcomeController);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
