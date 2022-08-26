export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  await useStorage().setItem("cache:refresh-token", body);
  return body;
});
