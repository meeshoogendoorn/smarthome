import { RingApi } from "ring-client-api";
import { readFile, writeFile } from "fs";
import { promisify } from "util";
export default class ringClient {
  refreshToken;
  ringClient;
  location;
  camera;

  constructor() {
    if (this.refreshToken) {
      this.ringClient = new RingApi({
        refreshToken: this.refreshToken,
      });
    } else {
      this.ringClient = new RingApi({
        refreshToken: process.env.RING_REFRESH_TOKEN,
      });
    }

    // this.ringClient.onRefreshTokenUpdated.subscribe(
    //   async ({ newRefreshToken, oldRefreshToken }) => {
    //     // If you are implementing a project that use `ring-client-api`, you should subscribe to onRefreshTokenUpdated and update your config each time it fires an event
    //     // Here is an example using a .env file for configuration
    //     if (!oldRefreshToken) {
    //       return;
    //     }
    //     const currentConfig = await promisify(readFile)("ring.config"),
    //       updatedConfig = currentConfig
    //         .toString()
    //         .replace(oldRefreshToken, newRefreshToken);

    //     await promisify(writeFile)("ring.config", updatedConfig);
    //   }
    // );
  }

  async init() {
    try {
      const currentConfig = await promisify(readFile)("ring.config");
      // if (currentConfig.toString("utf8") !== "") {
      //   this.refreshToken = currentConfig;
      // }
    } catch (e) {}
  }

  async getLocation() {
    const locations = await this.ringClient.getLocations();
    this.location = locations[0];
    return this.location;
  }

  async getCamera() {
    const cameras = await this.ringClient.getCameras();
    this.camera = cameras[0];
    return cameras[0];
  }

  streamCameraNotifications(callback) {
    this.camera.onNewNotification.subscribe(callback);
  }

  async getSnapshot() {
    return await this.camera.getSnapshot();
  }
}
