# Smart Home Client 
![Tado Client Example](https://i.ibb.co/BnLcmjw/Screenshot-2022-08-26-at-00-17-01.png "Tado Client")


## TADO
Currently only Tado is supported. 
The Tado Integration currently only supports:

- Reading Home
- Reading Zones
- Reading Current oustide weather
- Reading State of zones (inside temperature, humidity)
- Dynamic Icon based on heating status per zone


### Obtain Client secret from Tado
[Click here](https://app.tado.com/env.js)
and see the env of the tado web app.
There is currently no documentation available about the tado api 
so the client is based on reverse engineering done by [Stephen C Phillips](https://shkspr.mobi/blog/2019/02/tado-api-guide-updated-for-2019/)


# Planned
following integrations are planned:

- Tado Integration read-only
- Loqed (Dutch smart lock)
- Ring doorbell
- Zigbee/Tradfri Smart home lights
- Smart blinds
- TADO control heating
- Airplay streaming to homepod/apple-tv