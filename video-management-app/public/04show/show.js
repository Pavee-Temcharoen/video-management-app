// * Starter ***************************************************************

// video player
const videoPlayer = document.getElementById("video");
// playlist (contain each tbn)
const playlist = document.getElementById("playlist");
// playlist display
const indexShow = document.getElementById("index-show");
const playlistSort = document.getElementById("playlist-sort");

// each tbn
let eachVideos = Array.from(document.querySelectorAll(".each-video"));
// each tbn (Original)
const originalOrder = [...eachVideos];

//Display Info
const title = document.getElementById("title-display");
const featBox = document.getElementById("feat-box");
const artistBox = document.getElementById("artist-box");
const tagBox = document.getElementById("tag-box");

let currentVideoIndex = 0; // track current index

playVideoByIndex(0); // play first video

changeDisplayInfo( eachVideos[0] ) // change display


// * Event Listener ***************************************************************

// Loop each-video and add click event
eachVideos.forEach((videoItem, index) => {
    videoItem.addEventListener("click", function (e) {
        // Ignore clicks button
        if ( e.target.classList.contains("stop-prop") ) {
            e.stopPropagation(); return;
            // **** for edit and add playlist function
        }
        changeDisplayInfo(videoItem)
        // Update Index
        refreshEachVideos();
        let index = eachVideos.indexOf(videoItem);
        playVideoByIndex(index);
    });
});

// Loop all edit button
document.querySelectorAll(".edit-button").forEach(button => {
    button.addEventListener("click", function(e) {
        e.stopPropagation();
        const vid = this.getAttribute("vid");
        if (vid) { window.location.href = `http://localhost:3000/main/${vid}` }
    });
});

// Event listener when current video ends
videoPlayer.addEventListener("ended", function () {
    let nextIndex = currentVideoIndex + 1;

    if (nextIndex >= eachVideos.length) { nextIndex = 0 } // restart

    playVideoByIndex(nextIndex); // playnext
    changeDisplayInfo(eachVideos[nextIndex])
});

// * Prev/Next Buttons ***************************************************************
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

nextButton.addEventListener("click", function () {
    let nextIndex = currentVideoIndex + 1;
    if (nextIndex >= eachVideos.length) nextIndex = 0;

    playVideoByIndex(nextIndex);
    changeDisplayInfo(eachVideos[nextIndex]);
});

prevButton.addEventListener("click", function () {
    let prevIndex = currentVideoIndex - 1;
    if (prevIndex < 0) prevIndex = eachVideos.length - 1;

    playVideoByIndex(prevIndex);
    changeDisplayInfo(eachVideos[prevIndex]);
});

// * Random Button ***************************************************************
const randomButton = document.getElementById("random-button");
randomButton.addEventListener("click", shufflePlaylist);

function shufflePlaylist() {

    shuffleArray(eachVideos);
    // Clear playlist and append New
    updatePlaylistUI()
    refreshEachVideos();

    // Reset Index & display
    currentVideoIndex = 0;
    playVideoByIndex(currentVideoIndex);
    changeDisplayInfo( eachVideos[0] )

    playlistSort.textContent = "(Random)"
}

function shuffleArray(array) { // Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// * Base Button (Restore Original Order) ***************************************
const baseButton = document.getElementById("base-button");
baseButton.addEventListener("click", restoreBasePlaylist);

function restoreBasePlaylist() {
    //  Restore Original Order
    eachVideos = [...originalOrder];

    updatePlaylistUI(); // Update UI
    refreshEachVideos();

    currentVideoIndex = 0;
    playVideoByIndex(currentVideoIndex);
    changeDisplayInfo( eachVideos[0] )

    playlistSort.textContent = "(Base)"
}

// * Score Button (Sort by Score) ***************************************
const scoreButton = document.getElementById("score-button");
scoreButton.addEventListener("click", sortPlaylistByScore);

function sortPlaylistByScore() {
    eachVideos.sort((a, b) => {
        return parseFloat(b.getAttribute("score")) - parseFloat(a.getAttribute("score"));
    });

    updatePlaylistUI();
    refreshEachVideos();
    currentVideoIndex = 0;
    playVideoByIndex(currentVideoIndex);
    changeDisplayInfo( eachVideos[0] )

    playlistSort.textContent = "(Score)"
}

// * Reverse Button (Reverse Order) ***************************************
const reverseButton = document.getElementById("reverse-button");
reverseButton.addEventListener("click", reversePlaylist);

function reversePlaylist() {
    eachVideos.reverse(); // Reverse the array

    updatePlaylistUI();   // Update DOM
    refreshEachVideos();  // Refresh reference

    currentVideoIndex = 0;
    playVideoByIndex(currentVideoIndex);
    changeDisplayInfo(eachVideos[0]);

    // Toggle " (Reverse)" in the sort label
    const text = playlistSort.textContent;
    const reverseTag = " (Reverse)";
    if (text.includes(reverseTag)) {
        playlistSort.textContent = text.replace(reverseTag, "");
    } else {
        playlistSort.textContent += reverseTag;
    }
}

// * Main Function ***************************************************************

// Function update & play video
function playVideoByIndex(index) {
    if (index >= 0 && index < eachVideos.length) {
        // Get video path & play
        const videoId = eachVideos[index].getAttribute("vid");

        videoPlayer.src  = `/db/dataVid/vid/${videoId}.mp4`;

        videoPlayer.load(); videoPlayer.play();

        refreshEachVideos();       // read Dom
        updateCurrentTbn(index);   // update highlight Tbn
        currentVideoIndex = index; // update counter
        updateIndexShow(index);    // update UI of Index Top Right Corner
    }
}

// * Helping Function ***************************************************************

function updateCurrentTbn(index) {
    eachVideos.forEach(vid => vid.classList.remove("current")); //reset
    eachVideos[index].classList.add("current");
}

function updatePlaylistUI() {
    playlist.innerHTML = ""; // Clear playlist
    eachVideos.forEach((video, newIndex) => {
        video.querySelector(".order").textContent = newIndex + 1; // Update order numbers
        playlist.appendChild(video); // Append reordered videos
    });
}

function refreshEachVideos() {
    eachVideos = Array.from(document.querySelectorAll(".each-video"));
}

function updateIndexShow(index) {
    const indexShow = document.getElementById("index-show");
    indexShow.textContent = `${index + 1}/${eachVideos.length}`;
}

function changeDisplayInfo(videoItem){
    // reset name
    let name = videoItem.getAttribute("title");
    title.textContent = name ;
    // reset feat artist tag
    removeAllChildFromParent(featBox)
    removeAllChildFromParent(artistBox)
    removeAllChildFromParent(tagBox)
    addEachToBox(videoItem,featBox,"feat")
    addEachToBox(videoItem,artistBox,"artist")
    addEachToBox(videoItem,tagBox,"tag")

}

function removeAllChildFromParent(par) {
    while (par.firstChild) { par.removeChild(par.firstChild) }
}

function addEachToBox(videoItem,parent,attribute){

    let arr = videoItem.getAttribute(attribute).split(",");
    arr.forEach(each => {
        const span = document.createElement("span");
        span.classList.add("each-related");
        span.textContent = each;
        parent.appendChild(span);
    });
}

// * Alter Button ***************************************************************
const alterButton = document.querySelector("#alter-button");
alterButton.addEventListener("click", () => {
    document.querySelector(".left").classList.toggle("left-alter");
    document.querySelector(".right").classList.toggle("right-alter");
    document.getElementById("playlist").classList.toggle("playlist-alter");
    document.querySelectorAll(".each-video").forEach(video => {
        video.classList.toggle("each-video-alter");
    });
    alterButton.textContent = alterButton.innerHTML === "[...][..]" ? "[..][...]" : "[...][..]";
});

// * Match Button (Smart Title Match & Play) ***************************************
const matchButton = document.getElementById("match-button");
const searchInput = document.getElementById("search-input");

matchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    let bestIndex = -1; let bestScore = -1;

    eachVideos.forEach((video, index) => {
        const title = video.getAttribute("title").toLowerCase();
        const score = computeSmartMatchScore(title, query); // change these line for other algorithm

        if (score > bestScore) { bestScore = score; bestIndex = index; }
    });

    if (bestIndex !== -1) {
        playVideoByIndex(bestIndex);
        changeDisplayInfo(eachVideos[bestIndex]);
    }

    /* searchInput.value = "" */
});

// Smart score: mix of word match and char overlap
function computeSmartMatchScore(title, query) {
    const titleWords = title.split(/[\s\[\]\(\)]/).filter(Boolean);
    const queryWords = query.split(/\s+/);

    let score = 0;

    queryWords.forEach(qWord => {
        titleWords.forEach(tWord => {
            if (tWord === qWord) {
                score += 10; // exact word match
            } else if (tWord.includes(qWord)) {
                score += 2; // partial match
            }
        });
    });

    // Add loose character overlap score
    score += looseCharOverlapScore(title, query) * 0.5;

    return score;
}

function looseCharOverlapScore(a, b) {
    let score = 0;
    const aSet = new Set(a);
    for (let ch of b) {
        if (aSet.has(ch)) score++;
    }
    return score;
}

// * Microphone ***************************************
const voiceButtons = document.querySelectorAll(".voice-button");

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let activeButton = null;

    voiceButtons.forEach(button => {
        button.addEventListener("click", () => {
            const lang = button.dataset.lang;
            recognition.lang = lang;

            activeButton = button;
            button.textContent = "🎙️";
            try {
                recognition.start();
                // Timeout fallback in case recognition doesn't respond
                setTimeout(() => {
                    recognition.abort(); // force-stop if stuck
                    resetVoiceButton(activeButton);
                }, 5000); // 6 seconds max wait
            } catch (err) {
                console.error("Recognition start failed:", err);
                resetVoiceButton(activeButton);
            }
        });
    });

    recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        matchButton.click(); // trigger search
        if (activeButton) activeButton.textContent = activeButton.title.includes("Thai") ? "🎤🇹🇭"
                                     : activeButton.title.includes("English") ? "🎤🇬🇧"
                                     : "🎤🇯🇵";
    });

    recognition.addEventListener("end", () => {
        if (activeButton) activeButton.textContent = activeButton.title.includes("Thai") ? "🎤🇹🇭"
                                     : activeButton.title.includes("English") ? "🎤🇬🇧"
                                     : "🎤🇯🇵";
    });

    recognition.addEventListener("error", (e) => {
        console.error("Speech recognition error:", e.error);
        if (activeButton) activeButton.textContent = activeButton.title.includes("Thai") ? "🎤🇹🇭"
                                     : activeButton.title.includes("English") ? "🎤🇬🇧"
                                     : "🎤🇯🇵";
    });

} else {
    voiceButtons.forEach(btn => {
        btn.disabled = true;
        btn.title = "Speech Recognition not supported in this browser";
    });
}

function resetVoiceButton(btn) {
    if (!btn) return;
    const title = btn.title;
    btn.textContent = title.includes("Thai") ? "🎤🇹🇭"
        : title.includes("English") ? "🎤🇬🇧"
        : "🎤🇯🇵";
}