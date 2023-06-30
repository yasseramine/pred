const URI = "https://v3.football.api-sports.io";

// get all countries
async function getCountries() {
	const endpoint = `${URI}/countries`;
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": "v3.football.api-sports.io",
			"x-rapidapi-key": "768506911489c55337ba6dce3ded28b9",
		},
	};
	const response = await fetch("/data/countries.json");
	const data = await response.json();
	return data.response;
}

// get all leagues by country
async function getLeagues(countryName) {
	const endpoint = `${URI}/leagues
						?country=${countryName}
						&season=${SEASON - 1}`;
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": "v3.football.api-sports.io",
			"x-rapidapi-key": "768506911489c55337ba6dce3ded28b9",
		},
	};
	const response = await fetch("/data/leagues.json");
	const data = await response.json();
	return data.response;
}

// get all teams by league id
async function getTeams(leagueId) {
	const endpoint = `${URI}/teams
						?league=${leagueId}
						&season=${SEASON - 1}`;
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": "v3.football.api-sports.io",
			"x-rapidapi-key": "768506911489c55337ba6dce3ded28b9",
		},
	};
	const response = await fetch("/data/teams.json");
	const data = await response.json();
	return data.response;
}

// get team by league id and team id
async function getTeam(leagueId, teamId) {
	const endpoint = `${URI}/teams/statistics
						?league=${leagueId}
						&season=${SEASON - 1}
						&team=${teamId}`;
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": "v3.football.api-sports.io",
			"x-rapidapi-key": "768506911489c55337ba6dce3ded28b9",
		},
	};
	const local = "/data/team.json";
	const response = await fetch(local);
	const data = await response.json();
	return data.response;
}
// get all team players with stats
async function getPlayers(leagueId, teamId) {
	/* let page = 1;
	let players = [];

	let endpoint = `${URI}/players
						?league=${leagueId}
						&season=${SEASON - 1}
						&team=${teamId}
						&page=${page}`;
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": "v3.football.api-sports.io",
			"x-rapidapi-key": "768506911489c55337ba6dce3ded28b9",
		},
	};
	const response = await fetch(endpoint, options);
	const data = await response.json();

	const totalpages = data.paging.total;
	players = data.response;

	for (page = 2; page <= totalpages; page++) {
		endpoint = `${URI}/players
						?league=${leagueId}
						&season=${SEASON - 1}
						&team=${teamId}
						&page=${page}`;

		const response = await fetch(endpoint, options);
		const data = await response.json();
		players = players.concat(data.response);
	} */
	const local = "/data/players.json";
	const response = await fetch(local);
	const data = await response.json();
	const players = data;

	return players;
}

/* get team standings */
async function getStandings(leagueId, teamId) {
	const endpoint = `${URI}/standings
						?league=${leagueId}
						&season=${SEASON - 1}
						&team=${teamId}`;
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": "v3.football.api-sports.io",
			"x-rapidapi-key": "768506911489c55337ba6dce3ded28b9",
		},
	};
	const local = "/data/standings.json";
	const response = await fetch(local);
	const data = await response.json();

	return data.response[0].league.standings[0][0];
}

/* get fixuters by team id */
async function getFixutures(leagueId, teamId) {
	const endpoint = `${URI}/fixtures
						?league=${leagueId}
						&season=${SEASON - 1}
						&team=${teamId}`;
	const options = {
		method: "GET",
		headers: {
			"x-rapidapi-host": "v3.football.api-sports.io",
			"x-rapidapi-key": "768506911489c55337ba6dce3ded28b9",
		},
	};

	const local = "/data/fixtures.json";
	const response = await fetch(local);
	const data = await response.json();

	return data.response;
}
