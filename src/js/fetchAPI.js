const URI = "https://apiv3.apifootball.com/?action=";
const api_key = "dc793d9dad1eb23ea1e9fb02e3b3d43540948658b12021c5db89e77c2f9acc2a";

// get all countries
async function getCountries() {
	const endpoint = `${URI}get_countries&APIkey=${api_key}`;

	const response = await fetch(endpoint);
	const data = await response.json();

	return data;
}

// get all leagues by country
async function getLeagues(country_id) {
	const endpoint = `${URI}get_leagues
						&country_id=${country_id}
						&APIkey=${api_key}`;

	const response = await fetch(endpoint);
	const data = await response.json();

	return data;
}

// get all teams by league id
async function getTeams(league_id) {
	const endpoint = `${URI}get_teams
						&league_id=${league_id}
						&APIkey=${api_key}`;

	const response = await fetch(endpoint);
	const data = await response.json();

	return data;
}

/* get team standings */
async function getStandings(league_id) {
	const endpoint = `${URI}get_standings
						&league_id=${league_id}
						&APIkey=${api_key}`;

	const response = await fetch(endpoint);
	const data = await response.json();

	return data;
}

/* get fixtures */
async function getFixutures(league_id, team_id) {
	// get fixutures for the last 4 months
	const d = new Date();
	const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	d.setMonth(d.getMonth() - 4);
	const start = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

	const endpoint = `${URI}get_events
						&league_id=${league_id}
						&team_id=${team_id}
						&from=${start}
						&to=${today}
						&APIkey=${api_key}`;

	const response = await fetch(endpoint);
	const data = await response.json();

	return data;
}
