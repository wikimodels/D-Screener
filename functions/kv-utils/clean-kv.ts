export async function cleanKv(workspace: string) {
  const kv = await Deno.openKv(workspace);
  const entries = kv.list({ prefix: [] });

  for await (const item of entries) {
    console.log(item.key);
    await kv.delete(item.key);
  }
}
