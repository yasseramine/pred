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
const prediction = {
	self: document.getElementById("#prediction"),
	vsEl: document.getElementById("#prediction").querySelector(".vs"),
	reportEl: document.getElementById("#prediction").querySelector(".report"),
	chartEl: document.getElementById("#prediction").querySelector(".chart"),
};

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
	if (!sideA.value.team || !sideB.value.team) return;

	// show prediction el
	prediction.self.classList.remove("hide");
	prediction.self.innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

	const leagueA_Id = sideA.value.league.id,
		teamA_Id = sideA.value.team.id;
	const leagueB_Id = sideB.value.league.id,
		teamB_Id = sideB.value.team.id;

	const teamA = await getTeam(leagueA_Id, teamA_Id);
	const teamA_Players = await getPlayers(leagueA_Id, teamA_Id);
	const teamA_Standings = await getStandings(leagueA_Id, teamA_Id);

	const teamB = await getTeam(leagueB_Id, teamB_Id);
	const teamB_Players = await getPlayers(leagueB_Id, teamB_Id);
	const teamB_Standings = await getStandings(leagueB_Id, teamB_Id);

	const teamA_TopScorer = topScorer(teamA_Players);
	const teamB_TopScorer = topScorer(teamB_Players);

	// render vs element
	prediction.self.innerHTML = renderVS(sideA.value.team, sideB.value.team);

	// render report
	const teamAObj = {
		name: sideA.value.team.name,
		topScorer: teamA_TopScorer,
		rank: teamA_Standings.rank,
	};
	const teamBObj = {
		name: sideB.value.team.name,
		topScorer: teamB_TopScorer,
		rank: teamB_Standings.rank,
	};
	prediction.self.innerHTML += renderReport(teamAObj, teamBObj);
}
function renderVS(teamA, teamB) {
	teamA_logo = teamA.logo ? teamA.logo : "/src/images/unknown.svg";
	teamB_logo = teamB.logo ? teamB.logo : "/src/images/unknown.svg";

	return `<div class="vs">
				<div class="team team-a">
					<div class="logo">
						<img src="${teamA_logo}" />
					</div>
					${teamA.name}
					<div class="color"></div>
				</div>
				<span>VS.</span>
				<div class="team team-b">
					<div class="logo">
						<img src="${teamB_logo}" />
					</div>
					${teamB.name}
					<div class="color"></div>
				</div>
			</div>
	`;
}
function renderReport(teamA, teamB) {
	teamA_TopScorer_Photo = `background:url('${teamA.topScorer.photo}') center/cover no-repeat`;
	teamB_TopScorer_Photo = `background:url('${teamB.topScorer.photo}') center/cover no-repeat`;

	return `<div class="report">
				<div class="report-header">REPORT</div>
				<div class="teams">
					<div class="team team-a">
						<div class="color"></div>
						${teamA.name}
					</div>
					<div class="team team-b">
						${teamB.name}
						<div class="color"></div>
					</div>
				</div>
				<div class="metrics">
					<div class="metrics-header">Metric</div>
					<div class="data">
						<div class="row">
							<div class="col player">
								<div class="photo" style="${teamA_TopScorer_Photo}"></div>
								<div class="name">${teamA.topScorer.name}</div>
								${teamA.topScorer.goals} Goals
							</div>
							<div class="metric">TOP Scorer</div>
							<div class="col player">
								<div class="photo" style="${teamB_TopScorer_Photo}"></div>
								<div class="name">${teamB.topScorer.name}</div>
								${teamA.topScorer.goals} Goals
							</div>
						</div>
						<div class="row">
							<div class="col rank">#${teamA.rank}</div>
							<div class="metric">Rank</div>
							<div class="col rank">#${teamB.rank}</div>
						</div>
					</div>
				</div>
			</div>`;
}
function renderChart() {
	return `<div class="chart">
				<div class="chart-header">WHO IS BETTER?</div>
				<div class="chart-container"></div>
			</div>`;
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
