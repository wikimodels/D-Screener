export async function cleanKv() {
  const kv = await Deno.openKv();
  const entries = kv.list({ prefix: [] });
  let counter = 0;
  for await (const item of entries) {
    await kv.delete(item.key).then(() => {
      counter += 1;
    });
  }
  console.log(`%cKVDB ---> ${counter} items deleted`, "color: yellow");
}
