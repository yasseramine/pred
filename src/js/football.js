// GLOBAL VARS
const COUNTRY = "country";
const LEAGUE = "league";
const TEAMS = "teams";
const TEAM = "team";
const SEASON = new Date().getFullYear();

// CREATE AND SELECT ALL ELEMENTS
function SideElementSelector(side) {
	this.side = side;
	this.parentEl = document.querySelector(`#side-${side}`);
	this.countryEl = {
		self: document.querySelector(`#select-country-${side}`),
		selectBtn: document.querySelector(`#select-country-${side} .select-btn`),
		list: document.querySelector(`#select-country-${side} .list`),
		selected: document.querySelector(`#selected-country-${side}`),
		code: "",
		hidden: {
			el: false,
			list: true,
		},
	};
	this.leagueEl = {
		self: document.querySelector(`#select-league-${side}`),
		selectBtn: document.querySelector(`#select-league-${side} .select-btn`),
		list: document.querySelector(`#select-league-${side} .list`),
		selected: document.querySelector(`#selected-league-${side}`),
		code: "",
		hidden: {
			el: true,
			list: true,
		},
	};
	this.teamEl = {
		self: document.querySelector(`#select-team-${side}`),
		selectBtn: document.querySelector(`#select-team-${side} .select-btn`),
		list: document.querySelector(`#select-team-${side} .list`),
		selected: document.querySelector(`#selected-team-${side}`),
		code: "",
		hidden: {
			el: true,
			list: true,
		},
	};
}
const sideA = new SideElementSelector("a");
const sideB = new SideElementSelector("b");

// all elements
const elements = [
	sideA.countryEl,
	sideA.leagueEl,
	sideA.teamEl,
	sideB.countryEl,
	sideB.leagueEl,
	sideB.teamEl,
];

// show/hide elements
function updateElementsVisibility() {
	elements.forEach((el) => {
		if (el.hidden.el) el.self.classList.add("hide");
		else el.self.classList.remove("hide");

		if (el.hidden.list) el.list.classList.add("hide");
		if (!el.hidden.el && !el.hidden.list) el.list.classList.remove("hide");
	});
}
updateElementsVisibility();

// add event listener to select btns
elements.forEach((el) => {
	el.selectBtn.addEventListener("click", () => {
		updateListVisibility(el);
	});
});
// show list
function updateListVisibility(el) {
	elements.forEach((element) => {
		if (element != el) element.hidden.list = true;
	});
	el.hidden.list = !el.hidden.list;
	updateElementsVisibility();
}

// render select menu
function renderCountries(countries) {
	options = countries.map((country, index) => {
		if (country.code)
			return `<div class="item" data-type="country" id="${index}" data-code="${country.code}">
					<img src="${country.flag}" />
					${country.name}
				</div>`;
	});

	sideA.countryEl.list.innerHTML = options.join("");
	sideB.countryEl.list.innerHTML = options.join("");

	sideA.countryEl.list.addEventListener("click", (evt) => {
		selectCountry(evt, sideA, countries);
	});
	sideB.countryEl.list.addEventListener("click", (evt) => {
		selectCountry(evt, sideB, countries);
	});
}

function selectCountry(evt, side, countries) {
	/* hide list */
	side.countryEl.hidden.list = true;
	updateElementsVisibility();

	/* get country obj */
	const countryId = evt.target.id;
	let countryObj = countries[countryId];

	side.countryEl.selected.innerHTML = `
				<div class="item">
					<div class="info">
						<div class="flag" style="background-image:url(${countryObj.flag})"></div>
						${countryObj.name}
						<div class="favourite">
							<i class="fa-regular fa-heart"></i>
							<!-- <i class="fa-solid fa-heart"></i> -->
						</div>
					</div>
				</div>
	`;

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

	const leagueEl = elements.find((el) => el.side == countryEl.side && el.name == LEAGUE);

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

	const teamsEl = elements.find((el) => el.side == leagueEl.side && el.name == TEAMS);

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

	const teamEl = elements.find((el) => el.side == teamsEl.side && el.name == TEAM);

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
