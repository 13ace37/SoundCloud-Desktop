const { auto, exportGeneratedCSS, setFetchMethod } = require("darkreader");
const { ipcRenderer } = require("electron");

ipcRenderer.on("inject-darkreader", async (event, data) => {
	setFetchMethod(window.fetch);
	auto();
});

const API = {};

const convertTimeToString = x => {

	let split = x.split(":");
	return Number(split[0] || 0) * 60 + Number(split[1]);

}

ipcRenderer.on("start-discord-rpc", async (event, data) => {


	const fetchPlayerData = () => {

		API.PlayerData = {
			timer: {
				passed: convertTimeToString(document.getElementsByClassName("playbackTimeline__timePassed")[0].childNodes[1].innerText),
				duration: convertTimeToString(document.getElementsByClassName("playbackTimeline__duration")[0].childNodes[1].innerText),
			},
			song: {
				artist: document.getElementsByClassName("playbackSoundBadge__lightLink")[0].innerText,
				title: document.getElementsByClassName("playbackSoundBadge__titleLink")[0].childNodes[2].innerText,
			},
			status: document.getElementsByClassName("playControls__play")[0].classList.contains("playing") ? "playing" : "paused",
		}

	}
	// fetchPlayerData();
	window.setInterval(fetchPlayerData, 1000);

	const DiscordRPC = require("discord-rpc");
	const RPC = new DiscordRPC.Client({ transport: 'ipc' });
	RPC.login({ clientId: "486596773260034048" });

	// console.log(RPC);


	const updateDiscordRPC = async () => {

		await RPC.setActivity({
			state: API.PlayerData.song.artist,
			details: API.PlayerData.song.title,
			instance: !1,
			largeImageKey: "logo",
			largeImageText: "ace's SoundCloud-Desktop fork",
			smallImageKey: API.PlayerData.status,
			smallImageText: API.PlayerData.status,
			startTimestamp: Date.now() - (API.PlayerData.timer.passed * 1000),
			endTimestamp: Date.now() + ((API.PlayerData.timer.duration - API.PlayerData.timer.passed) * 1000),
		});

		window.setTimeout(updateDiscordRPC, 1000);

	}

	RPC.on("ready", () => window.setTimeout(updateDiscordRPC, 1000));


});





