const RPCLib = require('discord-rpc');

const CLIENT_ID = '1045324934513184798';

class RPC {
    constructor() {
        this.load();
    }

    load() {
        this.initRPC();
        this.assembleClient(1000);
    }

    initRPC() {
        this.activity = {};

        // Buttons
        let buttonOne = { label: 'Listen together', url: 'https://soundcloud.com' };
        let buttonTwo = { label: 'Download SoundCloud Desktop', url: 'https://github.com/NightStrang6r/SoundCloud-Desktop' };

        let buttons = [];
        buttons.push(buttonOne, buttonTwo);
        this.activity.buttons = buttons;

        // Text
        this.activity.details = 'Description';
        this.activity.state = 'State';

        // Images
        this.activity.largeImageKey = 'sc-logo';
        this.activity.smallImageKey = 'play2';

        this.activity.largeImageText = 'SoundCloud Desktop';
        this.activity.smallImageText = 'Listening';

        // Time
        this.activity.startTimestamp = Date.now();

        // Client
        this.handleConnectionError();
        this.client = new RPCLib.Client({ transport: "ipc" });
    }

    assembleClient(timeout = 5000) {
        //this.client.destroy();
        this.client = new RPCLib.Client({ transport: "ipc" });

        this.client.on('ready', () => {
            this.running = true;
            this.client.setActivity(this.activity);
            this.client.transport.socket.on('close', () => {
                this.assembleClient();
            });
        });

        setTimeout(() => this.client.login({ clientId: CLIENT_ID }), timeout);
    };

    handleConnectionError() {
        process.on("unhandledRejection", (e) => {
            if (e.message === "Could not connect") {
                console.log("Crashed! Retrying...");
                this.assembleClient();
            }
        });
    }
}

module.exports = RPC;