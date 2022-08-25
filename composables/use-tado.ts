import axios from "axios";

type Me = {
  id: string;
  name: string;
  email: string;
  username: string;
  homes: Home[];
  locale: string;
  mobileDevices: MobileDevice[];
};

type Home = {
  id: string;
  name: string;
};

type MobileDevice = {
  name: string;
  id: number;
  settings: object;
  location: object;
  deviceMetaData: object;
};

type Zone = {
  id: string;
  name: string;
  dateCreated: string;
  deviceTypes: string[];
  devices: [];
  reportAvailable: boolean;
  showScheduleSetup: boolean;
  supportsDazzle: boolean;
  dazzleMode: DazzleMode;
  openWindowDetection: OpenWindowDetection;
};

type DazzleMode = {
  supported: boolean;
  enabled: boolean;
};

type OpenWindowDetection = {
  supported: boolean;
  enabled: boolean;
  timeoutInSeconds: number;
};

export default function (tadoClient) {
  const isLoading = ref(false);
  const _activeHome = useState<string>("tado-active-home", () => null);

  const init = async () => {
    const config = await $fetch("/api/tado");
    _activeHome.value = config.activeHome;
  };

  // loading state of tado

  // current profile used to connect with tado
  const _me = useState("tado-me", () => null);
  const _homes = useState("tado-homes", () => []);
  const setMe = (value: Me) => {
    _me.value = value;
  };
  const me = computed({
    get: (): Me => {
      return _me.value;
    },
    set: (value: Me) => {
      setMe(value);
    },
  });
  const setHomes = (value: Home[]): void => {
    _homes.value = value;
  };
  const homes = computed({
    get: (): Home[] => {
      return _homes.value;
    },
    set: (value: Home[]): void => {
      setHomes(value);
    },
  });
  const loadMe = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const data = await tadoClient.getMe();
      me.value = data;
      homes.value = data?.homes ?? [];
      if (data.homes.length === 1) {
        activeHome.value = data.homes[0];
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    }
  };

  // home to load data from in tado
  const setActiveHome = async (homeId: string): Promise<void> => {
    _activeHome.value = homeId;
    await axios.post("http://localhost:3000/api/tado", { activeHome: homeId });
  };
  const activeHome = computed({
    get: (): Home => {
      return homes.value.find((home) => home.id === _activeHome.value);
    },
    set: async (home: Home): Promise<void> => {
      _activeHome.value = home.id;
      await setActiveHome(home.id);
    },
  });

  const zones = ref(null);
  const loadZones = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const data = await tadoClient.getZones(activeHome.value.id);
      await Promise.all(
        data.map(async (zone) => {
          zone.state = await tadoClient.getZoneState(
            activeHome.value.id,
            zone.id
          );
          return zone;
        })
      );
      zones.value = data;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const weather = ref(null);
  const loadWeather = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const data = await tadoClient.getWeather(activeHome.value.id);
      weather.value = data;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const airComfort = ref(null);
  const loadAirComfort = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const data = await tadoClient.getAirComfortDetailed(activeHome.value.id);
      airComfort.value = data;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    init,
    me,
    loadMe,
    homes,
    activeHome,
    zones,
    loadZones,
    weather,
    loadWeather,
    airComfort,
    loadAirComfort,
    isLoading,
  };
}
