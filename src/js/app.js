// GLOBAL VARS
const COUNTRY = "country";
const LEAGUE = "league";
const TEAMS = "teams";
const TEAM = "team";
const SEASON = new Date().getFullYear();

// CREATE AND SELECT ALL ELEMENTS
function ElementCreator(name, side, value, isHidden) {
	/* select html element */
	this.El = document.querySelector(`#${name}-${side}`);
	this.flagEl = document.querySelector(`#${name}-${side} .flag`);
	this.nameEl = document.querySelector(`#${name}-${side} .name`);
	this.selectEl = document.querySelector(`#${name}-${side} .select`);

	/* element properties */
	this.name = name;
	this.side = side;
	this.oldValue = value;
	this.value = value;
	this.isHidden = isHidden;

	/* element methods */
	resetValue = function () {
		this.value = this.oldValue;
	};
}
const countryA = new ElementCreator(COUNTRY, "a", "Country A", false);
const countryB = new ElementCreator(COUNTRY, "b", "Country B", false);
const leagueA = new ElementCreator(LEAGUE, "a", "League A", true);
const leagueB = new ElementCreator(LEAGUE, "b", "League B", true);
const teamsA = new ElementCreator(TEAMS, "a", "Team A", true);
const teamsB = new ElementCreator(TEAMS, "b", "Team B", true);
const teamA = new ElementCreator(TEAM, "a", "Team A", true);
const teamB = new ElementCreator(TEAM, "b", "Team B", true);

// all elements
const elements = [
	countryA,
	countryB,
	leagueA,
	leagueB,
	teamsA,
	teamsB,
	teamA,
	teamB,
];

// show/hide elements
function showHideElements() {
	elements.forEach((element) => {
		if (!element.isHidden) element.El.classList.remove("hide");
		else element.El.classList.add("hide");
	});
}
showHideElements();

// render select menu
function renderCountries(countries) {
	options = countries.map((country) => {
		return `<option value="${country.code}">${country.name}
				</otpion>`;
	});

	countryA.selectEl.innerHTML = `<select name="country-a">
						<option value="">Select a country</option>
						${options.join("")}
					</select>
	`;
	countryB.selectEl.innerHTML = `<select name="country-b">
						<option value="">Select a country</option>
						${options.join("")}
					</select>
	`;

	const selectA = countryA.selectEl.querySelector("select");
	const selectB = countryB.selectEl.querySelector("select");

	selectA.addEventListener("change", (evt) =>
		selectCountry(evt, countryA, countries)
	);
	selectB.addEventListener("change", (evt) => {
		selectCountry(evt, countryB, countries);
	});
}

function selectCountry(evt, countryEl, countries) {
	const countryCode = evt.target.value;
	let countryObj;

	if (!countryCode) {
		countryObj = {
			flag: "./src/images/unknown_country.svg",
			code: "",
			name: `Country ${countryEl.side.toUpperCase()}`,
		};
	} else {
		countryObj = countries.find((country) => country.code == countryCode);
	}

	countryEl.flagEl.style.backgroundImage = `url(${countryObj.flag})`;
	countryEl.nameEl.innerHTML = countryObj.name;

	if (countryCode) renderLeagues(countryEl, countryObj);
	else {
		hideEl(countryEl.side, TEAMS);
		hideEl(countryEl.side, LEAGUE);
	}
}

async function renderLeagues(countryEl, countryObj) {
	hideEl(countryEl.side, TEAMS);

	const leagues = await getLeagues(countryObj.name);

	/* render leagues */
	options = leagues.map(({ league }) => {
		return `<option value="${league.id}">${league.name}
				</otpion>`;
	});

	const leagueEl = elements.find(
		(el) => el.side == countryEl.side && el.name == LEAGUE
	);

	leagueEl.selectEl.innerHTML = `<select name="league-a">
						<option value="">Select a league</option>
						${options.join("")}
					</select>
	`;

	const select = leagueEl.selectEl.querySelector("select");
	select.addEventListener("change", (evt) => {
		selectLeague(evt, leagueEl, leagues);
	});

	resetLeague(leagueEl);

	/* show leagues el */
	showEl(countryEl.side, LEAGUE);
}

function resetLeague(leagueEl) {
	leagueEl.flagEl.style.backgroundImage = `url("./src/images/unknown_country.svg")`;
	leagueEl.nameEl.innerHTML = `League ${leagueEl.side.toUpperCase()}`;
}

function selectLeague(evt, leagueEl, leagues) {
	const leagueId = evt.target.value;
	let leagueObj;

	if (!leagueId) {
		leagueObj = {
			logo: "./src/images/unknown_country.svg",
			code: "",
			name: `League ${leagueEl.side.toUpperCase()}`,
		};
	} else {
		leagueObj = leagues.find(({ league }) => league.id == leagueId).league;
	}

	leagueEl.flagEl.style.backgroundImage = `url(${leagueObj.logo})`;
	leagueEl.nameEl.innerHTML = leagueObj.name;

	if (leagueId) renderTeams(leagueEl, leagueObj);
	else hideEl(leagueEl.side, TEAMS);
}

async function renderTeams(leagueEl, leagueObj) {
	hideEl(leagueEl.side, TEAMS);

	const teams = await getTeams(leagueObj.id);

	/* render leagues */
	options = teams.map(({ team }) => {
		return `<option value="${team.id}">${team.name}
				</otpion>`;
	});

	const teamsEl = elements.find(
		(el) => el.side == leagueEl.side && el.name == TEAMS
	);

	teamsEl.selectEl.innerHTML = `<select name="league-a">
						<option value="">Select a league</option>
						${options.join("")}
					</select>
	`;

	const select = teamsEl.selectEl.querySelector("select");
	select.addEventListener("change", (evt) => {
		selectTeam(evt, teamsEl, teams, leagueObj.id);
	});

	resetTeams(teamsEl);

	/* show leagues el */
	showEl(leagueEl.side, TEAMS);
}

function selectTeam(evt, teamsEl, teams, leagueId) {
	const teamId = evt.target.value;
	let teamObj;

	if (!teamId) {
		teamObj = {
			logo: "./src/images/unknown_country.svg",
			code: "",
			name: `League ${teamsEl.side.toUpperCase()}`,
		};
	} else {
		teamObj = teams.find(({ team }) => team.id == teamId).team;
	}

	teamsEl.flagEl.style.backgroundImage = `url(${teamObj.logo})`;
	teamsEl.nameEl.innerHTML = teamObj.name;

	if (teamId) renderTeam(teamsEl, teamObj, leagueId);
	else hideEl(teamsEl.side, TEAM);
}

async function renderTeam(teamsEl, teamObj, leagueId) {
	const team = await getTeam(leagueId, teamObj.id);
	const players = await getPlayers(leagueId, teamObj.id);
	const standings = await getStandings(leagueId, teamObj.id);

	const player = topScorer(players);

	const teamEl = elements.find(
		(el) => el.side == teamsEl.side && el.name == TEAM
	);

	teamEl.El.innerHTML = `
		<h3>Top Scorer:</h3>
		<div class="player">
			<img src="${player.photo}" alt="${player.name}"/>
			<div class="info">
				<p>${player.name}</p>
				<p>${player.goals} Goals</p>
			</div>
		</div>
	`;

	showEl(teamEl.side, TEAM);
}

function topScorer(players) {
	const top = players.sort((a, b) => {
		return b.statistics[0].goals.total - a.statistics[0].goals.total;
	});

	return {
		photo: top[0].player.photo,
		name: top[0].player.firstname + " " + top[0].player.lastname,
		goals: top[0].statistics[0].goals.total,
	};
}

function resetTeams(teamsEl) {
	teamsEl.flagEl.style.backgroundImage = `url("./src/images/unknown_country.svg")`;
	teamsEl.nameEl.innerHTML = `League ${teamsEl.side.toUpperCase()}`;
}

function hideEl(side, name) {
	const element = elements.find((el) => el.side == side && el.name == name);
	element.isHidden = true;
	showHideElements();
}
function showEl(side, name) {
	const element = elements.find((el) => el.side == side && el.name == name);
	element.isHidden = false;
	showHideElements();
}

/* init app */
async function initCountries() {
	const countries = await getCountries();

	renderCountries(countries);
}
initCountries();
