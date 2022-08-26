import tadoClient from "~~/client/tado.client";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = new tadoClient(
    config.tado.username,
    config.tado.password,
    config.tado.client_id,
    config.tado.client_secret
  );

  const me = await client.getMe();
  const home = me?.homes[0] ?? null;
  if (!home) {
    throw new Error("No home found");
  }
  const zones = await client.getZones(home.id);
  await Promise.all(
    zones.map(async (zone) => {
      zone.state = await client.getZoneState(home.id, zone.id);
      return zone;
    })
  );

  const weather = await client.getWeather(home.id);

  const airComfortDetailed = await client.getAirComfortDetailed(home.id);

  return {
    me,
    home,
    zones,
    weather,
    airComfortDetailed,
  };
});
