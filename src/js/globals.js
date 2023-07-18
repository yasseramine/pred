const URI = "https://apiv3.apifootball.com/?action=";
const api_key = "dc793d9dad1eb23ea1e9fb02e3b3d43540948658b12021c5db89e77c2f9acc2a";

// fall back picture
function onError() {
	this.onerror = null;
	this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src;
}
