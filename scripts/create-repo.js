import dotenv from "dotenv";
dotenv.config();

fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
        "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
    },
    body: JSON.stringify({ name: "digitalexpensetracker" })
})
.then(res => res.json())
.then(console.log);