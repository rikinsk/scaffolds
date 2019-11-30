import express from 'express';
import bodyParser from 'body-parser';
import { router } from './router';

const PORT = process.env.PORT || 4000;

const app = new express();

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
