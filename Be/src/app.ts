import * as express from "express";
import * as cors from "cors";
import { Worker, isMainThread } from 'worker_threads';

import routerV1 from "./v1";
import connectToMongoDB from "./services/mongo.service";
import { PORT } from './constants';
import { get_sloan } from "./services/postgres.service";
// import { get_token_holders } from "./services/lightApi.service";
import { get_short_stakers } from "./services/sql.service";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// database connection
connectToMongoDB();

// v1 apis
app.use('/api/v1', routerV1);

app.get('/test', async (req, res) => {
  const stakedBalances = await get_sloan('SLOAN', 4);
  res.json(stakedBalances);
})

app.get('/getTokenHolder/:holder', async (req, res) => {
  const tokenHolder = req.params.holder;
  // const data = await get_token_holders('eosio.token', 'XPR');
  const data = await get_short_stakers();
  res.json(data[tokenHolder]);
})

function runThread0() {
  if (isMainThread) {
    const worker = new Worker('./src/threads/updateVotingPower.import.js');
    worker.on('exit', (code) => {
      console.log('worker0 exit')
      if (code !== 0) {
        worker.terminate();
      }
      return worker;
    });
    setInterval(() => worker.postMessage('start'), 300000);
  }
}

function runThread1() {
  if (isMainThread) {
    const worker1 = new Worker('./src/threads/checkUnconfirmedProposals.import.js');
    worker1.on('exit', (code) => {
      console.log('worker1 exit')
      if (code !== 0) {
          worker1.terminate();
      }
      return worker1;
    });
    setInterval(() => worker1.postMessage('start'), 240000);
  }
}

// catch 404 errors
app.use(function (req, res) {
  res.status(404).send('Unable to find the requested resource!');
});

app.listen(PORT, () => {
  console.log(`🚀 App listening on the port ${PORT} 🚀`);
  runThread0();
  runThread1();
});
