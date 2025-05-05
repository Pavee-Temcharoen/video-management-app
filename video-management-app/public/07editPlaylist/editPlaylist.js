// * Lazy Loading ***************************************************************
document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll("img.lazy-img");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "100px" }); // Loads 100px before visible

    lazyImages.forEach(img => observer.observe(img));
});

// * Improve Scroll Performance ***************************************************************
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let img = entry.target;
            img.src = img.dataset.src;
            img.classList.add("loaded");
            observer.unobserve(img);
        }
    });
}, { rootMargin: "200px", threshold: 0.1 }); // Loads images 200px before they appear
// * Rename ***************************************************************
document.getElementById("rename-button").addEventListener("click", function () {
    let rename = document.getElementById("rename-input");
    let playlistName = document.getElementById("playlist-name")
    if( rename.value ){ playlistName.textContent = rename.value }
});

// * GO & RESET Button ***************************************************************
// Go ( each if some word match ) if want to change algorithm change these code
document.getElementById("go-button").addEventListener("click", function () {
    let searchInput = document.getElementById("search-input").value.trim().toLowerCase();

    // If input is empty, unhide all videos
    if (searchInput === "") {
        document.querySelectorAll(".search-box .each-video").forEach(video => {
            video.classList.remove("hide");
        });
        return;
    }

    let searchWords = searchInput.split(/\s+/).filter(Boolean);
    
    document.querySelectorAll(".search-box .each-video").forEach(video => {
        let searchAttr = video.getAttribute("search-engine").toLowerCase();
        let wordsMatched = searchWords.filter(word => searchAttr.includes(word)).length;
        
        let matchRatio = wordsMatched / searchWords.length; // Calculate match %

        if (matchRatio >= 0.7) { 
            video.classList.remove("hide"); 
        } else { 
            video.classList.add("hide"); 
        }
    });
});
//Reset
document.getElementById("reset-button").addEventListener("click", function () {
    document.getElementById("search-input").value = "";
    document.querySelectorAll(".search-box .each-video").forEach(video => {
        video.classList.add("hide");
    });
});

// * Submit *******************************************************************
let inputIdArray = document.getElementById("input-id");
let inputName = document.getElementById("input-name");
let playlistName = document.getElementById("playlist-name");
document.getElementById("submit-button").addEventListener("click", function () {
    
    let videoIds = [...document.querySelectorAll(".playlist-box .each-video")].map(video => 
        video.getAttribute("vid")
    );
    let videoName = playlistName.textContent
    inputIdArray.value = videoIds.join("+");
    inputName.value = videoName;
});
// * Back *******************************************************************
document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "http://localhost:3000/main/playlist";
});
// * Double Click Listener *******************************************************************
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".each-video").forEach(video => {
        video.addEventListener("dblclick", function () {
            const vid = video.getAttribute("vid");
            if (vid) {
                // Open in new tab with minimal features (may help)
                window.open(`/db/dataVid/vid/${vid}.mp4`, '_blank', 'noopener,noreferrer');
            }
        });
    });
});

// * Dragging ***************************************************************
const playlistBox = document.querySelector(".playlist-box");
const searchBox = document.querySelector(".search-box");

let draggedItem = null;

// Attach "X" & "+" Button Event Listeners on Page Load
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".playlist-box .remove-button").forEach(button => {
        button.addEventListener("click", removeFromPlaylist);
    });

    document.querySelectorAll(".search-box .add-button").forEach(button => {
        button.addEventListener("click", addToPlaylist);
    });
});

// Start dragging
function dragStart(event) {
    draggedItem = event.target.closest(".each-video");

    if (!draggedItem) return;

    draggedItem.classList.add("dragging");
    event.dataTransfer.setData("text/plain", draggedItem.getAttribute("vid"));

    // Mark source container
    if (draggedItem.parentElement.classList.contains("playlist-box")) {
        draggedItem.setAttribute("data-playlist", "true");
    } else {
        draggedItem.setAttribute("data-playlist", "false");
    }
}

// Remove dragging effect
document.addEventListener("dragend", function () {
    if (draggedItem) {
        draggedItem.classList.remove("dragging");
        draggedItem = null;
    }
});

// Allow drop inside containers
function allowDrop(event) {
    event.preventDefault();
}

// Handle drop event for moving items
function handleDrop(event, newParent) {
    event.preventDefault();

    if (!draggedItem) return;

    let oldParent = draggedItem.parentElement;

    // Prevent dragging from playlist-box to search-box via drag
    if (oldParent.classList.contains("playlist-box") && newParent.classList.contains("search-box")) {
        return;
    }

    // Find closest drop position inside `newParent`
    const afterElement = getDragAfterElement(newParent, event.clientY);

    if (afterElement == null) {
        newParent.appendChild(draggedItem);
    } else {
        newParent.insertBefore(draggedItem, afterElement);
    }

    updateButtonAndOrder(draggedItem, newParent);
}

// Update button type & order numbers
function updateButtonAndOrder(videoElement, newParent) {
    let button = videoElement.querySelector("button");
    let orderDiv = videoElement.querySelector(".order-div");

    if (newParent.classList.contains("playlist-box")) {
        // If moved INTO playlist-box
        button.classList.remove("add-button");
        button.classList.add("remove-button");
        button.innerHTML = "&times;";

        button.removeEventListener("click", addToPlaylist); // Prevent duplicate listeners
        button.addEventListener("click", removeFromPlaylist); // Attach remove event

        // Ensure order number exists
        if (!orderDiv) {
            orderDiv = document.createElement("div");
            orderDiv.classList.add("order-div");
            orderDiv.innerHTML = '<span class="order"></span>';
            videoElement.insertBefore(orderDiv, videoElement.firstChild);
        }

        updateVideoOrder();
    } else {
        // If moved INTO search-box
        button.classList.remove("remove-button");
        button.classList.add("add-button");
        button.textContent = "+";

        button.removeEventListener("click", removeFromPlaylist); // Remove "X" event
        button.addEventListener("click", addToPlaylist); // Attach "+" event

        // Remove order number
        if (orderDiv) {
            orderDiv.remove();
        }
        updateVideoOrder(); // this line add by Me (Delete it if cause Error)
    }
}

// Update Order Numbers Inside Playlist
function updateVideoOrder() {
    document.querySelectorAll(".playlist-box .each-video").forEach((video, index) => {
        let orderSpan = video.querySelector(".order");
        if (orderSpan) {
            orderSpan.textContent = index + 1;
        }
    });
}

// Enable Drag-and-Drop for Both Containers
[playlistBox, searchBox].forEach(container => {
    container.addEventListener("dragover", allowDrop);
    container.addEventListener("drop", function (event) {
        handleDrop(event, container);
    });
});

// Allow Reordering Within Playlist
playlistBox.addEventListener("dragover", function (event) {
    event.preventDefault();
    const draggingElement = document.querySelector(".dragging");
    if (!draggingElement) return;

    const afterElement = getDragAfterElement(playlistBox, event.clientY);

    if (afterElement == null) {
        playlistBox.appendChild(draggingElement);
    } else {
        playlistBox.insertBefore(draggingElement, afterElement);
    }
});

// Helper Function: Find Closest Drop Position
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".each-video:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Remove Video from Playlist & Move to Search
function removeFromPlaylist(event) {
    let videoElement = event.target.closest(".each-video");
    searchBox.appendChild(videoElement); // Move to search-box as last child
    updateButtonAndOrder(videoElement, searchBox);
    
}

// Add Video to Playlist from Search
function addToPlaylist(event) {
    let videoElement = event.target.closest(".each-video");
    playlistBox.appendChild(videoElement); // Move to playlist-box as last child
    updateButtonAndOrder(videoElement, playlistBox);
}