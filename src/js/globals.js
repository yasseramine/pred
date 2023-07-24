const URI = "https://apiv3.apifootball.com/?action=";
const api_key = "e31671c6fb0bc86c621189a00762b8d47b66fb8ff93b6963a66a2468c1eb3191";

// fall back picture
function onError() {
	this.onerror = null;
	this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src;
}
