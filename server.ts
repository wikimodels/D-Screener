import express from "npm:express@4.18.2";
import { main } from "./main.ts";
import { TF } from "./models/shared/timeframes.ts";
import { listenQueues } from "./functions/kv-utils/kv-listening.ts";
import { createReport } from "./functions/report/create-report.ts";
import { getAllCoins } from "./functions/utils/get-coins.ts";
const coins = await getAllCoins();
const app = express();
const minorTimeframe = TF.m15;
const majorTimeframe = TF.h1;

app.get("/fucking", async (req: any, res: any) => {
  try {
    console.log(coins);
    let shit = await createReport(minorTimeframe, coins);

    res.send(shit);
  } catch (e) {
    console.log(e);
  }
});

app.post("/fuck", async (req: any, res: any) => {
  try {
    const data = await req.raw(); // Get the raw request body
    const jsonData = JSON.parse(data); // Parse the JSON data
    console.log(jsonData);
    res.send({ fuck: data.length });
  } catch (e) {
    console.log(e);
  }
});

app.listen(8000, () => {
  console.log("%Server ---> running...", "color:green");
  main(majorTimeframe);
  main(minorTimeframe);
  listenQueues();
});
