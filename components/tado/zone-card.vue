<script setup>
import {
  getInsideTemperature,
  getHumidityPercentage,
  getPowerStateOfZone,
} from "~~/helpers/tado.helper";
const props = defineProps({
  zone: Object,
});
</script>
<template>
  <a
    class="gradient-border cursor-pointer col-span-3 sm:col-span-1 p-4 flex flex-col"
  >
    <svg
      class="text-red"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="icegradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2980B9" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
        <linearGradient id="firegradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#DA1F05" />
          <stop offset="100%" stop-color="#FE650D" />
        </linearGradient>
      </defs>
      <path
        :class="{
          'fire-path': getPowerStateOfZone(zone),
          'ice-path': !getPowerStateOfZone(zone),
        }"
        d="M29.4284 31.095C26.9278 33.5955 23.5364 35.0003 20.0001 35.0003C16.4637 35.0003 13.0723 33.5955 10.5717 31.095C8.07118 28.5944 6.66638 25.203 6.66638 21.6667C6.66638 18.1304 8.07118 14.7389 10.5717 12.2383C10.5717 12.2383 11.6667 15 15.0001 16.6667C15.0001 13.3333 15.8334 8.33333 19.9767 5C23.3334 8.33333 26.8167 9.62833 29.4267 12.2383C30.667 13.475 31.6506 14.9446 32.321 16.5626C32.9915 18.1806 33.3355 19.9152 33.3334 21.6667C33.3357 23.418 32.9919 25.1525 32.3218 26.7705C31.6516 28.3886 30.6683 29.8582 29.4284 31.095V31.095Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
      <path
        :class="{
          'fire-path': getPowerStateOfZone(zone),
          'ice-path': !getPowerStateOfZone(zone),
        }"
        d="M16.465 26.8683C17.0456 27.4491 17.7604 27.878 18.5462 28.1169C19.3319 28.3559 20.1644 28.3976 20.9701 28.2385C21.7758 28.0793 22.5299 27.7241 23.1657 27.2043C23.8015 26.6845 24.2995 26.016 24.6157 25.2581C24.9318 24.5001 25.0564 23.6759 24.9784 22.8584C24.9004 22.0408 24.6222 21.2551 24.1684 20.5705C23.7146 19.886 23.0992 19.3238 22.3766 18.9336C21.6539 18.5434 20.8463 18.3373 20.025 18.3333L18.3333 23.3333H15C15 24.6133 15.4883 25.8933 16.465 26.8683Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
    <h5 class="font-semibold text-xl mt-4 text-white">
      {{ zone.name }}
      <span class="flex flex-row py-2">
        <img
          v-if="getInsideTemperature(zone).value > 20"
          src="/temperature-hot.svg"
          class="mx-2"
          width="25"
          height="25"
        />
        <img
          v-else
          src="/temperature-cold.svg"
          class="mx-2"
          width="25"
          height="25"
        />
        {{ getInsideTemperature(zone).value }}
      </span>
      <span class="flex flex-row py-2">
        <img src="/humidity.svg" class="mx-2" width="25" height="25" />

        {{ getHumidityPercentage(zone) }}%
      </span>
    </h5>
  </a>
</template>
<style scoped>
.fire-path {
  fill: url(#firegradient);
}

.ice-path {
  fill: url(#icegradient);
}
</style>
