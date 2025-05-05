

// FEATURE ********************************************************

const featList = document.querySelectorAll('.feat-each');
const featInput = document.getElementById("feat");
const featBox = document.getElementById("feat-box");
const featReset = document.getElementById("feat-reset");
const featDelete = document.getElementById("feat-delete");
const featSearch = document.getElementById("feat-search");

// back button
const backButton = document.getElementById("back-button");
backButton.addEventListener('click',(e) => {
    e.preventDefault();
    window.location.href = `http://localhost:3000/main`;
})

// click each-feat => add text to text input
featList.forEach(mem => {
    mem.addEventListener('click',(e) => {
        // add to input
        let each = e.target.textContent;
        if(featInput.value) { featInput.value += `+${each}` }
        else{ featInput.value += each }
        // add to box
        let div = createDiv("", each);
        appendIfNoMatch(featBox, div, each);
    })
});
// click delete button (clear search & unhide all)
featDelete.addEventListener('click',(e) => {
    featSearch.value = "";
    featList.forEach(feat => { feat.classList.remove('hide') });
})
// click reset button (delete all selected)
featReset.addEventListener('click',(e) => {
    featInput.value = "";
    removeAllChildren(featBox);
})
// search algoritm
featSearch.addEventListener('input', () => {
    const filter = featSearch.value.toLowerCase();
    
    featList.forEach(feat => {
      const text = feat.textContent.toLowerCase();
      if (text.includes(filter)) { feat.classList.remove('hide');
      } else { feat.classList.add('hide'); }
    });
});

// Artist ********************************************************

const artistList = document.querySelectorAll('.artist-each');
const artistInput = document.getElementById("artist");
const artistBox = document.getElementById("artist-box");
const artistReset = document.getElementById("artist-reset");
const artistDelete = document.getElementById("artist-delete");
const artistSearch = document.getElementById("artist-search");

// click each-feat => add text to text input
artistList.forEach(mem => {
    mem.addEventListener('click',(e) => {
        // add to input
        let each = e.target.textContent;
        if(artistInput.value) { artistInput.value += `+${each}` }
        else{ artistInput.value += each }
        // add to box
        let div = createDiv("", each);
        appendIfNoMatch(artistBox, div, each);
    })
});
// click delete button (clear search & unhide all)
artistDelete.addEventListener('click',(e) => {
    artistSearch.value = "";
    artistList.forEach(artist => { artist.classList.remove('hide') });
})
// click reset button (delete all selected)
artistReset.addEventListener('click',(e) => {
    artistInput.value = "";
    removeAllChildren(artistBox);
})
// search algoritm
artistSearch.addEventListener('input', () => {
    const filter = artistSearch.value.toLowerCase();
    
    artistList.forEach(artist => {
      const text = artist.textContent.toLowerCase();
      if (text.includes(filter)) { artist.classList.remove('hide');
      } else { artist.classList.add('hide'); }
    });
});

// Including ********************************************************

const tagPList = document.querySelectorAll('.tagP-each');
const tagPInput = document.getElementById("tagPositive");
const tagPBox = document.getElementById("tagP-box");
const tagPReset = document.getElementById("tagP-reset");
const tagPDelete = document.getElementById("tagP-delete");
const tagPSearch = document.getElementById("tagP-search");

// click each-feat => add text to text input
tagPList.forEach(mem => {
    mem.addEventListener('click',(e) => {
        // add to input
        let each = e.target.textContent;
        if(tagPInput.value) { tagPInput.value += `+${each}` }
        else{ tagPInput.value += each }
        // add to box
        let div = createDiv("", each);
        appendIfNoMatch(tagPBox, div, each);
    })
});
// click delete button (clear search & unhide all)
tagPDelete.addEventListener('click',(e) => {
    tagPSearch.value = "";
    tagPList.forEach(tagP => { tagP.classList.remove('hide') });
})
// click reset button (delete all selected)
tagPReset.addEventListener('click',(e) => {
    tagPInput.value = "";
    removeAllChildren(tagPBox);
})
// search algoritm
tagPSearch.addEventListener('input', () => {
    const filter = tagPSearch.value.toLowerCase();
    
    tagPList.forEach(tagP => {
      const text = tagP.textContent.toLowerCase();
      if (text.includes(filter)) { tagP.classList.remove('hide');
      } else { tagP.classList.add('hide'); }
    });
});

// Helping Function ********************************************************

function appendIfNoMatch(parent, child, text) {
    const children = Array.from(parent.children); 
    const hasMatch = children.some(each => each.textContent.trim() === text);
    
    if (!hasMatch) {
        parent.appendChild(child);
    }
}

// Excluding ********************************************************

const tagNList = document.querySelectorAll('.tagN-each');
const tagNInput = document.getElementById("tagNegative");
const tagNBox = document.getElementById("tagN-box");
const tagNReset = document.getElementById("tagN-reset");
const tagNDelete = document.getElementById("tagN-delete");
const tagNSearch = document.getElementById("tagN-search");

// click each-feat => add text to text input
tagNList.forEach(mem => {
    mem.addEventListener('click',(e) => {
        // add to input
        let each = e.target.textContent;
        if(tagNInput.value) { tagNInput.value += `+${each}` }
        else{ tagNInput.value += each }
        // add to box
        let div = createDiv("", each);
        appendIfNoMatch(tagNBox, div, each);
    })
});
// click delete button (clear search & unhide all)
tagNDelete.addEventListener('click',(e) => {
    tagNSearch.value = "";
    tagNList.forEach(tagN => { tagN.classList.remove('hide') });
})
// click reset button (delete all selected)
tagNReset.addEventListener('click',(e) => {
    tagNInput.value = "";
    removeAllChildren(tagNBox);
})
// search algoritm
tagNSearch.addEventListener('input', () => {
    const filter = tagNSearch.value.toLowerCase();
    
    tagNList.forEach(tagN => {
      const text = tagN.textContent.toLowerCase();
      if (text.includes(filter)) { tagN.classList.remove('hide');
      } else { tagN.classList.add('hide'); }
    });
});

// Helping Function ********************************************************

function appendIfNoMatch(parent, child, text) {
    const children = Array.from(parent.children); 
    const hasMatch = children.some(each => each.textContent.trim() === text);
    
    if (!hasMatch) {
        parent.appendChild(child);
    }
}

function createDiv(className, text) {
    const div = document.createElement("div"); // Create div element
    div.className = className; // Assign class
    div.textContent = text; // Set text content
    return div; // Return the created div
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}