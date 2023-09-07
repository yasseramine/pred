const URI = "https://apiv3.apifootball.com/?action=";
const api_key = "2f709dc037d274ffce8bfd4825b384e9de819f920e4a39564362a38fa9a07336";

// fall back picture
function onError() {
	this.onerror = null;
	this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src;
}
