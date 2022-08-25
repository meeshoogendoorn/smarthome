type TadoConfig = {
  activeHome: string;
};

export default defineEventHandler(async (event) => {
  const body: TadoConfig = await useBody(event);
  const oldConfig = await useStorage().getItem("cache:tado");
  const config: TadoConfig = oldConfig as TadoConfig;
  Object.keys(body).forEach((key) => {
    if (config.hasOwnProperty(key)) {
      config[key] = body[key];
    }
  });
  await useStorage().setItem("cache:tado", config);
  return config;
});
