# MMM-BoschSmartHome
[![dependencies Status](https://status.david-dm.org/gh/jalibu/MMM-BoschSmartHome.svg)](https://david-dm.org/jalibu/MMM-BoschSmartHome)  [![Known Vulnerabilities](https://snyk.io/test/github/jalibu/MMM-BoschSmartHome/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jalibu/MMM-BoschSmartHome?targetFile=package.json)  

A client interface for the Bosch Smart Home System on the [Magic Mirror](https://magicmirror.builders/) platform.
Click here for the Magic Mirror [Forum Thread](https://forum.magicmirror.builders/topic/14347/mmm-bsh-bosch-smart-home/).  

**Note**: This module is a private and inofficial project without any relation to *Robert Bosch Smart Home GmbH*. I do not give any warranty, nor am I responsible for any damage.

Contribution welcome.


## Features
- Support for multiple rooms
- Door-/ Window Contacts
- Room Climate Controls
- Thermostats
- Twinguards
- Visualization of Temperature, Humidity and Purity
- Bosch Home Connect Dishwashers *(experimental!)*
- Philips Hue Bridge
- Languages: English, German *(feel free to contribute)*

## Installing the Module
1) Navigate to the MagicMirror subfolder "modules" and execute the following command  
`git clone https://github.com/jalibu/MMM-BoschSmartHome.git`

2) Install dependencies with the following command  
`npm i`

3) Generate Certificate  
`openssl req -x509 -nodes -days 9999 -newkey rsa:2048 -keyout client-key.pem -out client-cert.pem`  
  Important: Make sure, that you enter at least a valid country code (i.e. DE, FR, US, NL, ...). Otherwise it won't work.

4) Add config entry to MagicMirror/config/config.js
```javascript
{
  module: "MMM-BoschSmartHome",
  position: "top_left",
  config: {
    host: "192.168.0.150", // Bosch Smart Home Bridge's local IP Address
    name: "MMM-BoschSmartHome", // Display name for App
    identifier: "MMM-BoschSmartHome", // Unique Identifier for app
    password: "", // Password for Bosch Smart Home Bridge
    refreshIntervalInSeconds: 60, // Default: 60
    width: "340px",
    displayRoomIcons: false, // Default: false
    hideComponents: {}, // See example below. Default: {}
    airquality: {
      purity: "bar", // one of [tile, bar, donut, none]
      humidity: "bar", // one of [tile, bar, donut, none]
      temperature: "bar", // one of [tile, bar, donut, none]
      preferredTemperatureProvider: "Twinguard", // Twinguard or ClimateControl
      preferredHumidityProvider: "Twinguard" // Twinguard or ClimateControl
    },
    temperatureLevel: {
      displayCurrentTemperature: true, // Default: true
      displayTargetTemperature: true, // Default: true
      forceRowTile: true // Show tile as row, even if there is no target temperature. Default: true
    },
    thermostats: {
      display: false, // Default: true
      displayName: false // Default: false
    }
  }
}
```
You can hide individual components per room. Check sample for possible values:
```javascript
config: {
  hideComponents: {
    "Livingroom": ["temperature", "purity", "humidity"],
    "Bed Room": ["battery", "climateControl", "temperatureLevel", "hue"],
    "Kitchen": ["shutters", "dishwasher", "thermostats"],
    "Dungeon": ["room"] // hides entire room
    }
}
```

5) Important: When the module is started for the first time, a pairing between the MagicMirror and the Bosch Smart Home Bridge is automatically created with the generated certificate. For this to work, you must press the pairing button on the bridge for 5 seconds until it starts flashing. Then startup MagicMirror. This only has to be done once.

### Thanks to
- all testers and supporters.
- [dolanmiu](https://github.com/dolanmiu/MMM-awesome-alexa) for your hints for using TypeScript within MMM modules.
- [holomekc](https://github.com/holomekc/bosch-smart-home-bridge) for your amazing BSHB connector, which is a basic component of this module.
