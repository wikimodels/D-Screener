import express from "npm:express@4.18.2";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

import { testReport } from "./functions/test.report.ts";

import { listenQueues } from "./functions/kv-utils/kv-listening.ts";
import { ConsoleColors, print } from "./functions/utils/print.ts";

import { TF } from "./models/shared/timeframes.ts";

import { main } from "./main.ts";

const env = await load();

const app = express();

app.get("/", async (req: any, res: any) => {
  try {
    let shit = await testReport();

    res.send(shit);
  } catch (e) {
    console.log(e);
  }
});

app.get("/oi", async (req: any, res: any) => {
  try {
    //const data = testReport();
    const data: any[] = [];

    res.send({ fuck: data.length });
  } catch (e) {
    console.log(e);
  }
});

app.listen(8000, async () => {
  print(ConsoleColors.green, "Server ---> running...");
});

main(TF.h1);
main(TF.m5);
listenQueues();
