async function football_game(t, e, s, a, l, n = !1) {
	var r = new Headers();
	r.append("x-rapidapi-key", e), r.append("x-rapidapi-host", s);
	var i = { method: "GET", headers: r, redirect: "follow" };
	let o = "https://v3.football.api-sports.io/";
	"v3.football.api-sports.io" != s && (o = "https://api-football-v1.p.rapidapi.com/v3/");
	let d = "?";
	null !== t && "" !== t && ("?" !== d && (d += "&"), (d += "id=" + t)),
		(d += "&timezone=" + Intl.DateTimeFormat().resolvedOptions().timeZone);
	try {
		const t = await fetch(o + "fixtures" + d, i);
		let e = await t.json(),
			s = document.getElementById("wg-api-football-game"),
			r = "div";
		n && ((s = document.getElementById("wb-football-modal-data")), (r = "modal"));
		let g = "wg-football-game-" + r,
			_ = "";
		if ("true" === a) {
			for (const t in e.errors)
				console.log(e.errors[t]),
					(_ += `\n                    <div class="wg_no_data">${e.errors[t]}</div>\n                `);
			return s.classList.remove("wg_loader"), (s.innerHTML = _), !1;
		}
		if (0 === e.results)
			return (
				(_ +=
					'\n                <div class="wg_no_data">No Data Available</div>\n            '),
				s.classList.remove("wg_loader"),
				(s.innerHTML = _),
				!1
			);
		for (const t in e.response) {
			let s = e.response[t],
				a = ["1H", "2H", "ET", "P", "LIVE"],
				n = ["HT", "BT"],
				i = ["FT", "AET", "PEN"],
				o = ["SUSP", "INT", "PST", "CANC", "ABD", "AWD", "WO"],
				d = `<div class="wb_img_block"><img class="wg_logo_game" src="${s.teams.home.logo}" loading="lazy" onerror='this.style.display="none"'></div>`,
				c = `<div class="wb_img_block"><img class="wg_logo_game" src="${s.teams.away.logo}" loading="lazy" onerror='this.style.display="none"'></div>`;
			"false" === l && ((d = ""), (c = ""));
			let p,
				w,
				m,
				u = null == s.goals.home ? "" : s.goals.home,
				f = null == s.goals.away ? "" : s.goals.away;
			u > f && (p = "wg_bolder"),
				u < f && (w = "wg_bolder"),
				a.includes(s.fixture.status.short) && (m = "wg_liveTime");
			let y,
				b = "";
			null !== s.fixture.status.elapsed &&
				a.includes(s.fixture.status.short) &&
				(b = `- <span class="wg_liveTime">${s.fixture.status.elapsed}<span class="wg_progress">'</span></span>`),
				a.includes(s.fixture.status.short) && (y = "wg_liveTime"),
				n.includes(s.fixture.status.short) && (y = "wg_finished"),
				i.includes(s.fixture.status.short) && (y = "wg_finished"),
				o.includes(s.fixture.status.short) && (y = "wg_canceled");
			let x,
				h,
				$,
				v,
				I = null == s.fixture.venue.name ? "" : s.fixture.venue.name,
				L = null == s.fixture.venue.city ? "" : s.fixture.venue.city,
				T =
					null == s.fixture.referee
						? ""
						: '<i class="icon-svg icon-whistle"></i> ' + s.fixture.referee;
			0 === s.events.length && (x = "wg_hide"),
				0 === s.statistics.length && (h = "wg_hide"),
				0 === s.lineups.length && ($ = "wg_hide"),
				0 === s.players.length && (v = "wg_hide");
			let E = events(
					s.events,
					s.teams.home.id,
					s.teams.away.id,
					s.score,
					s.goals.home,
					s.goals.away
				),
				X = statistics(s.statistics, s.teams.home.id, s.teams.away.id),
				B = lineups(s.lineups, s.teams.home.id, s.teams.away.id, r),
				P = players(s.players, l);
			if (document.getElementById(g)) {
				let t;
				(t = document.getElementById(
					"football-game-" + r + "-status-" + s.fixture.id
				)).classList.remove("wg_liveTime"),
					t.classList.remove("wg_finished"),
					t.classList.remove("wg_canceled"),
					t.classList.add(y),
					(t.innerHTML = s.fixture.status.long + " " + b),
					(t = document.getElementById(
						"football-game-" + r + "-score-" + s.fixture.id
					)).classList.remove("wg_liveTime"),
					t.classList.add(m),
					(t.innerHTML = u + " - " + f),
					(t = document.getElementById(
						"football-" + r + "-home-" + s.fixture.id
					)).classList.remove("wg_bolder"),
					t.classList.add(p),
					(t = document.getElementById(
						"football-" + r + "-away-" + s.fixture.id
					)).classList.remove("wg_bolder"),
					t.classList.add(w),
					(t = document.getElementById(
						"football-game-" + r + "-events-button-" + s.fixture.id
					)).classList.remove("wg_hide"),
					t.classList.add(x),
					(t = document.getElementById(
						"football-game-" + r + "-statistics-button-" + s.fixture.id
					)).classList.remove("wg_hide"),
					t.classList.add(h),
					(t = document.getElementById(
						"football-game-" + r + "-lineups-button-" + s.fixture.id
					)).classList.remove("wg_hide"),
					t.classList.add($),
					(t = document.getElementById(
						"football-game-" + r + "-players-button-" + s.fixture.id
					)).classList.remove("wg_hide"),
					t.classList.add(v),
					((t = document.getElementById(
						"football-game-" + r + "-events-" + s.fixture.id
					)).innerHTML = E),
					((t = document.getElementById(
						"football-game-" + r + "-statistics-" + s.fixture.id
					)).innerHTML = X),
					((t = document.getElementById(
						"football-game-" + r + "-lineups-" + s.fixture.id
					)).innerHTML = B),
					((t = document.getElementById(
						"football-game-" + r + "-players-" + s.fixture.id
					)).innerHTML = P);
			} else
				_ += `\n                    <table class="wg-table" id="${g}">\n                        <tr>\n                            <td class="wg_header" colspan="2"><img class="wg_flag" src="${
					s.league.flag
				}" loading="lazy" onerror='this.style.display="none"'> ${s.league.country}: ${
					s.league.name
				}</td>\n                            <td class="wg_header wg_text_right">${
					s.league.round
				}</td>\n                        </tr>\n                        <tr>\n                            <td class="wg_text_center wg_width_33_p wg_no_border"><br /><br />${d}</td>\n                            <td class="wg_text_center wg_width_34_p wg_no_border" rowspan="2">\n                                <br />\n                                ${_date(
					s.fixture.timestamp
				)} ${time(
					s.fixture.timestamp
				)}\n                                <br />\n                                <br />\n                                <br />\n                                <span id="football-game-${r}-score-${
					s.fixture.id
				}" class="wg_modal_score ${m}">${u} - ${f}</span>\n                                <br />\n                                <br />\n                                <br />\n                                <span id="football-game-${r}-status-${
					s.fixture.id
				}" class="${y}">${
					s.fixture.status.long
				} ${b}</span>\n                            </td>\n                            <td class="wg_text_center wg_width_33_p wg_no_border"><br /><br />${c}</td>\n                        </tr>\n                        <tr>\n                            <td id="football-${r}-home-${
					s.fixture.id
				}" class="wg_text_center ${p} wg_no_border wg_modal_team">${
					s.teams.home.name
				}</td>\n                            <td id="football-${r}-away-${
					s.fixture.id
				}" class="wg_text_center ${w} wg_no_border wg_modal_team">${
					s.teams.away.name
				}</td>\n                        </tr>\n                        <tr>\n                            <td class="wg_text_center wg_no_border" colspan="3"><br />${I} <b>${L}</b></td>\n                        </tr>\n                        <tr>\n                            <td class="wg_text_center wg_no_border" colspan="3">${T}</td>\n                        </tr>\n                        <tr>\n                            <td class="wg_header" colspan="3">\n                                <span id="football-game-${r}-events-button-${
					s.fixture.id
				}" class="wg_button_toggle_game wg_active ${x}" data-select="events" data-sport="football" data-id="${
					s.fixture.id
				}" data-sub="${r}">Events</span>\n                                <span id="football-game-${r}-statistics-button-${
					s.fixture.id
				}" class="wg_button_toggle_game ${h}" data-select="statistics" data-sport="football" data-id="${
					s.fixture.id
				}" data-sub="${r}">Statistics</span>\n                                <span id="football-game-${r}-lineups-button-${
					s.fixture.id
				}" class="wg_button_toggle_game ${$}" data-select="lineups" data-sport="football" data-id="${
					s.fixture.id
				}" data-sub="${r}">Lineups</span>\n                                <span id="football-game-${r}-players-button-${
					s.fixture.id
				}" class="wg_button_toggle_game ${v}" data-select="players" data-sport="football" data-id="${
					s.fixture.id
				}" data-sub="${r}">Players</span>\n                            </td>\n                        </tr>\n                    </table>\n                    <table class="wg-table wg_data_toggle_game" id="football-game-${r}-events-${
					s.fixture.id
				}" data-id="${
					s.fixture.id
				}">\n                        ${E}\n                    </table>\n                    <table class="wg-table wg_data_toggle_game wg_hide" id="football-game-${r}-statistics-${
					s.fixture.id
				}" data-id="${
					s.fixture.id
				}">\n                        ${X}\n                    </table>\n                    <table class="wg-table wg_data_toggle_game wg_hide" id="football-game-${r}-lineups-${
					s.fixture.id
				}" data-id="${
					s.fixture.id
				}">\n                        ${B}\n                    </table>\n                    <table class="wg-table wg_data_toggle_game wg_hide" id="football-game-${r}-players-${
					s.fixture.id
				}" data-id="${
					s.fixture.id
				}">\n                        ${P}\n                    </table>\n                `;
		}
		document.getElementById(g) || (s.classList.remove("wg_loader"), (s.innerHTML = _));
	} catch (t) {
		"true" === a && console.log(t);
	}
}
function time(t) {
	let e = new Date(1e3 * t),
		s = e.getHours();
	return s < 10 && (s = "0" + s), s + ":" + ("0" + e.getMinutes()).substr(-2);
}
function _date(t) {
	let e = new Date(1e3 * t),
		s = e.getFullYear(),
		a = e.getMonth() + 1;
	a < 10 && (a = "0" + a);
	let l = e.getDate();
	return l < 10 && (l = "0" + l), s + "-" + a + "-" + l;
}
function events(t, e, s, a, l, n) {
	let r = !1,
		i = !1,
		o = !1,
		d = !1,
		g = "";
	for (let _ in t) {
		if (!1 === r && t[_].time.elapsed >= 0 && t[_].time.elapsed <= 45) {
			(r = !0),
				(g += `\n                <tr>\n                    <td class="wg_header wg_text_center">${
					null == a.halftime.home
						? "First Half"
						: "First Half (" + a.halftime.home + " - " + a.halftime.away + ")"
				}</td>\n                </tr>\n            `);
		}
		if (!1 === i && t[_].time.elapsed > 45 && t[_].time.elapsed <= 90) {
			(i = !0),
				(g += `\n                <tr>\n                    <td class="wg_header wg_text_center">${
					null == a.fulltime.home
						? "Second Half (" + l + " - " + n + ")"
						: "Second Half (" + a.fulltime.home + " - " + a.fulltime.away + ")"
				}</td>\n                </tr>\n            `);
		}
		if (!1 === o && t[_].time.elapsed > 90) {
			(o = !0),
				(g += `\n                <tr>\n                    <td class="wg_header wg_text_center">${
					null == a.extratime.home
						? "Extra Time (" + l + " - " + n + ")"
						: "Extra Time (" + a.extratime.home + " - " + a.extratime.away + ")"
				}</td>\n                </tr>\n            `);
		}
		if (!1 === d && "Penalty Shootout" === t[_].comments) {
			(d = !0),
				(g += `\n                <tr>\n                    <td class="wg_header wg_text_center">${
					null == a.penalty.home
						? "Penalty Shootout"
						: "Penalty Shootout (" + a.penalty.home + " - " + a.penalty.away + ")"
				}</td>\n                </tr>\n            `);
		}
		let c;
		if (
			("Goal" == t[_].type &&
				("Normal Goal" == t[_].detail && (c = "icon-soccer-ball"),
				"Penalty" == t[_].detail && (c = "icon-soccer-ball-penalty"),
				"Missed Penalty" == t[_].detail && (c = "icon-soccer-ball-missed-penalty"),
				"Own Goal" == t[_].detail && (c = "icon-soccer-ball-own-goal")),
			"Card" == t[_].type &&
				("Yellow Card" == t[_].detail && (c = "icon-yellow-card"),
				"Second Yellow Card" == t[_].detail && (c = "icon-red-card"),
				"Red Card" == t[_].detail && (c = "icon-red-card")),
			"subst" == t[_].type && (c = "icon-substitution"),
			"Var" == t[_].type && (c = "icon-whistle"),
			t[_].team.id === e)
		) {
			g += "<tr><td>";
			let e = null == t[_].time.elapsed ? "" : t[_].time.elapsed + "'",
				s = null == t[_].player.name ? "" : t[_].player.name,
				a = null == t[_].assist.name ? "" : t[_].assist.name,
				l = null == t[_].comments ? "" : t[_].comments;
			g += `\n                <span class="wg_p_lr_2 wg_tooltip" data-text="${t[_].detail}">\n                    ${e}\n                    <i class="icon-svg ${c}"></i>\n                    <span class="wg_p_lr_2 wg_bolder">${s}</span>\n                    <span class="wg_p_lr_2">${a}</span>\n                    <span class="wg_p_lr_2">${l}</span>\n                </span>\n            `;
		}
		if (t[_].team.id === s) {
			g += '<tr><td class="wg_text_right">';
			let e = null == t[_].time.elapsed ? "" : t[_].time.elapsed + "'",
				s = null == t[_].player.name ? "" : t[_].player.name,
				a = null == t[_].assist.name ? "" : t[_].assist.name,
				l = null == t[_].comments ? "" : t[_].comments;
			g += `\n                <span class="wg_p_lr_2 wg_tooltip wg_tooltip_left" data-text="${t[_].detail}">\n                    <span class="wg_p_lr_2">${l}</span>\n                    <span class="wg_p_lr_2">${a}</span>\n                    <span class="wg_p_lr_2 wg_bolder">${s}</span>\n                    <i class="icon-svg ${c}"></i>\n                    ${e}\n                </span>\n            `;
		}
		g += "</td></tr>";
	}
	return g;
}
function statistics(t, e, s) {
	let a = {};
	for (let e in t) {
		let s = t[e].team.id;
		for (let l in t[e].statistics)
			a[t[e].statistics[l].type] || (a[t[e].statistics[l].type] = {}),
				a[t[e].statistics[l].type][s] || (a[t[e].statistics[l].type][s] = {}),
				(a[t[e].statistics[l].type][s] = t[e].statistics[l].value);
	}
	let l = "";
	for (let t in a) {
		l += `\n            <tr>\n                <td class="wg_width_33_p wg_p_lr_5 wg_no_border">${
			null === a[t][e] ? "" : a[t][e]
		}</td>\n                <td class="wg_width_34_p wg_no_border wg_text_center wg_bolder" colspan="2">${t}</td>\n                <td class="wg_width_33_p wg_p_lr_5 wg_no_border wg_text_right">${
			null === a[t][s] ? "" : a[t][s]
		}</td>\n            </tr>\n        `;
		let n = parseInt(a[t][e]) + parseInt(a[t][s]);
		0 == n && (n = 1);
		let r = (100 * parseInt(a[t][e])) / n,
			i = (100 * parseInt(a[t][s])) / n;
		null === a[t][e] && (r = 0), null === a[t][s] && (i = 0);
		let o = "wg_progress_bar_red",
			d = "wg_progress_bar_red";
		r > i ? (o = "wg_progress_bar_green") : (d = "wg_progress_bar_green"),
			(l += `\n            <tr>\n                <td colspan="2" class="wg_no_border wg_width_50_p">\n                    <div class="wg_progress_bar wg_progress_bar_home">\n                        <div class="${o}" style="width:${r}%">\n                    </div>\n                </td>\n                <td colspan="2" class="wg_no_border wg_width_50_p">\n                    <div class="wg_progress_bar">\n                        <div class="${d}" style="width:${i}%"></div>\n                    </div>\n                </td>\n            </tr>\n        `);
	}
	return l;
}
function lineups(t, e, s, a) {
	let l,
		n,
		r,
		i,
		o,
		d,
		g,
		_,
		c,
		p,
		w,
		m,
		u,
		f,
		y = "",
		b = 500;
	"div" == a &&
		document.getElementById("wg-api-football-game") &&
		(b = document.getElementById("wg-api-football-game").offsetWidth),
		"modal" == a &&
			document.getElementById("wg-api-football-games") &&
			((b = window.innerWidth) < 680
				? ((b *= 0.9), (b -= 30))
				: b >= 1024
				? ((b *= 0.5), (b -= 30))
				: b >= 680 && ((b *= 0.75), (b -= 30)));
	let x = "#01d099",
		h = "#fff",
		$ = "#f64e60",
		v = "#fff",
		I = !1,
		L = !1;
	for (let a in t) {
		if (t[a].team.id == e && null !== t[a].formation) {
			t[a].team.colors.player.primary && (x = "#" + t[a].team.colors.player.primary),
				t[a].team.colors.player.border && (h = "#" + t[a].team.colors.player.border),
				(r = []);
			for (let e in t[a].startXI)
				null !== t[a].startXI[e].player.grid &&
					((I = !0),
					(d = (o = t[a].startXI[e].player.grid.split(":"))[0] - 1),
					(g = o[1] - 1),
					r[d] || (r[d] = []),
					(r[d][g] = t[a].startXI[e].player.name));
			m = b / r.length / 2;
		}
		if (t[a].team.id == s && null !== t[a].formation) {
			t[a].team.colors.player.primary && ($ = "#" + t[a].team.colors.player.primary),
				t[a].team.colors.player.border && (v = "#" + t[a].team.colors.player.border),
				(i = []);
			for (let e in t[a].startXI)
				null !== t[a].startXI[e].player.grid &&
					((L = !0),
					(d = (o = t[a].startXI[e].player.grid.split(":"))[0] - 1),
					(g = o[1] - 1),
					i[d] || (i[d] = []),
					(i[d][g] = t[a].startXI[e].player.name));
			u = b / i.length / 2;
		}
	}
	if (!0 === I && !0 === L) {
		(y += `\n            <tr>\n                <td class="wg_grid" height="${
			0.65 * b + "px"
		}" colspan="2">\n        `),
			(p = 0);
		for (let t in r) {
			(_ = 0),
				1 === r[t].length && (f = 50),
				2 === r[t].length && (f = 33),
				3 === r[t].length && (f = 25),
				4 === r[t].length && (f = 20),
				5 === r[t].length && (f = 16.67),
				6 === r[t].length && (f = 7);
			for (let e in r[t])
				y += `\n                    <span class="wg_absolute wg_text_center" style="top:${(_ +=
					f)}%;left:${p}px">\n                        <span class="wg_grid_player wg_tooltip" data-text="${
					r[t][e]
				}" style="background:${x}; border: 2px solid ${h}"></span>\n                    </span>\n                `;
			p += m;
		}
		w = b / 2 - u;
		for (let t in i.reverse()) {
			(c = 0),
				1 === i[t].length && (f = 50),
				2 === i[t].length && (f = 33),
				3 === i[t].length && (f = 25),
				4 === i[t].length && (f = 20),
				5 === i[t].length && (f = 16.67),
				6 === i[t].length && (f = 7);
			for (let e in i[t])
				y += `\n                    <span class="wg_absolute wg_text_center" style="bottom:${(c +=
					f)}%;right:${w}px">\n                        <span class="wg_grid_player wg_tooltip wg_tooltip_left" data-text="${
					i[t][e]
				}" style="background:${$}; border: 2px solid ${v};transform: translateY(50%)translateX(-75%);"></span>\n                    </span>\n                `;
			w -= u;
		}
		y += "\n            </td>\n        </tr>\n        ";
	}
	y +=
		'\n        <tr>\n            <td class="wg_text_center wg_header" colspan="2">Coaches</td>\n        </tr>\n        <tr>\n    ';
	for (let a in t)
		t[a].team.id == e &&
			(y += `\n                <td class="wg_text_center">${t[a].coach.name}</td>\n            `),
			t[a].team.id == s &&
				(y += `\n                <td class="wg_text_center">${t[a].coach.name}</td>\n            `);
	y +=
		'\n        </tr>\n        <tr>\n            <td class="wg_text_center wg_header" colspan="2">Formations</td>\n        </tr>\n        <tr>\n    ';
	for (let a in t)
		t[a].team.id == e &&
			(y += `\n                <td class="wg_text_center">${t[a].formation}</td>\n            `),
			t[a].team.id == s &&
				(y += `\n                <td class="wg_text_center">${t[a].formation}</td>\n            `);
	y +=
		'\n        </tr>\n        <tr>\n            <td class="wg_text_center wg_header" colspan="2">Start XI</td>\n        </tr>\n        <tr>\n    ';
	for (let a in t) {
		if (t[a].team.id == e) {
			y += "\n                <td>\n            ";
			for (let e in t[a].startXI)
				(l = ""),
					null !== t[a].startXI[e].player.pos && (l = t[a].startXI[e].player.pos),
					(n = ""),
					null !== t[a].startXI[e].player.number &&
						(n = " <span>(" + t[a].startXI[e].player.number + ")</span>"),
					(y += `\n                    <div>\n                        <span class="wg_bolder">${l} </span> ${t[a].startXI[e].player.name} ${n}\n                    </div>\n                `);
			y += "\n                </td>\n            ";
		}
		if (t[a].team.id == s) {
			y += "\n                <td>\n            ";
			for (let e in t[a].startXI)
				(l = ""),
					null !== t[a].startXI[e].player.pos && (l = t[a].startXI[e].player.pos),
					(n = ""),
					null !== t[a].startXI[e].player.number &&
						(n = " <span>(" + t[a].startXI[e].player.number + ")</span>"),
					(y += `\n                    <div class="wg_text_right">\n                        ${n} ${t[a].startXI[e].player.name} <span class="wg_bolder">${l} </span>\n                    </div>\n                `);
			y += "\n                </td>\n            ";
		}
	}
	y +=
		'\n        </tr>\n        <tr>\n            <td class="wg_text_center wg_header" colspan="2">Substitutes</td>\n        </tr>\n        <tr>\n    ';
	for (let a in t) {
		if (t[a].team.id == e) {
			y += "\n                <td>\n            ";
			for (let e in t[a].substitutes)
				(l = ""),
					null !== t[a].substitutes[e].player.pos && (l = t[a].substitutes[e].player.pos),
					(n = ""),
					null !== t[a].substitutes[e].player.number &&
						(n = " <span>(" + t[a].substitutes[e].player.number + ")</span>"),
					(y += `\n                    <div>\n                        <span class="wg_bolder">${l} </span> ${t[a].substitutes[e].player.name} ${n}\n                    </div>\n                `);
			y += "\n                </td>\n            ";
		}
		if (t[a].team.id == s) {
			y += "\n                <td>\n            ";
			for (let e in t[a].substitutes)
				(l = ""),
					null !== t[a].substitutes[e].player.pos && (l = t[a].substitutes[e].player.pos),
					(n = ""),
					null !== t[a].substitutes[e].player.number &&
						(n = " <span>(" + t[a].substitutes[e].player.number + ")</span>"),
					(y += `\n                    <div class="wg_text_right">\n                        ${n} ${t[a].substitutes[e].player.name} <span class="wg_bolder">${l} </span>\n                    </div>\n                `);
			y += "\n                </td>\n            ";
		}
	}
	return (y += "\n        </tr>\n    ");
}
function players(t, e) {
	let s = "";
	for (let a in t) {
		let l = `<img class="wg_logo wg_hide_xs" src="${t[a].team.logo}" alt="${t[a].team.name} logo" onerror='this.style.display="none"' loading="lazy">`;
		"false" === e && (l = ""),
			(s += `\n            <tr>\n                <td class="wg_header">\n                    ${l}\n                    <span class="wg_nowrap">${t[a].team.name}</span>\n                </td>\n                <td class="wg_header wg_text_center wg_tooltip wg_hide_xxs" data-text="Position">P</td>\n                <td class="wg_header wg_text_center wg_tooltip" data-text="Rating">R</td>\n                <td class="wg_header wg_text_center wg_tooltip" data-text="Minutes Played">M</td>\n                <td class="wg_header wg_text_center wg_tooltip" data-text="Goals">G</td>\n                <td class="wg_header wg_text_center wg_tooltip" data-text="Goals Assists">GA</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_hide_xs" data-text="Total Shots">TS</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_hide_xs" data-text="Shots On">SO</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_hide_xxs" data-text="Goals Conceded">GC</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_hide_xs" data-text="Goals Saves">GS</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left" data-text="Total Passes">TP</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_hide_xs wg_tooltip_left" data-text="Key Passes">KP</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_hide_xs wg_tooltip_left" data-text="Passes Accuracy">PA</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left" data-text="Yellow Cards">YC</td>\n                <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left" data-text="Red Cards">RC</td>\n            </tr>\n        `),
			t[a].players.sort(function (t, e) {
				return t.statistics[0].games.rating > e.statistics[0].games.rating
					? -1
					: t.statistics[0].games.rating < e.statistics[0].games.rating
					? 1
					: 0;
			});
		for (let l in t[a].players) {
			let n =
					null == t[a].players[l].statistics[0].games.position
						? ""
						: t[a].players[l].statistics[0].games.position,
				r =
					null == t[a].players[l].statistics[0].games.rating
						? ""
						: t[a].players[l].statistics[0].games.rating,
				i =
					null == t[a].players[l].statistics[0].games.minutes
						? ""
						: t[a].players[l].statistics[0].games.minutes,
				o =
					null == t[a].players[l].statistics[0].goals.total
						? ""
						: t[a].players[l].statistics[0].goals.total,
				d =
					null == t[a].players[l].statistics[0].goals.assists
						? ""
						: t[a].players[l].statistics[0].goals.assists,
				g =
					null == t[a].players[l].statistics[0].shots.total
						? ""
						: t[a].players[l].statistics[0].shots.total,
				_ =
					null == t[a].players[l].statistics[0].shots.on
						? ""
						: t[a].players[l].statistics[0].shots.on,
				c =
					null == t[a].players[l].statistics[0].goals.conceded
						? ""
						: t[a].players[l].statistics[0].goals.conceded,
				p =
					null == t[a].players[l].statistics[0].goals.saves
						? ""
						: t[a].players[l].statistics[0].goals.saves,
				w =
					null == t[a].players[l].statistics[0].passes.total
						? ""
						: t[a].players[l].statistics[0].passes.total,
				m =
					null == t[a].players[l].statistics[0].passes.key
						? ""
						: t[a].players[l].statistics[0].passes.key,
				u =
					null == t[a].players[l].statistics[0].passes.accuracy
						? ""
						: t[a].players[l].statistics[0].passes.accuracy,
				f =
					null == t[a].players[l].statistics[0].cards.yellow
						? ""
						: t[a].players[l].statistics[0].cards.yellow,
				y =
					null == t[a].players[l].statistics[0].cards.red
						? ""
						: t[a].players[l].statistics[0].cards.red,
				b = `<img class="wg_logo wg_p_lr_2 wg_hide_xs" src="${t[a].players[l].player.photo}" alt="${t[a].players[l].player.name} photo" onerror='this.style.display="none"' loading="lazy">`;
			"false" === e && (b = ""),
				(s += `\n                <tr>\n                    <td>\n                        ${b}\n                        <span class="wg_nowrap">${t[a].players[l].player.name}</span>\n                    </td>\n                    <td class="wg_text_center wg_hide_xxs">${n}</td>\n                    <td class="wg_text_center">${r}</td>\n                    <td class="wg_text_center">${i}</td>\n                    <td class="wg_text_center">${o}</td>\n                    <td class="wg_text_center">${d}</td>\n                    <td class="wg_text_center wg_hide_xs">${g}</td>\n                    <td class="wg_text_center wg_hide_xs">${_}</td>\n                    <td class="wg_text_center wg_hide_xxs">${c}</td>\n                    <td class="wg_text_center wg_hide_xs">${p}</td>\n                    <td class="wg_text_center">${w}</td>\n                    <td class="wg_text_center wg_hide_xs">${m}</td>\n                    <td class="wg_text_center wg_hide_xs">${u}</td>\n                    <td class="wg_text_center">${f}</td>\n                    <td class="wg_text_center">${y}</td>\n                </tr>\n            `);
		}
	}
	return s;
}

async function football_games(e, t, a, s, l, o, n, r, i) {
	var d = new Headers();
	d.append("x-rapidapi-key", s), d.append("x-rapidapi-host", l);
	var g = { method: "GET", headers: d, redirect: "follow" };
	let u = "https://v3.football.api-sports.io/";
	"v3.football.api-sports.io" != l && (u = "https://api-football-v1.p.rapidapi.com/v3/");
	let m = "?";
	null !== e && "" !== e && ("?" !== m && (m += "&"), (m += "date=" + e)),
		null !== t && "" !== t && ("?" !== m && (m += "&"), (m += "league=" + t)),
		null !== a && "" !== a && ("?" !== m && (m += "&"), (m += "season=" + a)),
		(m += "&timezone=" + Intl.DateTimeFormat().resolvedOptions().timeZone);
	try {
		const t = await fetch(u + "fixtures" + m, g);
		let a,
			s,
			l = await t.json(),
			d = document.getElementById("wg-football-data"),
			c = "",
			f = {},
			w = ["1H", "2H", "ET", "P", "LIVE"],
			p = ["HT", "BT"],
			_ = ["FT", "AET", "PEN"],
			b = ["SUSP", "INT", "PST", "CANC", "ABD", "AWD", "WO"],
			h = !1;
		if (((null !== e && "" !== e) || (h = !0), "true" === o)) {
			for (const e in l.errors)
				console.log(l.errors[e]),
					(c += `\n                    <div class="wg_no_data">${l.errors[e]}</div>\n                `);
			return d.classList.remove("wg_loader"), (d.innerHTML = c), !1;
		}
		if (0 === l.results)
			return (
				(c +=
					'\n                <div class="wg_no_data">No Games Available</div>\n            '),
				d.classList.remove("wg_loader"),
				(d.innerHTML = c),
				!1
			);
		l.response.sort(function (e, t) {
			return e.fixture.timestamp < t.fixture.timestamp
				? -1
				: e.fixture.timestamp > t.fixture.timestamp
				? 1
				: 0;
		});
		for (const e in l.response)
			h
				? (f[removeSpace(l.response[e].league.round)] ||
						(f[removeSpace(l.response[e].league.round)] = []),
				  f[removeSpace(l.response[e].league.round)].push(l.response[e]))
				: (f["football-" + l.response[e].league.id] ||
						(f["football-" + l.response[e].league.id] = []),
				  f["football-" + l.response[e].league.id].push(l.response[e]));
		document.getElementById("wg-football-games") ||
			(c +=
				'\n                <table class="wg-table" id="wg-football-games">\n                    <thead>\n                    </thead>\n            ');
		let x = "",
			$ = "";
		for (const e in f)
			for (const t in f[e]) {
				let l = f[e][t];
				if (!document.getElementById("wg-football-games")) {
					if ($ !== l.league.id) {
						let e = `<span data-sport="football" data-league="${l.league.id}" data-season="${l.league.season}" class="wb_header_link wg_load_standings">Standings</span>`;
						"false" === i && (e = ""),
							(c += `\n                            <tr id="football-league-${l.league.id}">\n                                <td class="wg_header" colspan="8"><img class="wg_flag" src="${l.league.flag}" loading="lazy" onerror='this.style.display="none"'> ${l.league.country}: ${l.league.name} <span data-id="football-league-${l.league.id}" class="wg_arrow wg_arrow_up">&#10095;</span> ${e}</td>\n                            </tr>\n                        `),
							($ = l.league.id);
					}
					h &&
						x !== removeSpace(l.league.round) &&
						((c += `\n                                <tr id="football-date-${removeSpace(
							l.league.round
						)}">\n                                    <td class="wg_header" colspan="8">${
							l.league.round
						} <span data-id="date-${removeSpace(
							l.league.round
						)}" class="wg_arrow wg_arrow_up">&#10095;</span></td>\n                                </tr>\n                            `),
						(x = removeSpace(l.league.round)));
				}
				let o = l.fixture.status.short;
				"NS" == l.fixture.status.short && (o = time(l.fixture.timestamp)),
					null === o && (o = ""),
					null !== l.fixture.status.elapsed &&
						w.includes(l.fixture.status.short) &&
						(o = `<span class="wg_liveTime">${l.fixture.status.elapsed}<span class="wg_progress">'</span></span>`);
				let d,
					g,
					u,
					m,
					v = null == l.goals.home ? "-" : l.goals.home,
					y = null == l.goals.away ? "-" : l.goals.away,
					L = null == l.score.halftime.home ? "" : "(" + l.score.halftime.home + ")",
					T = null == l.score.halftime.away ? "" : "(" + l.score.halftime.away + ")",
					E = `<img class="wg_logo" src="${l.teams.home.logo}" loading="lazy" onerror='this.style.display="none"'> ${l.teams.home.name}`,
					S = `<img class="wg_logo" src="${l.teams.away.logo}" loading="lazy" onerror='this.style.display="none"'> ${l.teams.away.name}`;
				if (
					("false" === n && ((E = `${l.teams.home.name}`), (S = `${l.teams.away.name}`)),
					w.includes(l.fixture.status.short) && (d = "wg_liveTime"),
					p.includes(l.fixture.status.short) && (d = "wg_breakTime"),
					_.includes(l.fixture.status.short) && (d = "wg_finished"),
					b.includes(l.fixture.status.short) && (d = "wg_canceled"),
					v > y && (g = "wg_bolder"),
					v < y && (u = "wg_bolder"),
					w.includes(l.fixture.status.short) && (m = "wg_liveTime"),
					document.getElementById("wg-football-games"))
				)
					(a = document.getElementById("football-game-" + l.fixture.id)).setAttribute(
						"data-status",
						l.fixture.status.short
					),
						(s = document.getElementById(
							"football-game-status-" + l.fixture.id
						)).setAttribute("data-text", l.fixture.status.long),
						s.classList.remove("wg_liveTime"),
						s.classList.remove("wg_breakTime"),
						s.classList.remove("wg_finished"),
						s.classList.remove("wg_canceled"),
						s.classList.add(d),
						(s.innerHTML = o),
						(s = document.getElementById(
							"football-game-score-" + l.fixture.id
						)).classList.remove("wg_liveTime"),
						s.classList.add(m),
						(s.innerHTML = v + "<br />" + y),
						(s = document.getElementById(
							"football-game-ht-" + l.fixture.id
						)).classList.remove("wg_liveTime"),
						s.classList.add(m),
						(s.innerHTML = L + "<br />" + T),
						(s = document.getElementById(
							"football-home-" + l.fixture.id
						)).classList.remove("wg_bolder"),
						s.classList.add(g),
						(s = document.getElementById(
							"football-away-" + l.fixture.id
						)).classList.remove("wg_bolder"),
						s.classList.add(u);
				else {
					let e = `<span class="wg_info wg_tooltip wg_tooltip_left wg_load_game" data-sport="football" data-id="${l.fixture.id}" data-text="Show Fixture">?</span>`;
					"false" === r && (e = ""),
						(c += `\n                        <tr id="football-game-${
							l.fixture.id
						}" class="football-league-${l.league.id} date-${removeSpace(
							l.league.round
						)} football-games-select" data-status="${
							l.fixture.status.short
						}" data-league="${l.league.id}" data-date="${removeSpace(
							l.league.round
						)}">\n                            <td id="football-game-status-${
							l.fixture.id
						}" class="wg_tooltip wg_width_30 wg_text_center ${d}" data-text="${
							l.fixture.status.long
						}">${o}</td>\n                            <td>\n                                <span id="football-home-${
							l.fixture.id
						}" class="${g} wg_nowrap">${E}</span>\n                                <br />\n                                <span id="football-away-${
							l.fixture.id
						}" class="${u} wg_nowrap">${S}</span>\n                            </td>\n                            <td id="football-game-score-${
							l.fixture.id
						}" class="wg_width_20 wg_text_center wg_bolder ${m}">\n                                ${v}\n                                <br />\n                                ${y}\n                            </td>\n                            <td id="football-game-ht-${
							l.fixture.id
						}" class="wg_width_20 wg_bolder_300 wg_text_center wg_tooltip wg_tooltip_left ${m}" data-text="Halftime score">\n                                ${L}\n                                <br />\n                                ${T}\n                            </td>\n                            <td class="wg_width_20 wg_text_center">\n                                ${e}\n                            </td>\n                        </tr>\n                    `);
				}
			}
		document.getElementById("wg-football-games") ||
			((c += "\n                </table>\n            "),
			d.classList.remove("wg_loader"),
			(d.innerHTML = c));
	} catch (e) {
		"true" === o && console.log(e);
	}
}
function removeSpace(e) {
	return (e = e.replace(/\s+/g, "-").toLowerCase());
}
async function football_standings(t, e, a, l, s, n, o, _ = !1) {
	var d = new Headers();
	d.append("x-rapidapi-key", l), d.append("x-rapidapi-host", s);
	var r = { method: "GET", headers: d, redirect: "follow" };
	let g = "https://v3.football.api-sports.io/";
	"v3.football.api-sports.io" != s && (g = "https://api-football-v1.p.rapidapi.com/v3/");
	let w = "?";
	null !== t && "" !== t && ("?" !== w && (w += "&"), (w += "league=" + t)),
		null !== a && "" !== a && ("?" !== w && (w += "&"), (w += "team=" + a)),
		null !== e && "" !== e && ("?" !== w && (w += "&"), (w += "season=" + e));
	try {
		const t = await fetch(g + "standings" + w, r);
		let e = await t.json(),
			a = document.getElementById("wg-api-football-standings");
		_ && (a = document.getElementById("wb-football-modal-data"));
		let l = "";
		if ("true" === n) {
			for (const t in e.errors)
				console.log(e.errors[t]),
					(l += `\n                    <div class="wg_no_data">${e.errors[t]}</div>\n                `);
			return a.classList.remove("wg_loader"), (a.innerHTML = l), !1;
		}
		if (0 === e.results)
			return (
				(l +=
					'\n                <div class="wg_no_data">No Standings Available</div>\n            '),
				a.classList.remove("wg_loader"),
				(a.innerHTML = l),
				!1
			);
		l +=
			'\n            <table class="wg-table" id="wg-football-standings">\n                <thead>\n                </thead>\n        ';
		let s = "",
			d = "";
		for (const t in e.response) {
			let a = e.response[t];
			(l += `\n                <tr>\n                    <td class="wg_header" colspan="11"><img class="wg_flag" src="${a.league.flag}" loading="lazy" onerror='this.style.display="none"'> ${a.league.country}: ${a.league.name}</td>\n                </tr>\n            `),
				(s = a.league.name);
			for (const a in e.response[t])
				for (const n in e.response[t][a].standings)
					for (const _ in e.response[t][a].standings[n]) {
						let r = e.response[t][a].standings[n][_];
						if (d !== r.group) {
							let t = "";
							r.group != s && (t = r.group),
								(l += `\n                                <tr>\n                                    <td class="wg_header" colspan="2">${t}</td>\n                                    <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left" data-text="Matches Played">MP</td>\n                                    <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left" data-text="Win">W</td>\n                                    <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left" data-text="Draw">D</td>\n                                    <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left" data-text="Lose">L</td>\n                                    <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left wg_hide_xxs" data-text="Goals For : Goals Against">G</td>\n                                    <td class="wg_header wg_text_center wg_hide_xs">+/-</td>\n                                    <td class="wg_header wg_text_center wg_tooltip wg_tooltip_left" data-text="Points">P</td>\n                                    <td class="wg_header wg_text_center wg_hide_xs"></td>\n                                    <td class="wg_header wg_text_center wg_hide_xs"></td>\n                                </tr>\n                            `),
								(d = r.group);
						}
						let g = `<img class="wg_logo" src="${r.team.logo}" loading="lazy" onerror='this.style.display="none"'> ${r.team.name}`;
						"false" === o && (g = `${r.team.name}`);
						let w = r.points;
						null === w && (w = "");
						let i = "";
						null !== r.form &&
							(i = (i = (i = (i = (i = r.form.replaceAll("WO", "W")).replaceAll(
								"LO",
								"L"
							)).replaceAll(
								"W",
								'<span class="wg_form wg_form_win">W</span>'
							)).replaceAll(
								"D",
								'<span class="wg_form wg_form_draw">D</span>'
							)).replaceAll("L", '<span class="wg_form wg_form_lose">L</span>'));
						let c = `<span class="wg_info wg_tooltip wg_tooltip_left" data-text="${r.description}">?</span>`;
						null === r.description && (c = ""),
							(l += `\n                            <tr>\n                                <td class="wg_text_center wg_bolder wg_width_20">${r.rank}</td>\n                                <td class="wg_nowrap">${g}</td>\n                                <td class="wg_text_center wg_width_20">${r.all.played}</td>\n                                <td class="wg_text_center wg_width_20">${r.all.win}</td>\n                                <td class="wg_text_center wg_width_20">${r.all.draw}</td>\n                                <td class="wg_text_center wg_width_20">${r.all.lose}</td>\n                                <td class="wg_text_center wg_width_20 wg_hide_xxs">${r.all.goals.for}:${r.all.goals.against}</td>\n                                <td class="wg_text_center wg_width_20 wg_hide_xs">${r.goalsDiff}</td>\n                                <td class="wg_text_center wg_width_20">${w}</td>\n                                <td class="wg_text_center wg_width_90 wg_hide_xs">${i}</td>\n                                <td class="wg_text_center wg_width_20 wg_hide_xs">${c}</td>\n                            </tr>\n                        `);
					}
		}
		(l += "\n            </table>\n        "),
			a.classList.remove("wg_loader"),
			(a.innerHTML = l);
	} catch (t) {
		"true" === n && console.log(t);
	}
}

window.addEventListener("DOMContentLoaded", () => {
	let t, a, e, s, d, l, r, n, g, o, i, b, c, u;
	if (document.getElementById("wg-api-football-games")) {
		let t = "football";
		const e = document.getElementById("wg-api-" + t + "-games");
		let s = e.getAttribute("data-key"),
			d = e.getAttribute("data-host"),
			l = e.getAttribute("data-theme"),
			r = e.getAttribute("data-date"),
			n = e.getAttribute("data-league"),
			g = e.getAttribute("data-season"),
			o = e.getAttribute("data-show-toolbar"),
			i = e.getAttribute("data-show-errors"),
			b = e.getAttribute("data-show-logos"),
			c = e.getAttribute("data-modal-game"),
			u = e.getAttribute("data-modal-standings"),
			$ = parseInt(1e3 * e.getAttribute("data-refresh"));
		if ((w(l), "" === r && "" === n && "" === g)) {
			let t = new Date(),
				a = String(t.getDate()).padStart(2, "0"),
				e = String(t.getMonth() + 1).padStart(2, "0"),
				s = t.getFullYear();
			r = s + "-" + e + "-" + a;
		}
		let h = m(7, "-"),
			f = m(6, "-"),
			_ = m(5, "-"),
			A = m(4, "-"),
			v = m(3, "-"),
			y = m(2, "-"),
			I = m(1, "-"),
			E = m(0, "+"),
			L = m(1, "+"),
			k = m(2, "+"),
			B = m(3, "+"),
			S = m(4, "+"),
			N = m(5, "+"),
			D = m(6, "+"),
			T = m(7, "+"),
			H = `\n            <div id="wg-${t}-toolbar" class="wg_toolbar">\n                <span class="wg_button_toggle wg_active" data-select="all" data-sport="${t}">ALL</span>\n                <span class="wg_button_toggle" data-select="live" data-sport="${t}">LIVE</span>\n                <span class="wg_button_toggle" data-select="finished" data-sport="${t}">FINISHED</span>\n                <span class="wg_button_toggle" data-select="scheduled" data-sport="${t}">SCHEDULED</span>\n                <span class="wg-dropdown">\n                    <span class="wg-dropbtn" id="wg-${t}-dropbtn">${E}</span>\n                    <div class="wg-dropdown-content">\n                        <a href="#" data-date="${h}" class="wg-date" data-sport="${t}">${h}</a>\n                        <a href="#" data-date="${f}" class="wg-date" data-sport="${t}">${f}</a>\n                        <a href="#" data-date="${_}" class="wg-date" data-sport="${t}">${_}</a>\n                        <a href="#" data-date="${A}" class="wg-date" data-sport="${t}">${A}</a>\n                        <a href="#" data-date="${v}" class="wg-date" data-sport="${t}">${v}</a>\n                        <a href="#" data-date="${y}" class="wg-date" data-sport="${t}">${y}</a>\n                        <a href="#" data-date="${I}" class="wg-date" data-sport="${t}">${I}</a>\n                        <a href="#" data-date="${E}" class="wg-date wg-dropdown-color-select" data-sport="${t}">TODAY</a>\n                        <a href="#" data-date="${L}" class="wg-date" data-sport="${t}">${L}</a>\n                        <a href="#" data-date="${k}" class="wg-date" data-sport="${t}">${k}</a>\n                        <a href="#" data-date="${B}" class="wg-date" data-sport="${t}">${B}</a>\n                        <a href="#" data-date="${S}" class="wg-date" data-sport="${t}">${S}</a>\n                        <a href="#" data-date="${N}" class="wg-date" data-sport="${t}">${N}</a>\n                        <a href="#" data-date="${D}" class="wg-date" data-sport="${t}">${D}</a>\n                        <a href="#" data-date="${T}" class="wg-date" data-sport="${t}">${T}</a>\n                    </div>\n                </span>\n            </div>\n            <div id="wg-${t}-data" class="wg_loader"></div>\n        `;
		"false" === o &&
			(H = `\n                <div id="wg-${t}-data" class="wg_loader"></div>\n            `),
			(e.innerHTML = H),
			football_games(r, n, g, s, d, i, b, c, u),
			$ >= 15 &&
				Number.isInteger($) &&
				(a = setInterval(function () {
					football_games(r, n, g, s, d, i, b, c, u), p(t);
				}, $));
	}
	if (document.getElementById("wg-api-football-game")) {
		let a = "football";
		const e = document.getElementById("wg-api-" + a + "-game");
		let s = e.getAttribute("data-key"),
			d = e.getAttribute("data-host"),
			l = e.getAttribute("data-theme"),
			r = e.getAttribute("data-id"),
			n = e.getAttribute("data-show-errors"),
			g = e.getAttribute("data-show-logos"),
			o = parseInt(1e3 * e.getAttribute("data-refresh"));
		w(l),
			football_game(r, s, d, n, g, !1),
			o >= 15 &&
				Number.isInteger(o) &&
				(t = setInterval(function () {
					football_game(r, s, d, n, g, !1);
				}, o));
	}
	if (document.getElementById("wg-api-football-standings")) {
		const t = document.getElementById("wg-api-football-standings");
		let a = t.getAttribute("data-key"),
			e = t.getAttribute("data-host"),
			s = t.getAttribute("data-theme"),
			d = t.getAttribute("data-league"),
			l = t.getAttribute("data-team"),
			r = t.getAttribute("data-season"),
			n = t.getAttribute("data-show-errors"),
			g = t.getAttribute("data-show-logos");
		w(s), football_standings(d, r, l, a, e, n, g, !1);
	}
	if (document.getElementById("wg-api-baseball-games")) {
		let t = "baseball";
		const a = document.getElementById("wg-api-" + t + "-games");
		let e = a.getAttribute("data-key"),
			d = a.getAttribute("data-host"),
			l = a.getAttribute("data-theme"),
			r = a.getAttribute("data-date"),
			n = a.getAttribute("data-league"),
			g = a.getAttribute("data-season"),
			o = a.getAttribute("data-show-toolbar"),
			i = a.getAttribute("data-show-errors"),
			b = a.getAttribute("data-show-logos"),
			c = a.getAttribute("data-modal-game"),
			u = a.getAttribute("data-modal-standings"),
			$ = parseInt(1e3 * a.getAttribute("data-refresh"));
		if ((w(l), "" === r && "" === n && "" === g)) {
			let t = new Date(),
				a = String(t.getDate()).padStart(2, "0"),
				e = String(t.getMonth() + 1).padStart(2, "0"),
				s = t.getFullYear();
			r = s + "-" + e + "-" + a;
		}
		let h = m(7, "-"),
			f = m(6, "-"),
			_ = m(5, "-"),
			A = m(4, "-"),
			v = m(3, "-"),
			y = m(2, "-"),
			I = m(1, "-"),
			E = m(0, "+"),
			L = m(1, "+"),
			k = m(2, "+"),
			B = m(3, "+"),
			S = m(4, "+"),
			N = m(5, "+"),
			D = m(6, "+"),
			T = m(7, "+"),
			H = `\n            <div id="wg-${t}-toolbar" class="wg_toolbar">\n                <span class="wg_button_toggle wg_active" data-select="all" data-sport="${t}">ALL</span>\n                <span class="wg_button_toggle" data-select="live" data-sport="${t}">LIVE</span>\n                <span class="wg_button_toggle" data-select="finished" data-sport="${t}">FINISHED</span>\n                <span class="wg_button_toggle" data-select="scheduled" data-sport="${t}">SCHEDULED</span>\n                <span class="wg-dropdown">\n                    <span class="wg-dropbtn" id="wg-${t}-dropbtn">${E}</span>\n                    <div class="wg-dropdown-content">\n                        <a href="#" data-date="${h}" class="wg-date" data-sport="${t}">${h}</a>\n                        <a href="#" data-date="${f}" class="wg-date" data-sport="${t}">${f}</a>\n                        <a href="#" data-date="${_}" class="wg-date" data-sport="${t}">${_}</a>\n                        <a href="#" data-date="${A}" class="wg-date" data-sport="${t}">${A}</a>\n                        <a href="#" data-date="${v}" class="wg-date" data-sport="${t}">${v}</a>\n                        <a href="#" data-date="${y}" class="wg-date" data-sport="${t}">${y}</a>\n                        <a href="#" data-date="${I}" class="wg-date" data-sport="${t}">${I}</a>\n                        <a href="#" data-date="${E}" class="wg-date wg-dropdown-color-select" data-sport="${t}">TODAY</a>\n                        <a href="#" data-date="${L}" class="wg-date" data-sport="${t}">${L}</a>\n                        <a href="#" data-date="${k}" class="wg-date" data-sport="${t}">${k}</a>\n                        <a href="#" data-date="${B}" class="wg-date" data-sport="${t}">${B}</a>\n                        <a href="#" data-date="${S}" class="wg-date" data-sport="${t}">${S}</a>\n                        <a href="#" data-date="${N}" class="wg-date" data-sport="${t}">${N}</a>\n                        <a href="#" data-date="${D}" class="wg-date" data-sport="${t}">${D}</a>\n                        <a href="#" data-date="${T}" class="wg-date" data-sport="${t}">${T}</a>\n                    </div>\n                </span>\n            </div>\n            <div id="wg-${t}-data" class="wg_loader"></div>\n        `;
		"false" === o &&
			(H = `\n                <div id="wg-${t}-data" class="wg_loader"></div>\n            `),
			(a.innerHTML = H),
			baseball_games(r, n, g, e, d, i, b, c, u),
			$ >= 15 &&
				Number.isInteger($) &&
				(s = setInterval(function () {
					baseball_games(r, n, g, e, d, i, b, c, u), p(t);
				}, $));
	}
	if (document.getElementById("wg-api-baseball-standings")) {
		const t = document.getElementById("wg-api-baseball-standings");
		let a = t.getAttribute("data-key"),
			e = t.getAttribute("data-host"),
			s = t.getAttribute("data-theme"),
			d = t.getAttribute("data-league"),
			l = t.getAttribute("data-season"),
			r = t.getAttribute("data-show-errors"),
			n = t.getAttribute("data-show-logos");
		w(s), baseball_standings(d, l, a, e, r, n, !1);
	}
	if (document.getElementById("wg-api-basketball-games")) {
		let t = "basketball";
		const a = document.getElementById("wg-api-" + t + "-games");
		let e = a.getAttribute("data-key"),
			s = a.getAttribute("data-host"),
			d = a.getAttribute("data-theme"),
			r = a.getAttribute("data-date"),
			n = a.getAttribute("data-league"),
			g = a.getAttribute("data-season"),
			o = a.getAttribute("data-show-toolbar"),
			i = a.getAttribute("data-show-errors"),
			b = a.getAttribute("data-show-logos"),
			c = a.getAttribute("data-modal-game"),
			u = a.getAttribute("data-modal-standings"),
			$ = parseInt(1e3 * a.getAttribute("data-refresh"));
		if ((w(d), "" === r && "" === n && "" === g)) {
			let t = new Date(),
				a = String(t.getDate()).padStart(2, "0"),
				e = String(t.getMonth() + 1).padStart(2, "0"),
				s = t.getFullYear();
			r = s + "-" + e + "-" + a;
		}
		let h = m(7, "-"),
			f = m(6, "-"),
			_ = m(5, "-"),
			A = m(4, "-"),
			v = m(3, "-"),
			y = m(2, "-"),
			I = m(1, "-"),
			E = m(0, "+"),
			L = m(1, "+"),
			k = m(2, "+"),
			B = m(3, "+"),
			S = m(4, "+"),
			N = m(5, "+"),
			D = m(6, "+"),
			T = m(7, "+"),
			H = `\n            <div id="wg-${t}-toolbar" class="wg_toolbar">\n                <span class="wg_button_toggle wg_active" data-select="all" data-sport="${t}">ALL</span>\n                <span class="wg_button_toggle" data-select="live" data-sport="${t}">LIVE</span>\n                <span class="wg_button_toggle" data-select="finished" data-sport="${t}">FINISHED</span>\n                <span class="wg_button_toggle" data-select="scheduled" data-sport="${t}">SCHEDULED</span>\n                <span class="wg-dropdown">\n                    <span class="wg-dropbtn" id="wg-${t}-dropbtn">${E}</span>\n                    <div class="wg-dropdown-content">\n                        <a href="#" data-date="${h}" class="wg-date" data-sport="${t}">${h}</a>\n                        <a href="#" data-date="${f}" class="wg-date" data-sport="${t}">${f}</a>\n                        <a href="#" data-date="${_}" class="wg-date" data-sport="${t}">${_}</a>\n                        <a href="#" data-date="${A}" class="wg-date" data-sport="${t}">${A}</a>\n                        <a href="#" data-date="${v}" class="wg-date" data-sport="${t}">${v}</a>\n                        <a href="#" data-date="${y}" class="wg-date" data-sport="${t}">${y}</a>\n                        <a href="#" data-date="${I}" class="wg-date" data-sport="${t}">${I}</a>\n                        <a href="#" data-date="${E}" class="wg-date wg-dropdown-color-select" data-sport="${t}">TODAY</a>\n                        <a href="#" data-date="${L}" class="wg-date" data-sport="${t}">${L}</a>\n                        <a href="#" data-date="${k}" class="wg-date" data-sport="${t}">${k}</a>\n                        <a href="#" data-date="${B}" class="wg-date" data-sport="${t}">${B}</a>\n                        <a href="#" data-date="${S}" class="wg-date" data-sport="${t}">${S}</a>\n                        <a href="#" data-date="${N}" class="wg-date" data-sport="${t}">${N}</a>\n                        <a href="#" data-date="${D}" class="wg-date" data-sport="${t}">${D}</a>\n                        <a href="#" data-date="${T}" class="wg-date" data-sport="${t}">${T}</a>\n                    </div>\n                </span>\n            </div>\n            <div id="wg-${t}-data" class="wg_loader"></div>\n        `;
		"false" === o &&
			(H = `\n                <div id="wg-${t}-data" class="wg_loader"></div>\n            `),
			(a.innerHTML = H),
			basketball_games(r, n, g, e, s, i, b, c, u),
			$ >= 15 &&
				Number.isInteger($) &&
				(l = setInterval(function () {
					basketball_games(r, n, g, e, s, i, b, c, u), p(t);
				}, $));
	}
	if (document.getElementById("wg-api-basketball-standings")) {
		const t = document.getElementById("wg-api-basketball-standings");
		let a = t.getAttribute("data-key"),
			e = t.getAttribute("data-host"),
			s = t.getAttribute("data-theme"),
			d = t.getAttribute("data-league"),
			l = t.getAttribute("data-season"),
			r = t.getAttribute("data-show-errors"),
			n = t.getAttribute("data-show-logos");
		w(s), basketball_standings(d, l, a, e, r, n, !1);
	}
	if (document.getElementById("wg-api-handball-games")) {
		let t = "handball";
		const a = document.getElementById("wg-api-" + t + "-games");
		let e = a.getAttribute("data-key"),
			s = a.getAttribute("data-host"),
			d = a.getAttribute("data-theme"),
			l = a.getAttribute("data-date"),
			r = a.getAttribute("data-league"),
			g = a.getAttribute("data-season"),
			o = a.getAttribute("data-show-toolbar"),
			i = a.getAttribute("data-show-errors"),
			b = a.getAttribute("data-show-logos"),
			c = a.getAttribute("data-modal-game"),
			u = a.getAttribute("data-modal-standings"),
			$ = parseInt(1e3 * a.getAttribute("data-refresh"));
		if ((w(d), "" === l && "" === r && "" === g)) {
			let t = new Date(),
				a = String(t.getDate()).padStart(2, "0"),
				e = String(t.getMonth() + 1).padStart(2, "0"),
				s = t.getFullYear();
			l = s + "-" + e + "-" + a;
		}
		let h = m(7, "-"),
			f = m(6, "-"),
			_ = m(5, "-"),
			A = m(4, "-"),
			v = m(3, "-"),
			y = m(2, "-"),
			I = m(1, "-"),
			E = m(0, "+"),
			L = m(1, "+"),
			k = m(2, "+"),
			B = m(3, "+"),
			S = m(4, "+"),
			N = m(5, "+"),
			D = m(6, "+"),
			T = m(7, "+"),
			H = `\n            <div id="wg-${t}-toolbar" class="wg_toolbar">\n                <span class="wg_button_toggle wg_active" data-select="all" data-sport="${t}">ALL</span>\n                <span class="wg_button_toggle" data-select="live" data-sport="${t}">LIVE</span>\n                <span class="wg_button_toggle" data-select="finished" data-sport="${t}">FINISHED</span>\n                <span class="wg_button_toggle" data-select="scheduled" data-sport="${t}">SCHEDULED</span>\n                <span class="wg-dropdown">\n                    <span class="wg-dropbtn" id="wg-${t}-dropbtn">${E}</span>\n                    <div class="wg-dropdown-content">\n                        <a href="#" data-date="${h}" class="wg-date" data-sport="${t}">${h}</a>\n                        <a href="#" data-date="${f}" class="wg-date" data-sport="${t}">${f}</a>\n                        <a href="#" data-date="${_}" class="wg-date" data-sport="${t}">${_}</a>\n                        <a href="#" data-date="${A}" class="wg-date" data-sport="${t}">${A}</a>\n                        <a href="#" data-date="${v}" class="wg-date" data-sport="${t}">${v}</a>\n                        <a href="#" data-date="${y}" class="wg-date" data-sport="${t}">${y}</a>\n                        <a href="#" data-date="${I}" class="wg-date" data-sport="${t}">${I}</a>\n                        <a href="#" data-date="${E}" class="wg-date wg-dropdown-color-select" data-sport="${t}">TODAY</a>\n                        <a href="#" data-date="${L}" class="wg-date" data-sport="${t}">${L}</a>\n                        <a href="#" data-date="${k}" class="wg-date" data-sport="${t}">${k}</a>\n                        <a href="#" data-date="${B}" class="wg-date" data-sport="${t}">${B}</a>\n                        <a href="#" data-date="${S}" class="wg-date" data-sport="${t}">${S}</a>\n                        <a href="#" data-date="${N}" class="wg-date" data-sport="${t}">${N}</a>\n                        <a href="#" data-date="${D}" class="wg-date" data-sport="${t}">${D}</a>\n                        <a href="#" data-date="${T}" class="wg-date" data-sport="${t}">${T}</a>\n                    </div>\n                </span>\n            </div>\n            <div id="wg-${t}-data" class="wg_loader"></div>\n        `;
		"false" === o &&
			(H = `\n                <div id="wg-${t}-data" class="wg_loader"></div>\n            `),
			(a.innerHTML = H),
			handball_games(l, r, g, e, s, i, b, c, u),
			$ >= 15 &&
				Number.isInteger($) &&
				(n = setInterval(function () {
					handball_games(l, r, g, e, s, i, b, c, u), p(t);
				}, $));
	}
	if (document.getElementById("wg-api-handball-standings")) {
		const t = document.getElementById("wg-api-handball-standings");
		let a = t.getAttribute("data-key"),
			e = t.getAttribute("data-host"),
			s = t.getAttribute("data-theme"),
			d = t.getAttribute("data-league"),
			l = t.getAttribute("data-season"),
			r = t.getAttribute("data-show-errors"),
			n = t.getAttribute("data-show-logos");
		w(s), handball_standings(d, l, a, e, r, n, !1);
	}
	if (document.getElementById("wg-api-hockey-games")) {
		let t = "hockey";
		const a = document.getElementById("wg-api-" + t + "-games");
		let e = a.getAttribute("data-key"),
			s = a.getAttribute("data-host"),
			d = a.getAttribute("data-theme"),
			l = a.getAttribute("data-date"),
			r = a.getAttribute("data-league"),
			n = a.getAttribute("data-season"),
			g = a.getAttribute("data-show-toolbar"),
			i = a.getAttribute("data-show-errors"),
			b = a.getAttribute("data-show-logos"),
			c = a.getAttribute("data-modal-game"),
			u = a.getAttribute("data-modal-standings"),
			$ = parseInt(1e3 * a.getAttribute("data-refresh"));
		if ((w(d), "" === l && "" === r && "" === n)) {
			let t = new Date(),
				a = String(t.getDate()).padStart(2, "0"),
				e = String(t.getMonth() + 1).padStart(2, "0"),
				s = t.getFullYear();
			l = s + "-" + e + "-" + a;
		}
		let h = m(7, "-"),
			f = m(6, "-"),
			_ = m(5, "-"),
			A = m(4, "-"),
			v = m(3, "-"),
			y = m(2, "-"),
			I = m(1, "-"),
			E = m(0, "+"),
			L = m(1, "+"),
			k = m(2, "+"),
			B = m(3, "+"),
			S = m(4, "+"),
			N = m(5, "+"),
			D = m(6, "+"),
			T = m(7, "+"),
			H = `\n            <div id="wg-${t}-toolbar" class="wg_toolbar">\n                <span class="wg_button_toggle wg_active" data-select="all" data-sport="${t}">ALL</span>\n                <span class="wg_button_toggle" data-select="live" data-sport="${t}">LIVE</span>\n                <span class="wg_button_toggle" data-select="finished" data-sport="${t}">FINISHED</span>\n                <span class="wg_button_toggle" data-select="scheduled" data-sport="${t}">SCHEDULED</span>\n                <span class="wg-dropdown">\n                    <span class="wg-dropbtn" id="wg-${t}-dropbtn">${E}</span>\n                    <div class="wg-dropdown-content">\n                        <a href="#" data-date="${h}" class="wg-date" data-sport="${t}">${h}</a>\n                        <a href="#" data-date="${f}" class="wg-date" data-sport="${t}">${f}</a>\n                        <a href="#" data-date="${_}" class="wg-date" data-sport="${t}">${_}</a>\n                        <a href="#" data-date="${A}" class="wg-date" data-sport="${t}">${A}</a>\n                        <a href="#" data-date="${v}" class="wg-date" data-sport="${t}">${v}</a>\n                        <a href="#" data-date="${y}" class="wg-date" data-sport="${t}">${y}</a>\n                        <a href="#" data-date="${I}" class="wg-date" data-sport="${t}">${I}</a>\n                        <a href="#" data-date="${E}" class="wg-date wg-dropdown-color-select" data-sport="${t}">TODAY</a>\n                        <a href="#" data-date="${L}" class="wg-date" data-sport="${t}">${L}</a>\n                        <a href="#" data-date="${k}" class="wg-date" data-sport="${t}">${k}</a>\n                        <a href="#" data-date="${B}" class="wg-date" data-sport="${t}">${B}</a>\n                        <a href="#" data-date="${S}" class="wg-date" data-sport="${t}">${S}</a>\n                        <a href="#" data-date="${N}" class="wg-date" data-sport="${t}">${N}</a>\n                        <a href="#" data-date="${D}" class="wg-date" data-sport="${t}">${D}</a>\n                        <a href="#" data-date="${T}" class="wg-date" data-sport="${t}">${T}</a>\n                    </div>\n                </span>\n            </div>\n            <div id="wg-${t}-data" class="wg_loader"></div>\n        `;
		"false" === g &&
			(H = `\n                <div id="wg-${t}-data" class="wg_loader"></div>\n            `),
			(a.innerHTML = H),
			hockey_games(l, r, n, e, s, i, b, c, u),
			$ >= 15 &&
				Number.isInteger($) &&
				(o = setInterval(function () {
					hockey_games(l, r, n, e, s, i, b, c, u), p(t);
				}, $));
	}
	if (document.getElementById("wg-api-hockey-standings")) {
		const t = document.getElementById("wg-api-hockey-standings");
		let a = t.getAttribute("data-key"),
			e = t.getAttribute("data-host"),
			s = t.getAttribute("data-theme"),
			d = t.getAttribute("data-league"),
			l = t.getAttribute("data-season"),
			r = t.getAttribute("data-show-errors"),
			n = t.getAttribute("data-show-logos");
		w(s), hockey_standings(d, l, a, e, r, n, !1);
	}
	if (document.getElementById("wg-api-rugby-games")) {
		let t = "rugby";
		const a = document.getElementById("wg-api-" + t + "-games");
		let e = a.getAttribute("data-key"),
			s = a.getAttribute("data-host"),
			d = a.getAttribute("data-theme"),
			l = a.getAttribute("data-date"),
			r = a.getAttribute("data-league"),
			n = a.getAttribute("data-season"),
			g = a.getAttribute("data-show-toolbar"),
			o = a.getAttribute("data-show-errors"),
			i = a.getAttribute("data-show-logos"),
			c = a.getAttribute("data-modal-game"),
			u = a.getAttribute("data-modal-standings"),
			$ = parseInt(1e3 * a.getAttribute("data-refresh"));
		if ((w(d), "" === l && "" === r && "" === n)) {
			let t = new Date(),
				a = String(t.getDate()).padStart(2, "0"),
				e = String(t.getMonth() + 1).padStart(2, "0"),
				s = t.getFullYear();
			l = s + "-" + e + "-" + a;
		}
		let h = m(7, "-"),
			f = m(6, "-"),
			_ = m(5, "-"),
			A = m(4, "-"),
			v = m(3, "-"),
			y = m(2, "-"),
			I = m(1, "-"),
			E = m(0, "+"),
			L = m(1, "+"),
			k = m(2, "+"),
			B = m(3, "+"),
			S = m(4, "+"),
			N = m(5, "+"),
			D = m(6, "+"),
			T = m(7, "+"),
			H = `\n            <div id="wg-${t}-toolbar" class="wg_toolbar">\n                <span class="wg_button_toggle wg_active" data-select="all" data-sport="${t}">ALL</span>\n                <span class="wg_button_toggle" data-select="live" data-sport="${t}">LIVE</span>\n                <span class="wg_button_toggle" data-select="finished" data-sport="${t}">FINISHED</span>\n                <span class="wg_button_toggle" data-select="scheduled" data-sport="${t}">SCHEDULED</span>\n                <span class="wg-dropdown">\n                    <span class="wg-dropbtn" id="wg-${t}-dropbtn">${E}</span>\n                    <div class="wg-dropdown-content">\n                        <a href="#" data-date="${h}" class="wg-date" data-sport="${t}">${h}</a>\n                        <a href="#" data-date="${f}" class="wg-date" data-sport="${t}">${f}</a>\n                        <a href="#" data-date="${_}" class="wg-date" data-sport="${t}">${_}</a>\n                        <a href="#" data-date="${A}" class="wg-date" data-sport="${t}">${A}</a>\n                        <a href="#" data-date="${v}" class="wg-date" data-sport="${t}">${v}</a>\n                        <a href="#" data-date="${y}" class="wg-date" data-sport="${t}">${y}</a>\n                        <a href="#" data-date="${I}" class="wg-date" data-sport="${t}">${I}</a>\n                        <a href="#" data-date="${E}" class="wg-date wg-dropdown-color-select" data-sport="${t}">TODAY</a>\n                        <a href="#" data-date="${L}" class="wg-date" data-sport="${t}">${L}</a>\n                        <a href="#" data-date="${k}" class="wg-date" data-sport="${t}">${k}</a>\n                        <a href="#" data-date="${B}" class="wg-date" data-sport="${t}">${B}</a>\n                        <a href="#" data-date="${S}" class="wg-date" data-sport="${t}">${S}</a>\n                        <a href="#" data-date="${N}" class="wg-date" data-sport="${t}">${N}</a>\n                        <a href="#" data-date="${D}" class="wg-date" data-sport="${t}">${D}</a>\n                        <a href="#" data-date="${T}" class="wg-date" data-sport="${t}">${T}</a>\n                    </div>\n                </span>\n            </div>\n            <div id="wg-${t}-data" class="wg_loader"></div>\n        `;
		"false" === g &&
			(H = `\n                <div id="wg-${t}-data" class="wg_loader"></div>\n            `),
			(a.innerHTML = H),
			rugby_games(l, r, n, e, s, o, i, c, u),
			$ >= 15 &&
				Number.isInteger($) &&
				(b = setInterval(function () {
					rugby_games(l, r, n, e, s, o, i, c, u), p(t);
				}, $));
	}
	if (document.getElementById("wg-api-rugby-standings")) {
		const t = document.getElementById("wg-api-rugby-standings");
		let a = t.getAttribute("data-key"),
			e = t.getAttribute("data-host"),
			s = t.getAttribute("data-theme"),
			d = t.getAttribute("data-league"),
			l = t.getAttribute("data-season"),
			r = t.getAttribute("data-show-errors"),
			n = t.getAttribute("data-show-logos");
		w(s), rugby_standings(d, l, a, e, r, n, !1);
	}
	if (document.getElementById("wg-api-volleyball-games")) {
		let t = "volleyball";
		const a = document.getElementById("wg-api-" + t + "-games");
		let e = a.getAttribute("data-key"),
			s = a.getAttribute("data-host"),
			d = a.getAttribute("data-theme"),
			l = a.getAttribute("data-date"),
			r = a.getAttribute("data-league"),
			n = a.getAttribute("data-season"),
			g = a.getAttribute("data-show-toolbar"),
			o = a.getAttribute("data-show-errors"),
			i = a.getAttribute("data-show-logos"),
			b = a.getAttribute("data-modal-game"),
			c = a.getAttribute("data-modal-standings"),
			$ = parseInt(1e3 * a.getAttribute("data-refresh"));
		if ((w(d), "" === l && "" === r && "" === n)) {
			let t = new Date(),
				a = String(t.getDate()).padStart(2, "0"),
				e = String(t.getMonth() + 1).padStart(2, "0"),
				s = t.getFullYear();
			l = s + "-" + e + "-" + a;
		}
		let h = m(7, "-"),
			f = m(6, "-"),
			_ = m(5, "-"),
			A = m(4, "-"),
			v = m(3, "-"),
			y = m(2, "-"),
			I = m(1, "-"),
			E = m(0, "+"),
			L = m(1, "+"),
			k = m(2, "+"),
			B = m(3, "+"),
			S = m(4, "+"),
			N = m(5, "+"),
			D = m(6, "+"),
			T = m(7, "+"),
			H = `\n            <div id="wg-${t}-toolbar" class="wg_toolbar">\n                <span class="wg_button_toggle wg_active" data-select="all" data-sport="${t}">ALL</span>\n                <span class="wg_button_toggle" data-select="live" data-sport="${t}">LIVE</span>\n                <span class="wg_button_toggle" data-select="finished" data-sport="${t}">FINISHED</span>\n                <span class="wg_button_toggle" data-select="scheduled" data-sport="${t}">SCHEDULED</span>\n                <span class="wg-dropdown">\n                    <span class="wg-dropbtn" id="wg-${t}-dropbtn">${E}</span>\n                    <div class="wg-dropdown-content">\n                        <a href="#" data-date="${h}" class="wg-date" data-sport="${t}">${h}</a>\n                        <a href="#" data-date="${f}" class="wg-date" data-sport="${t}">${f}</a>\n                        <a href="#" data-date="${_}" class="wg-date" data-sport="${t}">${_}</a>\n                        <a href="#" data-date="${A}" class="wg-date" data-sport="${t}">${A}</a>\n                        <a href="#" data-date="${v}" class="wg-date" data-sport="${t}">${v}</a>\n                        <a href="#" data-date="${y}" class="wg-date" data-sport="${t}">${y}</a>\n                        <a href="#" data-date="${I}" class="wg-date" data-sport="${t}">${I}</a>\n                        <a href="#" data-date="${E}" class="wg-date wg-dropdown-color-select" data-sport="${t}">TODAY</a>\n                        <a href="#" data-date="${L}" class="wg-date" data-sport="${t}">${L}</a>\n                        <a href="#" data-date="${k}" class="wg-date" data-sport="${t}">${k}</a>\n                        <a href="#" data-date="${B}" class="wg-date" data-sport="${t}">${B}</a>\n                        <a href="#" data-date="${S}" class="wg-date" data-sport="${t}">${S}</a>\n                        <a href="#" data-date="${N}" class="wg-date" data-sport="${t}">${N}</a>\n                        <a href="#" data-date="${D}" class="wg-date" data-sport="${t}">${D}</a>\n                        <a href="#" data-date="${T}" class="wg-date" data-sport="${t}">${T}</a>\n                    </div>\n                </span>\n            </div>\n            <div id="wg-${t}-data" class="wg_loader"></div>\n        `;
		"false" === g &&
			(H = `\n                <div id="wg-${t}-data" class="wg_loader"></div>\n            `),
			(a.innerHTML = H),
			volleyball_games(l, r, n, e, s, o, i, b, c),
			$ >= 15 &&
				Number.isInteger($) &&
				(u = setInterval(function () {
					volleyball_games(l, r, n, e, s, o, i, b, c), p(t);
				}, $));
	}
	if (document.getElementById("wg-api-volleyball-standings")) {
		const t = document.getElementById("wg-api-volleyball-standings");
		let a = t.getAttribute("data-key"),
			e = t.getAttribute("data-host"),
			s = t.getAttribute("data-theme"),
			d = t.getAttribute("data-league"),
			l = t.getAttribute("data-season"),
			r = t.getAttribute("data-show-errors"),
			n = t.getAttribute("data-show-logos");
		w(s), volleyball_standings(d, l, a, e, r, n, !1);
	}

	function w(t) {
		let a = "https://widgets.api-sports.io/2.0.3/widgets.css",
			e = "https://widgets.api-sports.io/2.0.3/widgets-" + t + ".css",
			s = !1,
			d = !1,
			l = document.getElementsByTagName("link");
		for (var r = 0; r < l.length; r++) {
			let t = l[r];
			t.getAttribute("href") === a && (s = !0), t.getAttribute("href") === e && (d = !0);
		}
		if ("false" !== t && !s) {
			let t = document.createElement("link");
			(t.type = "text/css"),
				(t.rel = "stylesheet"),
				(t.href = a),
				document.getElementsByTagName("head")[0].appendChild(t);
		}
		if (("grey" === t || "dark" === t) && !d) {
			let t = document.createElement("link");
			(t.type = "text/css"),
				(t.rel = "stylesheet"),
				(t.href = e),
				document.getElementsByTagName("head")[0].appendChild(t);
		}
	}

	function m(t, a) {
		let e = new Date();
		"+" == a ? e.setDate(e.getDate() + t) : e.setDate(e.getDate() - t);
		let s = String(e.getDate()).padStart(2, "0"),
			d = String(e.getMonth() + 1).padStart(2, "0");
		return e.getFullYear() + "-" + d + "-" + s;
	}

	function p(t) {
		let a = document.getElementsByClassName("wg_button_toggle");
		for (var e = 0; e < a.length; e++) {
			let s = a[e];
			if (s.getAttribute("data-sport") === t && s.classList.contains("wg_active")) {
				let t = new MouseEvent("click", {
					bubbles: !0,
					cancelable: !0,
					view: window,
				});
				s.dispatchEvent(t);
			}
		}
	}
	document.addEventListener(
		"click",
		function (t) {
			if (!t.target.matches(".wg_button_toggle")) return;
			t.preventDefault();
			let a = t.target.getAttribute("data-sport"),
				e = document.getElementsByClassName("wg_button_toggle");
			for (var s = 0; s < e.length; s++) {
				let t = e[s];
				t.getAttribute("data-sport") === a && t.classList.remove("wg_active");
			}
			t.target.classList.add("wg_active");
			let d = t.target.getAttribute("data-select"),
				l = [];
			"football" === a &&
				("live" === d && (l = ["1H", "2H", "ET", "P", "LIVE", "HT", "BT"]),
				"finished" === d && (l = ["FT", "AET", "PEN"]),
				"scheduled" === d && (l = ["NS"])),
				"baseball" === a &&
					("live" === d &&
						(l = ["IN1", "IN2", "IN3", "IN4", "IN5", "IN6", "IN7", "IN8", "IN9"]),
					"finished" === d && (l = ["FT"]),
					"scheduled" === d && (l = ["NS"])),
				"basketball" === a &&
					("live" === d && (l = ["Q1", "Q2", "Q3", "Q4", "OT", "BT", "HT"]),
					"finished" === d && (l = ["FT", "AOT"]),
					"scheduled" === d && (l = ["NS"])),
				"handball" === a &&
					("live" === d && (l = ["1H", "2H", "ET", "PT", "HT", "BT"]),
					"finished" === d && (l = ["FT", "AET", "AP"]),
					"scheduled" === d && (l = ["NS"])),
				"hockey" === a &&
					("live" === d && (l = ["P1", "P2", "P3", "OT", "PT", "BT"]),
					"finished" === d && (l = ["FT", "AOT", "AP"]),
					"scheduled" === d && (l = ["NS"])),
				"rugby" === a &&
					("live" === d && (l = ["1H", "2H", "HT", "ET", "BT", "PT"]),
					"finished" === d && (l = ["FT", "AET"]),
					"scheduled" === d && (l = ["NS"])),
				"volleyball" === a &&
					("live" === d && (l = ["S1", "S2", "S3", "S4", "S5"]),
					"finished" === d && (l = ["FT"]),
					"scheduled" === d && (l = ["NS"]));
			let r = {},
				n = {},
				g = document.getElementsByClassName(a + "-games-select");
			for (s = 0; s < g.length; s++) {
				let t = g[s];
				"all" === d
					? (t.classList.contains("wg_hide") && t.classList.remove("wg_hide"),
					  r[t.getAttribute("data-league")] || (r[t.getAttribute("data-league")] = []),
					  r[t.getAttribute("data-league")].push("1"),
					  n[t.getAttribute("data-date")] || (n[t.getAttribute("data-date")] = []),
					  n[t.getAttribute("data-date")].push("1"))
					: l.includes(t.getAttribute("data-status"))
					? (t.classList.contains("wg_hide") && t.classList.remove("wg_hide"),
					  r[t.getAttribute("data-league")] || (r[t.getAttribute("data-league")] = []),
					  r[t.getAttribute("data-league")].push("1"),
					  n[t.getAttribute("data-date")] || (n[t.getAttribute("data-date")] = []),
					  n[t.getAttribute("data-date")].push("1"))
					: (t.classList.contains("wg_hide") || t.classList.add("wg_hide"),
					  r[t.getAttribute("data-league")] || (r[t.getAttribute("data-league")] = []),
					  r[t.getAttribute("data-league")].push("0"),
					  n[t.getAttribute("data-date")] || (n[t.getAttribute("data-date")] = []),
					  n[t.getAttribute("data-date")].push("0"));
			}
			for (const t in r) {
				let e = document.getElementById(a + "-league-" + t),
					s = 0;
				for (const a in r[t]) s += r[t][a];
				s > 0
					? e.classList.contains("wg_hide") && e.classList.remove("wg_hide")
					: e.classList.contains("wg_hide") || e.classList.add("wg_hide");
			}
			for (const t in n)
				if (document.getElementById(a + "-date-" + t)) {
					let e = document.getElementById(a + "-date-" + t),
						s = 0;
					for (const a in n[t]) s += n[t][a];
					s > 0
						? e.classList.contains("wg_hide") && e.classList.remove("wg_hide")
						: e.classList.contains("wg_hide") || e.classList.add("wg_hide");
				}
		},
		!1
	),
		document.addEventListener(
			"click",
			function (t) {
				if (!t.target.matches(".wg-date")) return;
				t.preventDefault();
				let e = t.target.getAttribute("data-sport");
				"football" === e && clearInterval(a),
					"baseball" === e && clearInterval(s),
					"basketball" === e && clearInterval(l),
					"handball" === e && clearInterval(n),
					"hockey" === e && clearInterval(o),
					"rugby" === e && clearInterval(b),
					"volleyball" === e && clearInterval(u),
					(document.getElementById("wg-" + e + "-dropbtn").innerHTML =
						t.target.getAttribute("data-date"));
				let d = document.getElementById("wg-api-" + e + "-games");
				d.setAttribute("data-date", t.target.getAttribute("data-date"));
				let r = document.getElementsByClassName("wg-date");
				for (var g = 0; g < r.length; g++) {
					let a = r[g];
					a.getAttribute("data-sport") === e &&
						(a.classList.contains("wg-dropdown-color-select") &&
							a.classList.remove("wg-dropdown-color-select"),
						a.getAttribute("data-date") === t.target.getAttribute("data-date") &&
							a.classList.add("wg-dropdown-color-select"));
				}
				let i = document.getElementsByClassName("wg_button_toggle");
				for (g = 0; g < i.length; g++) {
					let t = i[g];
					t.getAttribute("data-sport") === e &&
						(t.classList.remove("wg_active"),
						"all" === t.getAttribute("data-select") && t.classList.add("wg_active"));
				}
				let c = d.getAttribute("data-key"),
					w = d.getAttribute("data-host"),
					m = d.getAttribute("data-date"),
					$ = d.getAttribute("data-league"),
					h = d.getAttribute("data-season"),
					f = d.getAttribute("data-show-errors"),
					_ = d.getAttribute("data-show-logos"),
					A = d.getAttribute("data-modal-game"),
					v = d.getAttribute("data-modal-standings"),
					y = parseInt(1e3 * d.getAttribute("data-refresh"));
				(document.getElementById("wg-" + e + "-data").innerHTML = ""),
					document.getElementById("wg-" + e + "-data").classList.add("wg_loader"),
					"football" === e &&
						(football_games(m, $, h, c, w, f, _, A, v),
						y >= 15 &&
							Number.isInteger(y) &&
							(a = setInterval(function () {
								football_games(m, $, h, c, w, f, _, A, v), p(e);
							}, y))),
					"baseball" === e &&
						(baseball_games(m, $, h, c, w, f, _, A, v),
						y >= 15 &&
							Number.isInteger(y) &&
							(s = setInterval(function () {
								baseball_games(m, $, h, c, w, f, _, A, v), p(e);
							}, y))),
					"basketball" === e &&
						(basketball_games(m, $, h, c, w, f, _, A, v),
						y >= 15 &&
							Number.isInteger(y) &&
							(l = setInterval(function () {
								basketball_games(m, $, h, c, w, f, _, A, v), p(e);
							}, y))),
					"handball" === e &&
						(handball_games(m, $, h, c, w, f, _, A, v),
						y >= 15 &&
							Number.isInteger(y) &&
							(n = setInterval(function () {
								handball_games(m, $, h, c, w, f, _, A, v), p(e);
							}, y))),
					"hockey" === e &&
						(hockey_games(m, $, h, c, w, f, _, A, v),
						y >= 15 &&
							Number.isInteger(y) &&
							(o = setInterval(function () {
								hockey_games(m, $, h, c, w, f, _, A, v), p(e);
							}, y))),
					"rugby" === e &&
						(rugby_games(m, $, h, c, w, f, _, A, v),
						y >= 15 &&
							Number.isInteger(y) &&
							(b = setInterval(function () {
								rugby_games(m, $, h, c, w, f, _, A, v), p(e);
							}, y))),
					"volleyball" === e &&
						(volleyball_games(m, $, h, c, w, f, _, A, v),
						y >= 15 &&
							Number.isInteger(y) &&
							(u = setInterval(function () {
								volleyball_games(m, $, h, c, w, f, _, A, v), p(e);
							}, y)));
			},
			!1
		),
		document.addEventListener(
			"click",
			function (t) {
				if (!t.target.matches(".wg_load_standings")) return;
				t.preventDefault();
				let a = t.target.getAttribute("data-sport");
				const e = document.getElementById("wg-api-" + a + "-games");
				let s = t.target.getAttribute("data-league"),
					d = t.target.getAttribute("data-season"),
					l = e.getAttribute("data-key"),
					r = e.getAttribute("data-host"),
					n = e.getAttribute("data-show-errors"),
					g = e.getAttribute("data-modal-show-logos");
				document.getElementById("wb-" + a + "-modal") &&
					document.getElementById("wb-" + a + "-modal").remove();
				let o = document.createElement("div");
				(o.id = "wb-" + a + "-modal"), o.classList.add("wg_modal");
				let i = document.createElement("div");
				i.classList.add("wg_modal_content"), o.appendChild(i);
				let b = document.createElement("span");
				b.classList.add("wg_modal_close"),
					b.setAttribute("data-sport", a),
					b.setAttribute("data-modal", "standings"),
					(b.innerHTML = "&times;"),
					i.appendChild(b);
				let c = document.createElement("div");
				if (
					((c.id = "wb-" + a + "-modal-data"),
					c.classList.add("wg_loader"),
					i.appendChild(c),
					e.appendChild(o),
					(o.style.display = "block"),
					"football" === a)
				) {
					let a = t.target.getAttribute("data-team");
					football_standings(s, d, a, l, r, n, g, !0);
				}
				"baseball" === a && baseball_standings(s, d, l, r, n, g, !0),
					"basketball" === a && basketball_standings(s, d, l, r, n, g, !0),
					"handball" === a && handball_standings(s, d, l, r, n, g, !0),
					"hockey" === a && hockey_standings(s, d, l, r, n, g, !0),
					"rugby" === a && rugby_standings(s, d, l, r, n, g, !0),
					"volleyball" === a && volleyball_standings(s, d, l, r, n, g, !0);
			},
			!1
		),
		document.addEventListener(
			"click",
			function (a) {
				if (!a.target.matches(".wg_load_game")) return;
				a.preventDefault();
				let s = a.target.getAttribute("data-sport");
				const l = document.getElementById("wg-api-" + s + "-games");
				let n = a.target.getAttribute("data-id"),
					o = l.getAttribute("data-key"),
					b = l.getAttribute("data-host"),
					u = l.getAttribute("data-show-errors"),
					w = l.getAttribute("data-modal-show-logos"),
					m = parseInt(1e3 * l.getAttribute("data-refresh"));
				document.getElementById("wb-" + s + "-modal") &&
					document.getElementById("wb-" + s + "-modal").remove();
				let p = document.createElement("div");
				(p.id = "wb-" + s + "-modal"), p.classList.add("wg_modal");
				let $ = document.createElement("div");
				$.classList.add("wg_modal_content"), p.appendChild($);
				let h = document.createElement("span");
				h.classList.add("wg_modal_close"),
					h.setAttribute("data-sport", s),
					h.setAttribute("data-modal", "game"),
					(h.innerHTML = "&times;"),
					$.appendChild(h);
				let f = document.createElement("div");
				(f.id = "wb-" + s + "-modal-data"),
					f.classList.add("wg_loader"),
					$.appendChild(f),
					l.appendChild(p),
					(p.style.display = "block"),
					"football" === s &&
						(clearInterval(t),
						football_game(n, o, b, u, w, !0),
						m >= 15 &&
							Number.isInteger(m) &&
							(t = setInterval(function () {
								football_game(n, o, b, u, w, !0);
							}, m))),
					"baseball" === s &&
						(clearInterval(e),
						baseball_game(n, o, b, u, w, !0),
						m >= 15 &&
							Number.isInteger(m) &&
							(e = setInterval(function () {
								baseball_game(n, o, b, u, w, !0);
							}, m))),
					"basketball" === s &&
						(clearInterval(d),
						basketball_game(n, o, b, u, w, !0),
						m >= 15 &&
							Number.isInteger(m) &&
							(d = setInterval(function () {
								basketball_game(n, o, b, u, w, !0);
							}, m))),
					"handball" === s &&
						(clearInterval(r),
						handball_game(n, o, b, u, w, !0),
						m >= 15 &&
							Number.isInteger(m) &&
							(r = setInterval(function () {
								handball_game(n, o, b, u, w, !0);
							}, m))),
					"hockey" === s &&
						(clearInterval(g),
						hockey_game(n, o, b, u, w, !0),
						m >= 15 &&
							Number.isInteger(m) &&
							(g = setInterval(function () {
								hockey_game(n, o, b, u, w, !0);
							}, m))),
					"rugby" === s &&
						(clearInterval(i),
						rugby_game(n, o, b, u, w, !0),
						m >= 15 &&
							Number.isInteger(m) &&
							(i = setInterval(function () {
								rugby_game(n, o, b, u, w, !0);
							}, m))),
					"volleyball" === s &&
						(clearInterval(c),
						volleyball_game(n, o, b, u, w, !0),
						m >= 15 &&
							Number.isInteger(m) &&
							(c = setInterval(function () {
								volleyball_game(n, o, b, u, w, !0);
							}, m)));
			},
			!1
		),
		document.addEventListener(
			"click",
			function (a) {
				if (!a.target.matches(".wg_modal_close")) return;
				a.preventDefault();
				let s = a.target.getAttribute("data-sport"),
					l = a.target.getAttribute("data-modal");
				document.getElementById("wb-" + s + "-modal") &&
					((document.getElementById("wb-" + s + "-modal").style.display = "none"),
					document.getElementById("wb-" + s + "-modal").remove()),
					"game" === l &&
						("football" === s && clearInterval(t),
						"baseball" === s && clearInterval(e),
						"basketball" === s && clearInterval(d),
						"handball" === s && clearInterval(r),
						"hockey" === s && clearInterval(g),
						"rugby" === s && clearInterval(i),
						"volleyball" === s && clearInterval(c));
			},
			!1
		),
		document.addEventListener(
			"click",
			function (t) {
				if (!t.target.matches(".wg_button_toggle_game")) return;
				t.preventDefault();
				let a = t.target.getAttribute("data-sport"),
					e = t.target.getAttribute("data-select"),
					s = t.target.getAttribute("data-id"),
					d = t.target.getAttribute("data-sub"),
					l = document.getElementsByClassName("wg_button_toggle_game");
				for (var r = 0; r < l.length; r++) {
					let t = l[r];
					t.getAttribute("data-sport") === a && t.classList.remove("wg_active");
				}
				t.target.classList.add("wg_active");
				let n = document.getElementsByClassName("wg_data_toggle_game");
				for (r = 0; r < n.length; r++) {
					let t = n[r];
					t.getAttribute("data-id") === s &&
						(t.classList.contains("wg_hide") || t.classList.add("wg_hide"));
				}
				document
					.getElementById(a + "-game-" + d + "-" + e + "-" + s)
					.classList.remove("wg_hide");
			},
			!1
		),
		document.addEventListener(
			"click",
			function (t) {
				if (!t.target.matches(".wg_arrow")) return;
				t.preventDefault();
				let a = t.target,
					e = t.target.getAttribute("data-id"),
					s = document.getElementsByClassName(e);
				for (var d = 0; d < s.length; d++) {
					let t = s[d];
					t.classList.contains("wg_hide")
						? (t.classList.remove("wg_hide"),
						  a.classList.remove("wg_arrow_down"),
						  a.classList.add("wg_arrow_up"))
						: (t.classList.add("wg_hide"),
						  a.classList.remove("wg_arrow_up"),
						  a.classList.add("wg_arrow_down"));
				}
			},
			!1
		);
});
