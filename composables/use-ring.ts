import ringClient from "~~/client/ring.client";

export const useRing = async () => {
  const snapshotBuffer = ref(null);
  const ring = new ringClient();
  ring.init();
  await ring.getLocation();
  ring.getCamera();
  ring.streamCameraNotifications(async ({ ding, subtype }) => {
    snapshotBuffer.value = Buffer.from(await ring.getSnapshot()).toString(
      "base64"
    );
  });
  snapshotBuffer.value = Buffer.from(await ring.getSnapshot()).toString(
    "base64"
  );

  return {
    snapshotBuffer,
  };
};
