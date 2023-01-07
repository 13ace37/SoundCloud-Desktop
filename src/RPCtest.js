const RPC = require('discord-rpc');

class RPCC {
    constructor() {
        process.on("unhandledRejection", (e) => {
            console.log(e.message);
            if (e.message === "Could not connect") {
                console.log("Crashed! Retrying...");
                this.assembleClient();
            }
        });

        this.rpc = {};
        this.rpc.clientId = '1045324934513184798';
        this.initRPC();
        this.assembleClient(1000);
    }

    initRPC() {
        this.rpc.activity = {};

        let buttonOne = { label: 'Listen together', url: 'https://soundcloud.com' };
        let buttonTwo = { label: 'Download SoundCloud Desktop', url: 'https://github.com/NightStrang6r/SoundCloud-Desktop' };

        this.rpc.buttons = [];
        this.rpc.buttons.push(buttonOne, buttonTwo);

        this.rpc.activity.details = 'Description';
        this.rpc.activity.state = 'State';

        this.rpc.activity.largeImageKey = 'sc-logo';
        this.rpc.activity.smallImageKey = 'play2';

        this.rpc.activity.largeImageText = 'SoundCloud Desktop';
        this.rpc.activity.smallImageText = 'Listening';

        this.rpc.activity.buttons = this.rpc.buttons;

        this.rpc.startTimestamp = Date.now();

        this.rpc.client = new RPC.Client({ transport: "ipc" });
    }

    assembleClient(timeout = 5000) {
        //this.rpc.client.destroy();
        this.rpc.client = new RPC.Client({ transport: "ipc" });

        this.rpc.client.on('ready', () => {
            this.rpc.running = true;
            this.rpc.client.setActivity(this.rpc.activity);
            this.rpc.client.transport.socket.on('close', () => {
                this.assembleClient();
            });
        });

        setTimeout(() => this.rpc.client.login({ clientId: this.rpc.clientId }), timeout);
    };
}

let rpc = new RPCC();