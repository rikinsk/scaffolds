import express from 'express';
import bodyParser from 'body-parser';
import {ActionsController} from './controllers';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 4000;

app.use(bodyParser.json());
app.use('/', ActionsController);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
