import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";

async function loadCSV(filePath: string) {
  let array = [];
  const f = await Deno.open(filePath);
  for await (const obj of readCSVObjects(f)) {
    array.push(obj);
  }
  array = array.map((a) => cleanObject(a));
  f.close();
  return array;
}

function cleanObject(obj: Record<string, string>): Record<string, string> {
  const newObj = {} as Record<string, string>;
  for (const [key, value] of Object.entries(obj)) {
    newObj[key.replace(/\r$/g, "").trim()] = value.replace(/\r$/g, "").trim();
  }
  return newObj;
}

export default loadCSV;
