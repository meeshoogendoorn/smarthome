import axios from "axios";
import { AccessToken, ResourceOwnerPassword } from "simple-oauth2";

const EXPIRATION_REFRESH_TOKEN_SECONDS = 300;
const CONFIG = {
  client: {
    id: process.env.TADO_WEB_APP_ID,
    secret: process.env.TADO_SECRET,
  },
  auth: {
    tokenHost: process.env.TADO_AUTH_URL,
  },
};

const tado_username = process.env.TADO_USERNAME;
const tado_password = process.env.TADO_PASSWORD;

const client = new ResourceOwnerPassword(CONFIG);

// no official api documentation! this client is based on a blog post that reverse engineered the api
// https://shkspr.mobi/blog/2019/02/tado-api-guide-updated-for-2019/

// to obtain a client secret for tado api go to the following url: https://app.tado.com/env.js

export default class TadoClient {
  username: string;
  password: string;
  scope: string;
  accessToken: AccessToken;

  constructor(scope = "home.user") {
    this.scope = scope;
  }

  async authenticate() {
    const tokenParams = {
      scope: this.scope,
      username: tado_username,
      password: tado_password,
    };
    try {
      this.accessToken = await client.getToken(tokenParams);
    } catch (e) {
      console.error(e);
    }
  }

  async refreshToken() {
    if (!this.accessToken) {
      await this.authenticate();
      return;
    }

    const isExpired = this.accessToken.expired(
      EXPIRATION_REFRESH_TOKEN_SECONDS
    );
    if (isExpired) {
      try {
        this.accessToken.refresh();
      } catch (e) {
        this.accessToken = null;
        await this.authenticate();
      }
    }
  }

  async request(url, method = "get", data = {}) {
    await this.refreshToken();
    const requestUrl = new URL(url, process.env.TADO_API_URL);

    const request = {
      url: requestUrl.href,
      method,
      data,
      headers: {
        Authorization: `Bearer ${this.accessToken.token.access_token}`,
      },
    };

    if (method.toLowerCase() === "get") {
      delete request.data;
    }

    return await axios.request(request);
  }

  async getMe() {
    const { data } = await this.request("/api/v2/me");
    return data;
  }

  async getHome(home_id) {
    const { data } = await this.request(`/api/v2/homes/${home_id}`);
    return data;
  }

  async getWeather(home_id) {
    const { data } = await this.request(`/api/v2/homes/${home_id}/weather`);
    return data;
  }

  async getZones(home_id) {
    const { data } = await this.request(`/api/v2/homes/${home_id}/zones`);
    return data;
  }

  async getZoneState(home_id, zone_id) {
    const { data } = await this.request(
      `/api/v2/homes/${home_id}/zones/${zone_id}/state`
    );
    return data;
  }

  async getAirComfortDetailed(home_id) {
    const home = await this.getHome(home_id);
    const location = `latitude=${home.geolocation.latitude}&longitude=${home.geolocation.longitude}`;
    const login = `username=${tado_username}&password=${tado_password}`;
    const resp = await axios(
      `https://acme.tado.com/v1/homes/${home_id}/airComfort?${location}&${login}`
    );
    return resp.data;
  }
}
