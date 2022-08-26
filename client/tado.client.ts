import axios from "axios";
import { AccessToken, ResourceOwnerPassword } from "simple-oauth2";

const EXPIRATION_REFRESH_TOKEN_SECONDS = 300;
const CONFIG = {
  client: {
    id: process.env.NUXT_TADO_CLIENT_ID,
    secret: process.env.NUXT_TADO_CLIENT_SECRET,
  },
  auth: {
    tokenHost: process.env.NUXT_TADO_AUTH_URL,
  },
};
const client = new ResourceOwnerPassword(CONFIG);

export default class TadoClient {
  username: string;
  password: string;
  scope: string;
  accessToken: AccessToken;
  client_id: string;
  client_secret: string;

  constructor(
    username,
    password,
    client_id,
    client_secret,
    scope = "home.user"
  ) {
    if (process.client) {
      throw new Error("tado.client can only be used on the server");
    }
    this.scope = scope;
    this.username = username;
    this.password = password;
    this.client_id = client_id;
    this.client_secret = client_secret;
  }

  async authenticate() {
    const tokenParams = {
      scope: this.scope,
      username: this.username,
      password: this.password,
    };
    try {
      this.accessToken = await client.getToken(tokenParams);
    } catch (e) {
      // console.error(e);
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
    const requestUrl = new URL(url, process.env.NUXT_TADO_API_URL);

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
    const login = `username=${this.username}&password=${this.password}`;
    const resp = await axios(
      `https://acme.tado.com/v1/homes/${home_id}/airComfort?${location}&${login}`
    );
    return resp.data;
  }
}
