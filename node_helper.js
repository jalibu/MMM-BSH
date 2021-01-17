const NodeHelper = require("node_helper");
const fs = require("fs");
const BSMB = require("bosch-smart-home-bridge");
const { CanvasRenderService } = require("chartjs-node-canvas");

module.exports = NodeHelper.create({
  cert: null,
  key: null,
  logger: null,
  client: null,
  rooms: null,
  start() {
    this.cert = fs.readFileSync(`${__dirname}/client-cert.pem`).toString();
    this.key = fs.readFileSync(`${__dirname}/client-key.pem`).toString();

    // Override Logger to avoid some annoying logs
    this.logger = new BSMB.DefaultLogger();
    this.logger.fine = () => {};
    this.logger.info = (msg) => {
      if (
        msg.indexOf("Using existing certificate") >= 0 ||
        msg.indexOf("Check if client with identifier") >= 0
      ) {
        return;
      }
      console.info(msg);
    };

    console.log(`${this.name} helper method started...`);
  },

  stop() {
    this.client.unsubscribe();
  },

  async generateClient(config) {
    if (!this.client) {
      try {
        console.log("client wird erstellt");
        const bshb = BSMB.BoschSmartHomeBridgeBuilder.builder()
          .withHost(config.host)
          .withClientCert(this.cert)
          .withClientPrivateKey(this.key)
          .withLogger(this.logger)
          .build();

        await bshb
          .pairIfNeeded(config.name, config.identifier, config.password)
          .toPromise();
        this.client = bshb.getBshcClient();
      } catch (err) {
        console.log(err);
      }
    }
  },

  async loadData() {
    try {
      if (!this.rooms) {
        const {
          parsedResponse: rooms
        } = await this.client.getRooms().toPromise();
        this.rooms = rooms;
      }

      const {
        parsedResponse: services
      } = await this.client.getDevicesServices().toPromise();

      const {
        parsedResponse: devices
      } = await this.client.getDevices().toPromise();

      for (const device of devices) {
        device.services = services.filter(
          (service) => service.deviceId === device.id
        );
      }

      for (const room of this.rooms) {
        room.devices = devices.filter((device) => device.roomId === room.id);
      }
    } catch (err) {
      console.error(err.message);
    }
  },

  async socketNotificationReceived(notification, config) {
    if (notification === "GET_STATUS") {
      if (config.mocked) {
        const data = fs.readFileSync(__dirname + "/debugResponse.json");
        this.rooms = JSON.parse(data);
      } else {
        await this.generateClient(config);
        await this.loadData();

        if (config.debug) {
          fs.writeFileSync(
            __dirname + "/debugResponse.json",
            JSON.stringify(this.rooms)
          );
        }
      }
      this.sendSocketNotification("STATUS_RESULT", this.rooms);
    } else {
      console.warn(`${notification} is invalid notification`);
    }
  }
});
