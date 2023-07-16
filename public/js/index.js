async function submit() {
    let username = document.getElementById("username").value.split("/")[4];
    window.location = `/submit?username=${username}`;
}