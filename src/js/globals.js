const URI = "https://apiv3.apifootball.com/?action=";
const api_key = "4995cf7ac822efaa09ffdb8b40112afc26db25d751b686c929cfb975c57fb522";

// fall back picture
function onError() {
	this.onerror = null;
	this.parentNode.children[0].srcset = this.parentNode.children[1].srcset = this.src;
}
