export async function cleanKv() {
  const kv = await Deno.openKv();
  const entries = kv.list({ prefix: [] });

  for await (const item of entries) {
    console.log(item.key);
    await kv.delete(item.key);
  }
}
