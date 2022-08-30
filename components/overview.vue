<script setup>
import {
  getOutsideTemperature,
  getSolarIntensityPercentage,
} from "~~/helpers/tado.helper";

const { me, home, zones, weather, load, isLoading } = useTado();

onMounted(() => {
  setInterval(() => {
    load();
  }, 1000);
});
</script>
<template>
  <div
    class="font-sans antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen place-content-center flex flex-col items-center justify-center p-8 text-sm sm:text-base"
  >
    <div class="grid grid-cols-3 gap-4 md:gap-8 max-w-5xl w-full z-20">
      <div class="flex justify-between items-end col-span-3">
        <div class="spotlight-wrapper">
          <div class="fixed z-10 left-0 right-0 spotlight"></div>
        </div>
      </div>
      <tado-welcome-card
        v-if="me && home && weather"
        :me="me"
        :home="home"
        :weather="weather"
      />
      <tado-zone-card v-for="zone in zones" :key="zone.id" :zone="zone" />
    </div>
  </div>
</template>
<style scoped>
.spotlight {
  background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%);
  filter: blur(20vh);
  height: 50vh;
  bottom: -40vh;
}
.spotlight-wrapper {
  opacity: 0.5;
  transition: opacity 0.4s ease-in;
}
.nuxt-logo:hover ~ .spotlight-wrapper {
  opacity: 0.95;
}
.gradient-border {
  position: relative;
  border-radius: 0.5rem;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  width: 100%;
}
@media (prefers-color-scheme: light) {
  .gradient-border {
    background-color: rgba(255, 255, 255, 0.3);
  }
  .gradient-border::before {
    background: linear-gradient(
      90deg,
      #e2e2e2 0%,
      #e2e2e2 25%,
      #00dc82 50%,
      #36e4da 75%,
      #0047e1 100%
    );
  }
}
@media (prefers-color-scheme: dark) {
  .gradient-border {
    background-color: rgba(20, 20, 20, 0.3);
  }
  .gradient-border::before {
    background: linear-gradient(
      90deg,
      #303030 0%,
      #303030 25%,
      #00dc82 50%,
      #36e4da 75%,
      #0047e1 100%
    );
  }
}
.gradient-border::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
  padding: 2px;
  width: 100%;
  background-size: 400% auto;
  background-position: 0 0;
  opacity: 0.5;
  transition: background-position 0.3s ease-in-out, opacity 0.2s ease-in-out;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
.gradient-border:hover::before {
  background-position: -50% 0;
  opacity: 1;
}
</style>
