import * as Device from 'expo-device';
import * as Network from 'expo-network';

export function getIpAddress() {
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

export async function getDeviceDetails()  {

  // try {

    // console.log("*********hit getDeviceDetails *********");
      const ip = await Network.getIpAddressAsync()
      // alert(JSON.stringify(ip));
      const ipAddress = {
        country_code: '',
        country_name: '',
        city: '',
        postal: '',
        latitude: '',
        longitude: '',
        ipv4:  ip,
        deviceType:  getDeviceType(await Device.getDeviceTypeAsync()),
        deviceName: Device.deviceName,
        devicefingerprint: Device.osBuildFingerprint,
        state: ''
    }

    //  alert(JSON.stringify(ipAddress));
     return ipAddress;

    // }
    // catch(Exception) {
    //   console.log("error get device info");
    // }

  }

  function getDeviceType(val:any) {
    switch (val) {
       case 0:
        return ("UNKNOWN");
        case 1:
          return ("PHONE");
        case 2:
          return 'TABLET';
        case 3:
          return 'DESKTOP';
        case 4:
          return 'TV';
        default:
          return 'UNKNOWN';
      }
    }

