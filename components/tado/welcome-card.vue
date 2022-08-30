<script setup>
import {
  getOutsideTemperature,
  getSolarIntensityPercentage,
} from "~~/helpers/tado.helper";

const props = defineProps({
  me: Object,
  weather: Object,
  home: Object,
});
</script>
<template>
  <a
    v-if="me"
    href="https://app.tado.com"
    class="col-span-3 rounded p-4 flex flex-col gradient-border"
  >
    <div class="flex justify-between items-center mb-4">
      <h4 v-if="me" class="font-medium text-2xl">Welcome {{ me.name }}</h4>
      <img
        :class="{ 'animate-pulse': isLoading }"
        src="/tado-icon.png"
        alt="Tado Logo"
        width="75"
        height="75"
      />
    </div>
    <p v-if="me" class="mb-2">
      Weather
      <span
        class="bg-gray-100 dark:bg-white/10 rounded font-mono p-1 font-bold"
      >
        {{ home.name }}</span
      >
      currently
      <span
        v-if="weather"
        class="bg-gray-100 dark:bg-white/10 rounded font-mono p-1 font-bold"
        >{{ getOutsideTemperature(weather).value }}°</span
      >
      {{ getOutsideTemperature(weather).format }} degrees outside and
      {{ getSolarIntensityPercentage(weather) }}% solar Intensity.
    </p>
  </a>
</template>
