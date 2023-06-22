const lists = [...document.querySelectorAll(".favourites .list-name")];

lists.forEach((list) => {
	list.addEventListener("click", function () {
		const listContent = this.nextElementSibling;
		const dropBtn = this.children[1];

		dropBtn.classList.toggle("rotate");

		if (listContent.style.maxHeight) {
			listContent.style.maxHeight = null;
		} else {
			listContent.style.maxHeight = listContent.scrollHeight + "px";
		}
	});
});
