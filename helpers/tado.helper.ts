type Temperature = {
  format: string;
  value: number;
};

export const getOutsideTemperature = (
  weather,
  format = "celsius"
): Temperature => {
  return { format, value: weather?.outsideTemperature[format] || 0 };
};

export const getSolarIntensityPercentage = (weather): number => {
  return weather?.solarIntensity?.percentage || 0;
};

export const getInsideTemperature = (zone, format = "celsius"): Temperature => {
  return {
    format,
    value: zone?.state?.sensorDataPoints?.insideTemperature[format] || 0,
  };
};

export const getHumidityPercentage = (zone): number => {
  return zone.state.sensorDataPoints.humidity.percentage;
};

export const getPowerStateOfZone = (zone): boolean => {
  return zone.state.setting.power === "ON";
};
