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
	const options = countries.map((country, index) => {
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

	// minimize country flags
	minimizeFlags("country");

	// hide report
	prediction.self.classList.add("hide");

	// render leagues
	renderLeagues(side);
}

function minimizeFlags(item) {
	const country_a_flag = sideA.countryEl.selected.querySelector(".flag");
	const country_b_flag = sideB.countryEl.selected.querySelector(".flag");
	const league_a_flag = sideA.leagueEl.selected.querySelector(".flag");
	const league_b_flag = sideB.leagueEl.selected.querySelector(".flag");

	switch (item) {
		case "country":
			if (!sideA.value.country || !sideB.value.country) break;
			country_a_flag.classList.add("minimize");
			country_a_flag.nextElementSibling.classList.add("minimize");
			country_b_flag.classList.add("minimize");
			country_b_flag.nextElementSibling.classList.add("minimize");
		case "league":
			if (!sideA.value.league || !sideB.value.league) break;
			league_a_flag.classList.add("minimize");
			league_a_flag.nextElementSibling.classList.add("minimize");
			league_b_flag.classList.add("minimize");
			league_b_flag.nextElementSibling.classList.add("minimize");
		default:
			break;
	}
}

async function renderLeagues(side) {
	// hide select teams el
	side.teamEl.hidden.el = true;
	updateElementsVisibility();

	// get leagues
	const leagues = await getLeagues(side.value.country.name);
	if (!leagues) {
		return;
	}

	/* render leagues */
	const options = leagues.map(({ league, country }) => {
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

	// minimize league flags
	minimizeFlags("league");

	// hide report
	prediction.self.classList.add("hide");

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
	if (!teams) {
		return;
	}

	/* render leagues */
	const options = teams.map(({ team }) => {
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
	if (!teamA) return;
	const teamA_Players = await getPlayers(leagueA_Id, teamA_Id);
	if (!teamA_Players) return;
	const teamA_Standings = await getStandings(leagueA_Id, teamA_Id);
	if (!teamA_Standings) return;
	const teamA_fixtures = await getFixutures(leagueA_Id, teamA_Id);
	if (!teamA_fixtures) return;

	const teamB = await getTeam(leagueB_Id, teamB_Id);
	if (!teamB) return;
	const teamB_Players = await getPlayers(leagueB_Id, teamB_Id);
	if (!teamB_Players) return;
	const teamB_Standings = await getStandings(leagueB_Id, teamB_Id);
	if (!teamB_Standings) return;
	const teamB_fixtures = await getFixutures(leagueB_Id, teamB_Id);
	if (!teamB_fixtures) return;

	const teamA_TopScorer = topScorer(teamA_Players);
	const teamB_TopScorer = topScorer(teamB_Players);

	const teamA_Last_5_matches = last_5_matches(teamA_fixtures, teamA_Id);
	const teamB_Last_5_matches = last_5_matches(teamB_fixtures, teamB_Id);

	// render report
	const teamAObj = {
		name: sideA.value.team.name,
		topScorer: teamA_TopScorer,
		rank: teamA_Standings.rank,
		wins: teamA.fixtures.wins.total,
		draws: teamA.fixtures.draws.total,
		loses: teamA.fixtures.loses.total,
		goals: {
			for: teamA.goals.for.total.total,
			against: teamA.goals.against.total.total,
		},
		color: "#a059e2",
		cards: teamA.cards,
		last_5_matches: teamA_Last_5_matches,
	};
	const teamBObj = {
		name: sideB.value.team.name,
		topScorer: teamB_TopScorer,
		rank: teamB_Standings.rank,
		wins: teamB.fixtures.wins.total,
		draws: teamB.fixtures.draws.total,
		loses: teamB.fixtures.loses.total,
		goals: {
			for: teamB.goals.for.total.total,
			against: teamB.goals.against.total.total,
		},
		color: "#43b3e7",
		cards: teamB.cards,
		last_5_matches: teamB_Last_5_matches,
	};
	prediction.self.innerHTML = renderReport(teamAObj, teamBObj);

	// render chart
	prediction.self.innerHTML += `<div class="chart">
									<div class="chart-header">WHO IS BETTER?</div>
									<div class="chart-container">
										<canvas id="football-chart"></canvas>
									</div>
								</div>`;
	const ctx = document.getElementById("football-chart");
	renderChart(ctx, teamAObj, teamBObj);
}
function last_5_matches(fixtures, teamId) {
	teamId = 33;

	return fixtures
		.slice(0, 5)
		.map((fixture) => Object.values(fixture.teams).find((el) => el.id == teamId).winner)
		.map((winner) =>
			winner == null
				? `<div class="draw">D</div>`
				: winner
				? `<div class="win">W</div>`
				: `<div class="lost">L</div>`
		)
		.join("");
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
						<div class="row">
							<div class="col last-5-matches">
								${teamA.last_5_matches}
							</div>
							<div class="metric">Last 5 Matches</div>
							<div class="col last-5-matches">
								${teamB.last_5_matches}
							</div>
						</div>
					</div>
				</div>
			</div>`;
}
function renderChart(ctx, teamA, teamB) {
	const labels = ["Wins", "Loses", "Draws", "Goals for", "Goals aginst", "ٌRed Cards"];

	const data = {
		labels: labels,
		datasets: [
			{
				label: teamA.name,
				data: [
					teamA.wins,
					teamA.loses,
					teamA.draws,
					teamA.goals.for,
					teamA.goals.against,
					getRedCards(teamA),
				],
				borderColor: teamA.color,
				backgroundColor: `rgba(${teamA.color}, 0.5)`,
				borderWidth: 2,
				borderSkipped: false,
				categoryPercentage: 0.5,
			},
			{
				label: teamB.name,
				data: [
					teamB.wins,
					teamB.loses,
					teamB.draws,
					teamB.goals.for,
					teamB.goals.against,
					getRedCards(teamB),
				],
				borderColor: teamB.color,
				backgroundColor: `rgba(${teamB.color}, 0.5)`,
				borderWidth: 2,
				borderSkipped: false,
			},
		],
	};

	const config = {
		type: "bar",
		data: data,
		options: {
			x: {
				stacked: true,
			},
			responsive: true,
		},
	};

	new Chart(ctx, config);
}
function getRedCards(team) {
	const { red } = team.cards;

	let sum = 0;
	Object.values(red).forEach((el) => {
		sum += el.total ? el.total : 0;
	});

	return sum;
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
	if (!countries) {
		return;
	}
	renderCountries(countries);
}
initCountries();
