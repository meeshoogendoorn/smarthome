import ringClient from "~~/client/ring.client";

export const useRing = async () => {
  const snapshotBuffer = ref(null);
  const camera = ref(null);
  const ring = new ringClient();
  await ring.init();
  await ring.getLocation();
  camera.value = await ring.getCamera();

  snapshotBuffer.value = Buffer.from(await ring.getSnapshot()).toString(
    "base64"
  );

  return {
    camera,
    snapshotBuffer,
  };
};
