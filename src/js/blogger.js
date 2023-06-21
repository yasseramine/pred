const apikey = "AIzaSyB3hhMRGUJuZkoYHriHJ8AAhVStFJi7Lsc";
const bloggerURI = `https://www.googleapis.com/blogger/v3/blogs/6721257432511051792/posts?key=${apikey}`;

async function fetchBlogger() {
	const response = await fetch(bloggerURI);
	const data = await response.json();
	return data;
}

fetchBlogger();
