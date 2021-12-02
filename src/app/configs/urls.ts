import {environment} from "../../environments/environment";

const baseUrl = environment.API;

export const urls = {
  auth: `${baseUrl}/auth`,
  cars: `${baseUrl}/cars`,
  refresh: `${baseUrl}/refresh`,
  users: `${baseUrl}/users`

}
