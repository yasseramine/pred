const menuBtn = document.getElementById("menu-btn");
const nav = document.querySelector("nav");
const menuIcon = document.getElementById("nav-icon");
menuBtn.addEventListener("click", () => {
	nav.classList.toggle("open");
	menuIcon.classList.toggle("open");
});
