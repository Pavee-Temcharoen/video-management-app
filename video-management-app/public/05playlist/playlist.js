// * Sort by Title *************************************************************************
document.getElementById("title").addEventListener("click", () => {
    let container = document.querySelector(".bottom");
    let playlists = Array.from(container.querySelectorAll(".each-playlist"));

    playlists.sort((a, b) => {
        let nameA = a.querySelector(".each-header").textContent.toLowerCase();
        let nameB = b.querySelector(".each-header").textContent.toLowerCase();
        return nameA.localeCompare(nameB);
    });
    // Clear and re-append
    container.innerHTML = "";
    playlists.forEach(p => container.appendChild(p));
});

// * Sort by Qty Des *************************************************************************
document.getElementById("qty-button").addEventListener("click", () => {
    let container = document.querySelector(".bottom");
    let playlists = Array.from(container.querySelectorAll(".each-playlist"));

    playlists.sort((a, b) => {
        let qtyA = parseInt(a.getAttribute("qty"), 10);
        let qtyB = parseInt(b.getAttribute("qty"), 10);
        return qtyB - qtyA; Des
    });
    // Clear and re-append
    container.innerHTML = "";
    playlists.forEach(p => container.appendChild(p));
});

// * Search Listener *************************************************************************
document.getElementById("search-input").addEventListener("input", () => {
    let searchValue = document.getElementById("search-input").value.toLowerCase();
    let playlists = document.querySelectorAll(".each-playlist");

    playlists.forEach(playlist => {
        let title = playlist.querySelector(".each-header").textContent.toLowerCase();
        if (title.includes(searchValue)) { playlist.classList.remove("hide")}
        else { playlist.classList.add("hide") }
    });
});

// * Reset *************************************************************************
document.getElementById("reset-button").addEventListener("click", () => {
    let searchInput = document.getElementById("search-input");
    searchInput.value = "";

    document.querySelectorAll(".each-playlist").forEach(playlist => {
        playlist.classList.remove("hide");
    });
});

// * Back *************************************************************************
document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "http://localhost:3000/main";
});

// * Edit *************************************************************************
// Loop all edit button
document.querySelectorAll(".edit-button").forEach(button => {
    button.addEventListener("click", function(e) {
        e.stopPropagation();
        const title = this.getAttribute("title");
        if (title ) { window.location.href = `http://localhost:3000/main/playlist/${title }` }
    });
});

// * Add *************************************************************************
document.getElementById("add-button").addEventListener("click", function(e) {
    e.stopPropagation();
    if (title ) { window.location.href = `http://localhost:3000/main/playlist/NewPlaylist` }
});