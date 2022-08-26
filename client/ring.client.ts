import { RingApi } from "ring-client-api";
import axios from "axios";

export default class ringClient {
  refreshToken;
  ringClient;
  location;
  camera;

  constructor() {
    if (this.refreshToken) {
      this.ringClient = new RingApi({
        refreshToken: this.refreshToken,
        cameraStatusPollingSeconds: 2,
      });
    } else {
      this.ringClient = new RingApi({
        refreshToken: process.env.RING_REFRESH_TOKEN,
        cameraStatusPollingSeconds: 2,
      });
    }

    this.ringClient.onRefreshTokenUpdated.subscribe(
      async ({ newRefreshToken, oldRefreshToken }) => {
        console.log("Refresh Token Updated: ", newRefreshToken);

        // If you are implementing a project that use `ring-client-api`, you should subscribe to onRefreshTokenUpdated and update your config each time it fires an event
        // Here is an example using a .env file for configuration
        if (!oldRefreshToken) {
          return;
        }
        this.refreshToken = newRefreshToken;
        await axios.post("/api/ring-refresh-token", newRefreshToken);
      }
    );
  }

  async init() {
    const { data } = await axios.get("/api/ring-refresh-token");
    this.refreshToken = data;
  }

  async getLocation() {
    const locations = await this.ringClient.getLocations();
    this.location = locations[0];
    return this.location;
  }

  async getCamera() {
    if (!this.location) {
      await this.getLocation();
    }
    this.camera = this.location.cameras[0];
    return this.camera;
  }

  streamCameraNotifications(callback) {
    this.camera.onNewNotification.subscribe(callback);
  }

  async getSnapshot() {
    return await this.camera.getSnapshot();
  }
}
