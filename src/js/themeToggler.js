const themeTogglerInput = document.getElementById("theme-toggler-input");
let themeStatus = localStorage.getItem("theme") || "dark";

if (themeStatus == "dark") enableDarkTheme();
else enableLightTheme();

themeTogglerInput.addEventListener("click", () => {
	if (themeTogglerInput.checked) {
		enableDarkTheme();
	} else {
		enableLightTheme();
	}
});

function enableDarkTheme() {
	document.body.classList.remove("light-theme");
	localStorage.setItem("theme", "dark");
	themeTogglerInput.checked = true;
}
function enableLightTheme() {
	document.body.classList.add("light-theme");
	localStorage.setItem("theme", "light");
	themeTogglerInput.checked = false;
}
