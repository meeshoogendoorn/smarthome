<script setup>
const props = defineProps({
  img: String,
});
</script>
<template>
  <a
    class="gradient-border cursor-pointer col-span-3 sm:col-span-1 p-4 flex flex-col"
  >
    <img :src="img" />
  </a>
</template>
