// Select element
const bloggerPostsEl = document.getElementById("blogger-posts");

// API parameters
const apikey = "AIzaSyB3hhMRGUJuZkoYHriHJ8AAhVStFJi7Lsc";
const blogId = "3517521573712645923";
const numOfPosts = 5;
const bloggerURI = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apikey}&maxResults=${numOfPosts}`;

// fetch blogger
async function fetchBlogger() {
	const response = await fetch(bloggerURI, {
		maxResults: 2,
	});
	const data = await response.json();

	return data.items;
}

// render posts
async function renderPosts() {
	// wait to load posts
	bloggerPostsEl.innerHTML = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;

	// load posts
	const posts = await fetchBlogger();

	// generate featured posts
	const featured = `<div class="featured">
						<a href="${posts[0].url}" target="_blank">
							${getPostImgUrl(posts[0].content)}
							<div class="title">
								${posts[0].title}
							</div>
						</a>
					</div>`;

	// generate list of other posts
	const otherPosts = posts
		.map((post, index) => {
			if (index != 0) {
				return `<li>
						<a href="${post.url}" target="_blank">
							${getPostImgUrl(post.content)}
							<div class="title">
								${post.title}
							</div>
						</a>
					</li>`;
			}
		})
		.join("");
	const list = `<div class="list"><ul>${otherPosts}</ul></div>`;

	// render featured and list
	bloggerPostsEl.innerHTML = featured;
	bloggerPostsEl.innerHTML += list;
}
renderPosts();

// get post image url
function getPostImgUrl(postContent) {
	const startIdx = postContent.indexOf("<img");
	const endIdx = postContent.indexOf("/>");

	if (startIdx == -1 || endIdx == -1) {
		return `<img src="/src/images/unknown.svg"`;
	} else {
		return postContent.slice(startIdx, endIdx + 2);
	}
}
