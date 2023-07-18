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
	this.selected = {
		country: undefined,
		league: undefined,
		team: undefined,
	};
	this.list = {
		countries: undefined,
		leagues: undefined,
		teams: undefined,
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
const report = document.getElementById("#report");

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
	const options = countries.map((c) => {
		if (c) {
			let logo;
			if (!c.country_logo) {
				logo = "/src/images/unknown.svg";
			} else {
				logo = c.country_logo;
			}
			return `<div class="item" data-name="${c.country_name}" data-type="country" id="${c.country_id}">
					<img src="${logo}" />
					${c.country_name}
				</div>`;
		}
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
	let country = countries.find((c) => c.country_id == countryId);

	let logo;
	if (!country.country_logo) {
		logo = "/src/images/unknown.svg";
	} else {
		logo = country.country_logo;
	}
	const bg = `background:url('${logo}') white center/cover no-repeat`;
	side.countryEl.selected.innerHTML = `
				<div class="item">
					<div class="info">
						<div class="flag" style="${bg}"></div>
						${country.country_name}
						<div class="favourite">
							<i class="fa-regular fa-heart"></i>
							<!-- <i class="fa-solid fa-heart"></i> -->
						</div>
					</div>
				</div>
	`;

	// Save country
	side.selected.country = country;

	// reset league
	resetLeague(side);
	// hide teams el
	side.teamEl.hidden.el = true;
	updateElementsVisibility();

	// minimize country flags
	minimizeFlags("country");

	// hide report
	report.classList.add("hide");

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
			if (!sideA.selected.country || !sideB.selected.country) break;
			country_a_flag.classList.add("minimize");
			country_a_flag.nextElementSibling.classList.add("minimize");
			country_b_flag.classList.add("minimize");
			country_b_flag.nextElementSibling.classList.add("minimize");
		case "league":
			if (!sideA.selected.league || !sideB.selected.league) break;
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
	let leagues;
	if (sideA.selected.country?.country_id == sideB.selected.country?.country_id) {
		leagues = sideA.list.leagues || sideB.list.leagues;
	} else {
		leagues = await getLeagues(side.selected.country.country_id);
	}
	if (!leagues) {
		return;
	}

	// save leagues list
	side.list.leagues = leagues;

	/* render leagues */
	const options = leagues.map((l) => {
		let logo;
		if (!l.league_logo) {
			logo = "/src/images/unknown.svg";
		} else {
			logo = l.league_logo;
		}
		return `<div class="item" data-name="${l.league_name}" data-type="league" id="${l.league_id}" data-country-name="${l.country_name}">
					<img src="${logo}" />
					${l.league_name}
				</div>`;
	});

	side.leagueEl.list.innerHTML = options.join("");
	side.leagueEl.list.removeEventListener("click", (evt) => {
		selectLeague(evt, side);
	});
	side.leagueEl.list.addEventListener("click", (evt) => {
		selectLeague(evt, side);
	});

	// unselect league and team
	side.selected.league = undefined;
	side.selected.team = undefined;

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
	side.selected.league = undefined;
}

function selectLeague(evt, side) {
	// if user didn't select a league
	if (evt.target.dataset.type != "league") return;

	/* hide list */
	side.leagueEl.hidden.list = true;
	updateElementsVisibility();

	const league_id = evt.target.id;
	const league = side.list.leagues.find((l) => l.league_id == league_id);

	let logo;
	if (!league.league_logo) {
		logo = "/src/images/unknown.svg";
	} else {
		logo = league.league_logo;
	}
	const bg = `background:url('${logo}') white center/contain no-repeat`;
	side.leagueEl.selected.innerHTML = `<div class="item">
											<div class="info">
												<div class="flag" style="${bg}"></div>
												${league.league_name}
												<div class="favourite">
													<i class="fa-regular fa-heart"></i>
													<!-- <i class="fa-solid fa-heart"></i> -->
												</div>
											</div>
										</div>`;

	// Save league
	side.selected.league = league;

	// minimize league flags
	minimizeFlags("league");

	// hide report
	report.classList.add("hide");

	resetTeam(side);
	renderTeams(side, league_id);
}

function resetTeam(side) {
	side.teamEl.selected.innerHTML = `<div class="item">
								<div class="info">
									<div class="flag" style="background:url('/src/images/unknown.svg')"></div>
									Team ${side.side.toUpperCase()}
								</div>
							</div>`;
	side.selected.team = undefined;
}

async function renderTeams(side, league_id) {
	// get teams by league id
	let teams;
	if (sideA.selected.league?.league_id == sideB.selected.league?.league_id) {
		teams = sideA.list.teams || sideB.list.teams;
	} else {
		teams = await getTeams(side.selected.league.league_id);
	}
	if (!teams) {
		return;
	}

	// save teams list
	side.list.teams = teams;

	/* render leagues */
	const options = teams.map((t) => {
		let logo;
		if (!t.team_badge) {
			logo = "/src/images/unknown.svg";
		} else {
			logo = t.team_badge;
		}
		return `<div class="item" data-name="${t.team_name}" data-type="team" id="${t.team_key}">
					<img src="${logo}" />
					${t.team_name}
				</div>`;
	});
	side.teamEl.list.innerHTML = options.join("");

	side.teamEl.list.removeEventListener("click", (evt) => {
		selectTeam(evt, side);
	});
	side.teamEl.list.addEventListener("click", (evt) => {
		selectTeam(evt, side);
	});

	// unselect team
	side.selected.team = undefined;

	// remove team from the other list
	// the user can't select the same team twice
	removeTeamFromList();

	/* show teams el */
	side.teamEl.hidden.el = false;
	updateElementsVisibility();
}

function selectTeam(evt, side) {
	// if user didn't select a team
	if (evt.target.dataset.type != "team") return;

	/* hide list */
	side.teamEl.hidden.list = true;
	updateElementsVisibility();

	// get selected team id
	const team_id = evt.target.id;
	const team = side.list.teams.find((t) => t.team_key == team_id);

	let logo;
	if (!team.team_badge) {
		logo = "/src/images/unknown.svg";
	} else {
		logo = team.team_badge;
	}
	const bg = `background:url('${logo}') white center/contain no-repeat`;
	side.teamEl.selected.innerHTML = `<div class="item">
										<div class="info">
											<div class="flag" style="${bg}"></div>
											${team.team_name}
											<div class="favourite">
												<i class="fa-regular fa-heart"></i>
												<!-- <i class="fa-solid fa-heart"></i> -->
											</div>
										</div>
									</div>`;

	// save selected team
	side.selected.team = team;

	// remove team from the other list
	// the user can't select the same team twice
	removeTeamFromList();

	renderReport();
}

function removeTeamFromList() {
	sideB.teamEl.list.childNodes.forEach((node) => {
		if (node.id == sideA.selected.team?.team_key) {
			node.classList.add("hide");
		} else {
			node.classList.remove("hide");
		}
	});

	sideA.teamEl.list.childNodes.forEach((node) => {
		if (node.id == sideB.selected.team?.team_key) {
			node.classList.add("hide");
		} else {
			node.classList.remove("hide");
		}
	});
}

async function renderReport() {
	if (!sideA.selected.team || !sideB.selected.team) return;

	// show prediction el
	report.classList.remove("hide");
	report.innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

	// get teams data
	let teamA = sideA.list.teams.find((t) => t.team_key == sideA.selected.team.team_key);
	let teamB = sideB.list.teams.find((t) => t.team_key == sideB.selected.team.team_key);

	let teamA_standings = await getStandings(sideA.selected.league.league_id);
	let teamB_Standings;

	if (sideA.selected.league.league_id == sideB.selected.league.league_id) {
		teamB_standings = teamA_standings;
	} else {
		teamB_standings = await getStandings(sideB.selected.league.league_id);
	}

	const fixturesA = await getFixutures(sideA.selected.league.league_id, teamA.team_key);
	const fixturesB = await getFixutures(sideB.selected.league.league_id, teamB.team_key);

	teamA = {
		...teamA,
		...teamStandings(teamA_standings, teamA),
		topScorer: topScorer(teamA.players),
		color: "#a059e2",
		red_cards: teamA.players.reduce((accum, currVal) => {
			return accum + parseInt(currVal.player_red_cards);
		}, 0),
		last_5_matches: last_5_matches(fixturesA, teamA.team_key),
		injuries: getInjuries(teamA),
	};
	teamB = {
		...teamB,
		...teamStandings(teamB_standings, teamB),
		topScorer: topScorer(teamB.players),
		color: "#43b3e7",
		red_cards: teamB.players.reduce((accum, currVal) => {
			return accum + parseInt(currVal.player_red_cards);
		}, 0),
		last_5_matches: last_5_matches(fixturesB, teamB.team_key),
		injuries: getInjuries(teamB),
	};

	// render report
	report.innerHTML = createReport(teamA, teamB);

	// render chart
	report.innerHTML += `<div class="chart">
							<div class="chart-header">WHO IS BETTER?</div>
							<div class="chart-container">
								<canvas id="football-chart"></canvas>
							</div>
						</div>`;
	const ctx = document.getElementById("football-chart");
	renderChart(ctx, teamA, teamB);
}
function teamStandings(leagueStandings, team) {
	if (leagueStandings.error == 404) {
		alert(leagueStandings.message + " for " + team.team_name);
		return {
			overall_league_W: 0,
			overall_league_L: 0,
			overall_league_D: 0,
			overall_league_GF: 0,
			overall_league_GA: 0,
			overall_league_position: "?",
		};
	}
	return leagueStandings.find((t) => t.team_id === team.team_key);
}
function last_5_matches(fixtures, team_id) {
	const sortFix = fixtures.sort((a, b) => new Date(b.match_date) - new Date(a.match_date));

	return sortFix
		.slice(0, 5)
		.map((match) => {
			let score;

			if (match.match_awayteam_id == team_id) {
				score = parseInt(match.match_awayteam_score) - parseInt(match.match_hometeam_score);
			}
			if (match.match_hometeam_id == team_id) {
				score = parseInt(match.match_hometeam_score) - parseInt(match.match_awayteam_score);
			}

			if (score == 0) return "<div class='draw'>D</div>";
			if (score < 0) return "<div class='lost'>L</div>";
			if (score > 0) return "<div class='win'>W</div>";
		})
		.reverse()
		.join("");
}
function createReport(teamA, teamB) {
	if (!teamA.topScorer.player_image) {
		teamA_TopScorer_Photo = "background:url('/src/images/unknown.svg') center/cover no-repeat";
	} else {
		teamA_TopScorer_Photo = `background:url('${teamA.topScorer.player_image}') center/cover no-repeat`;
	}
	if (!teamB.topScorer.player_image) {
		teamB_TopScorer_Photo = "background:url('/src/images/unknown.svg') center/cover no-repeat";
	} else {
		teamB_TopScorer_Photo = `background:url('${teamB.topScorer.player_image}') center/cover no-repeat`;
	}

	return `<div class="report">
				<div class="report-header">REPORT</div>
				<div class="teams">
					<div class="team team-a">
						<div class="color"></div>
						${teamA.team_name}
					</div>
					<div class="team team-b">
						${teamB.team_name}
						<div class="color"></div>
					</div>
				</div>
				<div class="metrics">
					<div class="metrics-header">Metric</div>
					<div class="data">
						<div class="row">
							<div class="col player">
								<div class="photo" style="${teamA_TopScorer_Photo}"></div>
								<div class="name">${teamA.topScorer.player_name}</div>
								${teamA.topScorer.player_goals} Goals
							</div>
							<div class="metric">TOP Scorer</div>
							<div class="col player">
								<div class="photo" style="${teamB_TopScorer_Photo}"></div>
								<div class="name">${teamB.topScorer.player_name}</div>
								${teamB.topScorer.player_goals} Goals
							</div>
						</div>
						<div class="row">
							<div class="col rank">#${teamA.overall_league_position}</div>
							<div class="metric">Position in league</div>
							<div class="col rank">#${teamB.overall_league_position}</div>
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
	const labels = [
		"Wins",
		"Loses",
		"Draws",
		"Goals for",
		"Goals aginst",
		"ٌRed Cards",
		"Injuries",
	];

	console.log(teamA);

	const data = {
		labels: labels,
		datasets: [
			{
				label: teamA.team_name,
				data: [
					teamA.overall_league_W,
					teamA.overall_league_L,
					teamA.overall_league_D,
					teamA.overall_league_GF,
					teamA.overall_league_GA,
					teamA.red_cards,
					teamA.injuries,
				],
				borderColor: teamA.color,
				backgroundColor: `rgba(${teamA.color}, 0.5)`,
				borderWidth: 2,
				borderSkipped: false,
				categoryPercentage: 0.5,
			},
			{
				label: teamB.team_name,
				data: [
					teamB.overall_league_W,
					teamB.overall_league_L,
					teamB.overall_league_D,
					teamB.overall_league_GF,
					teamB.overall_league_GA,
					teamB.red_cards,
					teamB.injuries,
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
			maintainAspectRatio: false,
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
	if (players.length == 0) {
		return {
			player_image: "/src/images/unknown.svg",
			player_name: "-",
			player_goals: "-",
		};
	}
	return players.sort((a, b) => {
		return b.player_goals - a.player_goals;
	})[0];
}
function getInjuries(team) {
	sum = 0;
	team.players.forEach((p) => {
		if (p.player_injured != "No") {
			sum++;
		}
	});
	return sum;
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

// fall back picture
function onError() {
	this.onerror = null;
	this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src;
}
