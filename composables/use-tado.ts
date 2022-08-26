export const useTado = () => {
  const isLoading = ref(false);
  const me = ref(null);
  const home = ref(null);
  const zones = ref(null);
  const weather = ref(null);
  const airComfortDetailed = ref(null);

  const load = async () => {
    isLoading.value = true;
    try {
      const { data } = await useFetch("/api/tado");
      me.value = data.value.me;
      home.value = data.value.home;
      zones.value = data.value.zones;
      weather.value = data.value.weather;
      airComfortDetailed.value = data.value.airComfortDetailed;
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    }
  };

  return {
    isLoading,
    load,
    me,
    home,
    zones,
    weather,
    airComfortDetailed,
  };
};
