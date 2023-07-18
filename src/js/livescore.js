// live matches elemetns
const livematchesEl = document.querySelector(".livematches .matches");
livematchesEl.innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

// matches
let matches = [];

// Function that get local time
function getTimeZone() {
	var offset = new Date().getTimezoneOffset(),
		o = Math.abs(offset);
	return (
		(offset < 0 ? "+" : "-") +
		("00" + Math.floor(o / 60)).slice(-2) +
		":" +
		("00" + (o % 60)).slice(-2)
	);
}

// load intial live scores
async function loadLiveScores() {
	// get fixutures for the last 4 months
	const d = new Date();
	const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	d.setDate(d.getDate());
	const yesterday = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

	const endpoint = `https://apiv3.apifootball.com/?action=get_events
						&from=${yesterday}
						&to=${today}
						&match_live=1
						&APIkey=${api_key}`;

	const response = await fetch(endpoint);
	const data = await response.json();

	return data;
}
async function renderLiveScores() {
	matches = await loadLiveScores();
	renderMatches();
}
renderLiveScores();

// socket
function socketsLive() {
	var socket = new WebSocket(
		"wss://wss.apifootball.com/livescore?Widgetkey=" + api_key + "&timezone=" + getTimeZone()
	);
	socket.onmessage = function (e) {
		if (e.data) {
			updateMatches(JSON.parse(e.data));
		} else {
			console.log("No new data!");
		}
	};
	socket.onclose = function () {
		console.log("connection closed!");
		socket = null;
		setTimeout(socketsLive, 5000);
	};
}
socketsLive();

// update matches
function updateMatches(new_matches) {
	if (matches.length == 0) {
		matches = new_matches;
		return;
	}

	// update matches
	matches = matches.map((match) => {
		if (new_matches.find((m) => m.match_id == match.match_id)) {
			return new_matches.find((m) => m.match_id == match.match_id);
		} else {
			return match;
		}
	});
	// add new matches
	new_matches.forEach((match) => {
		if (!matches.find((m) => m.match_id == match.match_id)) {
			matches.push(match);
		}
	});

	renderMatches();
}

// render matches
function renderMatches() {
	grouped_matches = groupBy(matches, (match) => match.league_name);

	livematchesEl.innerHTML = "";
	for (let [league_name, matches] of grouped_matches) {
		league_name = league_name ? league_name : "";
		let league_logo = matches[0].league_logo;
		if (!league_logo) {
			league_logo = "/src/images/unknown.svg";
		}
		const matchesEl = matches.map((match) => {
			team_away_badge = match.team_away_badge;
			if (!match.team_away_badge) {
				team_away_badge = "/src/images/unknown.svg";
			}
			team_home_badge = match.team_home_badge;
			if (!match.team_home_badge) {
				team_home_badge = "/src/images/unknown.svg";
			}

			return `<div class="match">
                        <div class="result">
                            <div class="home-team">
                                <div class="logo">
									<picture>
										<source srcset="${team_home_badge}" />
										<img src="/src/images/unknown.svg" onerror="onError.call(this)" />
									</picture>
                                </div>
                                <div class="name">${match.match_hometeam_name}</div>
                            </div>
                            <div class="score">${match.match_hometeam_score} - ${match.match_awayteam_score}</div>
                            <div class="away-team">
                                <div class="name">${match.match_awayteam_name}</div>
                                <div class="logo">
									<picture>
										<source srcset="${team_away_badge}" />
										<img src="/src/images/unknown.svg" onerror="onError.call(this)" />
									</picture>
                                </div>
                            </div>
                        </div>
                        <div class="status">${match.match_status}</div>
                    </div>
                            `;
		});
		livematchesEl.innerHTML += `<div class="league-matches">
                                        <div class="league">
                                            <div class="logo">
                                                <img
                                                    src="${league_logo}"
                                                    alt="${league_name}"
                                                />
                                            </div>
                                            <div class="name">${league_name}</div>
                                        </div>
                                        ${matchesEl.join("")}
                                    </div>`;
	}
}

// group by an array
function groupBy(list, keyGetter) {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});
	return map;
}
