import express from 'express';
import bodyParser from 'body-parser';
import { router } from './router';

const app = new express();

app.use(router);
app.use(bodyParser.json());

app.listen(4000, () => {
  console.log(`Listening at ${4000}`);
});