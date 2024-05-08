import { ConsoleColors, print } from "../utils/print.ts";

export async function cleanKv() {
  const kv = await Deno.openKv();
  const entries = kv.list({ prefix: [] });
  let counter = 0;
  for await (const item of entries) {
    await kv.delete(item.key).then(() => {
      counter += 1;
    });
  }
  print(ConsoleColors.yellow, `KVDB ---> ${counter} items deleted`);
}
