const form = document.getElementById("githubForm");
const userInfo = document.getElementById("userInfo");
const repoList = document.getElementById("repoList");

form.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    if (!username) return;

    const userUrl = `https://api.github.com/users/${username}`;
    const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`;

    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(userUrl),
            fetch(reposUrl)
        ]);

        if (!userRes.ok) {
            userInfo.innerHTML = `<p>User not found</p>`;
            repoList.innerHTML = "";
            return;
        }

        const user = await userRes.json();
        const repos = await reposRes.json();

        userInfo.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}'s avatar">
            <h2>${user.name || "No name provided"} (${user.login})</h2>
            <p><strong>GitHub:</strong> <a href="${user.html_url}" target="_blank">${user.html_url}</a></p>
            ${user.blog ? `<p><strong>Blog:</strong> <a href="${user.blog}" target="_blank">${user.blog}</a></p>` : ""}
            <p><strong>Location:</strong> ${user.location || "N/A"}</p>
            <p><strong>Email:</strong> ${user.email || "Not public"}</p>
            <p><strong>Followers:</strong> ${user.followers} | <strong>Following:</strong> ${user.following}</p>
        `;

        repoList.innerHTML = repos.length
            ? repos.map(repo => `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a>: ${repo.description || "No description"}</li>`).join("")
            : "<li>No public repositories</li>";

    } catch (error) {
        userInfo.innerHTML = `<p>Error fetching data</p>`;
        repoList.innerHTML = "";
        console.error("Fetch error:", error);
    }
};
