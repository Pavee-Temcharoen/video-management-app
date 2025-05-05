const listContainer = document.getElementById("list-container");
const spans = document.querySelectorAll('.list-container span');
const searchInput = document.getElementById("search");
const searchHeader = document.getElementById("search-header");

const featButton = document.getElementById("feat-button");
const artistButton = document.getElementById("artist-button");
const tagButton = document.getElementById("tag-button");

// SEARCH BAR ********************************************************
searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    
    spans.forEach(span => {
      const text = span.textContent.toLowerCase();
      if (text.includes(filter)) { span.classList.remove('hideSearch');
      } else { span.classList.add('hideSearch'); }
    });
});

// RESET ********************************************************
const reset = document.getElementById("reset");
reset.addEventListener('click', (e) => {
    searchInput.value = ""; 
    spans.forEach(span => { span.classList.remove('hideSearch'); });
});

// BACK ********************************************************
const back = document.getElementById("back");
back.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "/main";

});

// FEAT ********************************************************
const featList = document.querySelectorAll(".feat-each");
const featInput = document.getElementById("vFeat");

// click button => show all each-feat
featButton.addEventListener('click',(e) => {
    // reset text input
    searchInput.value = "";
    // hide all
    Array.from(listContainer.children).forEach(child => {
        child.classList.add('hide','hideSearch');
    });
    // show only feat
    featList.forEach(mem => { mem.classList.remove('hide','hideSearch') });
    // change header
    searchHeader.textContent = "Feat: Info"
});

// click each-feat => add text to text input
featList.forEach(mem => {
    mem.addEventListener('click',(e) => {
        let each = e.target.textContent;
        if(featInput.value) { featInput.value += `+${each}` }
        else{ featInput.value += each }
    })
});

// 

// ARTIST ********************************************************
const artistList = document.querySelectorAll(".artist-each");
const artistInput = document.getElementById("vArtist");

// click button => show all each-feat
artistButton.addEventListener('click',(e) => {
    // reset text input
    searchInput.value = "";
    // hide all
    Array.from(listContainer.children).forEach(child => {
        child.classList.add('hide','hideSearch');
    });
    // show only feat
    artistList.forEach(mem => { mem.classList.remove('hide','hideSearch') });
    // change header
    searchHeader.textContent = "Artist: Info"
});

// click each-feat => add text to text input
artistList.forEach(mem => {
    mem.addEventListener('click',(e) => {
        let each = e.target.textContent;
        if(artistInput.value) { artistInput.value += `+${each}` }
        else{ artistInput.value += each }
    })
});

// TAG ********************************************************
const tagList = document.querySelectorAll(".tag-each");
const tagInput = document.getElementById("vTag");

// click button => show all each-feat
tagButton.addEventListener('click',(e) => {
    // reset text input
    searchInput.value = "";
    // hide all
    Array.from(listContainer.children).forEach(child => {
        child.classList.add('hide','hideSearch');
    });
    // show only feat
    tagList.forEach(mem => { mem.classList.remove('hide','hideSearch') });
    // change header
    searchHeader.textContent = "Tag: Info"      
});

// click each-feat => add text to text input
tagList.forEach(mem => {
    mem.addEventListener('click',(e) => {
        let each = e.target.textContent;
        if(tagInput.value) { tagInput.value += `+${each}` }
        else{ tagInput.value += each }
    })
});