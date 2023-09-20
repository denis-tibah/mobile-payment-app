import { IpAddress } from "../redux/auth/authSlice"

export async function getIpAddress(): Promise<IpAddress> {
  return new Promise((resolve, reject) => {
    fetch("https://geolocation-db.com/json/")
      .then((response) => response.json())
      .then((json) => resolve(
        Object.fromEntries(
          Object.entries(json).map(([k, v]) => {
            return [k.toLowerCase(), v]
          }))
      ))
      .catch((error) => reject(error))
  })
}
