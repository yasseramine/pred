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
	this.value = {
		country: undefined,
		league: undefined,
		team: undefined,
	};
	this.countryEl = {
		self: document.querySelector(`#select-country-${side}`),
		selectBtn: document.querySelector(`#select-country-${side} .select-btn`),
		list: document.querySelector(`#select-country-${side} .list`),
		selected: document.querySelector(`#selected-country-${side}`),
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
			return `<div class="item" data-name="${country.name}" data-type="country" id="${index}" data-code="${country.code}">
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
	// if user didn't select a country
	if (evt.target.dataset.type != "country") return;

	/* hide list */
	side.countryEl.hidden.list = true;
	updateElementsVisibility();

	/* get country obj */
	const countryId = evt.target.id;
	let countryObj = countries[countryId];

	const bg = `background:url('${countryObj.flag}') white center/cover no-repeat`;
	side.countryEl.selected.innerHTML = `
				<div class="item">
					<div class="info">
						<div class="flag" style="${bg}"></div>
						${countryObj.name}
						<div class="favourite">
							<i class="fa-regular fa-heart"></i>
							<!-- <i class="fa-solid fa-heart"></i> -->
						</div>
					</div>
				</div>
	`;

	// Save country
	side.value.country = countryObj;

	// reset league
	resetLeague(side);
	// hide teams el
	side.teamEl.hidden.el = true;
	updateElementsVisibility();
	// render leagues
	renderLeagues(side);
}

async function renderLeagues(side) {
	// hide select teams el
	side.teamEl.hidden.el = true;
	updateElementsVisibility();

	// get leagues
	const leagues = await getLeagues(side.value.country.name);

	/* render leagues */
	options = leagues.map(({ league, country }) => {
		return `<div class="item" data-name="${league.name}" data-type="league" id="${league.id}" data-code="${country.code}">
					<img src="${league.logo}" />
					${league.name}
				</div>`;
	});

	side.leagueEl.list.innerHTML = options.join("");
	side.leagueEl.list.removeEventListener("click", (evt) => {
		selectLeague(evt, side, leagues);
	});
	side.leagueEl.list.addEventListener("click", (evt) => {
		selectLeague(evt, side, leagues);
	});

	// unselect league and team
	side.value.league = undefined;
	side.value.team = undefined;

	/* show leagues el */
	side.leagueEl.hidden.el = false;
	updateElementsVisibility();
}

function resetLeague(side) {
	side.leagueEl.selected.innerHTML = `<div class="item">
								<div class="info">
									<div class="flag" style="background:url('/src/images/unknown.svg')"></div>
									League ${side.side.toUpperCase()}
								</div>
							</div>`;
	side.value.league = undefined;
}

function selectLeague(evt, side, leagues) {
	// if user didn't select a league
	if (evt.target.dataset.type != "league") return;

	/* hide list */
	side.leagueEl.hidden.list = true;
	updateElementsVisibility();

	const leagueId = evt.target.id;
	const leagueObj = leagues.find(({ league }) => league.id == leagueId).league;

	const bg = `background:url('${leagueObj.logo}') white center/contain no-repeat`;
	side.leagueEl.selected.innerHTML = `<div class="item">
											<div class="info">
												<div class="flag" style="${bg}"></div>
												${leagueObj.name}
												<div class="favourite">
													<i class="fa-regular fa-heart"></i>
													<!-- <i class="fa-solid fa-heart"></i> -->
												</div>
											</div>
										</div>`;

	// Save league
	side.value.league = leagueObj;

	resetTeam(side);
	renderTeams(side, leagueId);
}

function resetTeam(side) {
	side.teamEl.selected.innerHTML = `<div class="item">
								<div class="info">
									<div class="flag" style="background:url('/src/images/unknown.svg')"></div>
									Team ${side.side.toUpperCase()}
								</div>
							</div>`;
	side.value.team = undefined;
}

async function renderTeams(side, leagueId) {
	// get teams by league id
	const teams = await getTeams(leagueId);

	/* render leagues */
	options = teams.map(({ team }) => {
		return `<div class="item" data-name="${team.name}" data-type="team" id="${team.id}" data-code="${team.code}">
					<img src="${team.logo}" />
					${team.name}
				</div>`;
	});
	side.teamEl.list.innerHTML = options.join("");

	side.teamEl.list.removeEventListener("click", (evt) => {
		selectTeam(evt, side, teams, leagueId);
	});
	side.teamEl.list.addEventListener("click", (evt) => {
		selectTeam(evt, side, teams, leagueId);
	});

	// unselect team
	side.value.team = undefined;

	// remove team from the other list
	// the user can't select the same team twice
	console.log("render teams");
	removeTeamFromList();

	/* show teams el */
	side.teamEl.hidden.el = false;
	updateElementsVisibility();
}

function selectTeam(evt, side, teams, leagueId) {
	// if user didn't select a team
	if (evt.target.dataset.type != "team") return;

	/* hide list */
	side.teamEl.hidden.list = true;
	updateElementsVisibility();

	// get selected team id
	const teamId = evt.target.id;
	const teamObj = teams.find(({ team }) => team.id == teamId).team;

	const bg = `background:url('${teamObj.logo}') white center/contain no-repeat`;
	side.teamEl.selected.innerHTML = `<div class="item">
										<div class="info">
											<div class="flag" style="${bg}"></div>
											${teamObj.name}
											<div class="favourite">
												<i class="fa-regular fa-heart"></i>
												<!-- <i class="fa-solid fa-heart"></i> -->
											</div>
										</div>
									</div>`;

	// save selected team
	side.value.team = teamObj;

	// remove team from the other list
	// the user can't select the same team twice
	removeTeamFromList();

	updatePrediction();
}

function removeTeamFromList() {
	sideB.teamEl.list.childNodes.forEach((node) => {
		if (node.id == sideA.value.team?.id && node.dataset.code == sideA.value.team?.code) {
			node.classList.add("hide");
		} else {
			node.classList.remove("hide");
		}
	});

	sideA.teamEl.list.childNodes.forEach((node) => {
		if (node.id == sideB.value.team?.id && node.dataset.code == sideB.value.team?.code) {
			node.classList.add("hide");
		} else {
			node.classList.remove("hide");
		}
	});
}

async function updatePrediction() {
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

/* init app */
async function initCountries() {
	const countries = await getCountries();

	renderCountries(countries);
}
initCountries();
