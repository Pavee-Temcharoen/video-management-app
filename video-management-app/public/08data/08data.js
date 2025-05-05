// MAIN ***********************************************************************

// Set Up Plug-In for total-sum
Chart.register(ChartDataLabels);

// create graph after load html
document.addEventListener('DOMContentLoaded', () => {
    renderFeatBarChart(allVidObj);
    renderArtistBarChart(allVidObj);
    renderPieChart(allVidObj, 'all');
    renderHistogram(allVidObj);
});

// create graph after resize window
/* simulate checkbox change, and trigger your existing filterAndRender()  */
window.addEventListener('resize', () => {
    const event = new Event('change');
    document.querySelector('input[name="tag-filter"]').dispatchEvent(event);
});

// holds current chart instance so we can destroy and recreate it
let featChartInstance = null;
let artistChartInstance = null;
let pieChartInstance = null;
let hisChartInstance = null;



// FEAT H-BAR ***********************************************************************
function renderFeatBarChart(dataObj) {

    // remove old feat graph if exist
    if (featChartInstance) { featChartInstance.destroy();}

    const featMap = {};

    const scoreBuckets = ['17.5-20', '15-17.5', '12.5-15', '10-12.5', '0-10'];
    const bucketColors = ['#731212', '#b82828', '#ff6262', '#ff9e9e', '#ffd6d6'];

    for (const vid of Object.values(dataObj)) {
        const score = vid.vScore;
        let bucketIndex = 4; // default 0-10
        if (score >= 17.5) bucketIndex = 0;
        else if (score >= 15) bucketIndex = 1;
        else if (score >= 12.5) bucketIndex = 2;
        else if (score >= 10) bucketIndex = 3;
    
        for (const feat of vid.vFeat || []) {
            const name = feat.trim();
            if (!featMap[name]) featMap[name] = [0, 0, 0, 0, 0];
            featMap[name][bucketIndex] += 1;
        }
    } // { vfeat1: [4, 7, 6, 9, 0] , ... } => 4 is qty in range [17.5-20]
    
    // Sort by total count
    const sortedFeatList = Object.entries(featMap)
        .map(([name, buckets]) => ({
            name,
            shortLabel: name.length > 10 ? name.slice(0, 10) + '..' : name,
            buckets,
            total: buckets.reduce((a, b) => a + b, 0)
        }))
        .sort((a, b) => b.total - a.total); 
        // [{},{},{}]
        // { name: hoshimachi suisei , shortLabel: hoshima.., bucket: [4,7,6,9,0], total: 26 }

    const maxTotal = sortedFeatList.length > 0
    ? Math.max(...sortedFeatList.map(d => d.total)) : 0; // to shift max-x

    const labels = sortedFeatList.map(d => d.shortLabel); // [ado, yao.., sambo.. ]
    const fullLabels = sortedFeatList.map(d => d.name); // [ado, yaosobi, sambomaster ]
    
    // Create 5 datasets (stacked bars)
    const datasets = bucketColors.map((color, i) => {    // ['#731212', '#b82828', ... ]
        const dataset = {
            label: scoreBuckets[i],                      // ['17.5-20', '15-17.5', ... ]
            data: sortedFeatList.map(d => d.buckets[i]), // bucket: [4,7,6,9,0]
            backgroundColor: color,
            stack: 'score-stack'                         // Makes 5 datasets stack in one bar
        };
    
        if (i === 4) {  // Add total label only on last segment
            dataset.datalabels = {
                anchor: 'end', align: 'end', offset: 4, clip: false,
                color: 'antiquewhite',
                font: { weight: 'bold' },
                formatter: (value, context) => {
                    const index = context.dataIndex;
                    const sum = sortedFeatList[index].buckets.reduce((a, b) => a + b, 0);
                    return sum; // total QTY
                }
            };
        }   
        return dataset;
    });
    // datasets sample
    /* [{ label: '17.5–20', data: [3,2, ..], backgroundColor: '#731212'},
        ...
        { label: '0–10', data: [0,0, ..], backgroundColor: '#ffd6d6',
            datalabels: { formatter: totalSum, ... }}] */
    
    
    // Create Chart 
    const canvas = document.getElementById('bar-chart-feat-canvas');
    const barHeight = 25; // each bar 25px of height

    canvas.height = sortedFeatList.length * barHeight; //chart height = 25 * num of y-axis data
    canvas.width = canvas.parentElement.clientWidth; // act like width = 100%

    const ctx = canvas.getContext('2d'); // 2d drawing

    // Draw Chart
    featChartInstance = new Chart(ctx, {
        type: 'bar',    // bar-chart
        data: {         
            labels,     // y-axis: shortened vocalist names
            datasets    // x-axis: 5 segments per bar (stacked)
        },
        options: {
            indexAxis: 'y',              // horizontal
            responsive: false,           // disable auto-resize (manula only)
            maintainAspectRatio: false,  // allow custom height
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: function (tooltipItems) {
                            const idx = tooltipItems[0].dataIndex;
                            return fullLabels[idx]; // full name
                        },
                        label: function (tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                        }
                    }
                },
                datalabels: {
                    display: function(context) {
                        // Only enable on datasets that define their own formatter
                        return !!context.dataset.datalabels;
                    }
                }
            },
            scales: {
                x: { 
                    stacked: true,
                    min: 0,
                    max: Math.ceil(maxTotal * 1.1), // Add 10% headroom
                    ticks: { color: 'antiquewhite' },
                    grid: { color: '#3a0a0a' }
                },
                y: { 
                    stacked: true, 
                    ticks: { color: 'antiquewhite' },
                    grid: { color: '#3a0a0a' }
                }
            }
        }
    });
}

// Artist H-BAR ***********************************************************************
function renderArtistBarChart(dataObj) {
    if (artistChartInstance) { artistChartInstance.destroy(); }

    const artistMap = {};
    const scoreBuckets = ['17.5-20', '15-17.5', '12.5-15', '10-12.5', '0-10'];
    const bucketColors = ['#001f3f', '#0074D9', '#7FDBFF', '#cceeff', '#e6f7ff']; // blue tones

    for (const vid of Object.values(dataObj)) {
        const score = vid.vScore;
        let bucketIndex = 4;
        if (score >= 17.5) bucketIndex = 0;
        else if (score >= 15) bucketIndex = 1;
        else if (score >= 12.5) bucketIndex = 2;
        else if (score >= 10) bucketIndex = 3;

        for (const artist of vid.vArtist || []) {
            const name = artist.trim();
            if (!artistMap[name]) artistMap[name] = [0, 0, 0, 0, 0];
            artistMap[name][bucketIndex] += 1;
        }
    }

    const sortedArtistList = Object.entries(artistMap)
        .map(([name, buckets]) => ({
            name,
            shortLabel: name.length > 10 ? name.slice(0, 10) + '..' : name,
            buckets,
            total: buckets.reduce((a, b) => a + b, 0)
        }))
        .sort((a, b) => b.total - a.total);

    const maxTotal = sortedArtistList.length > 0
    ? Math.max(...sortedArtistList.map(d => d.total))
    : 0;

    const labels = sortedArtistList.map(d => d.shortLabel);
    const fullLabels = sortedArtistList.map(d => d.name);

    const datasets = bucketColors.map((color, i) => {
        const dataset = {
            label: scoreBuckets[i],
            data: sortedArtistList.map(d => d.buckets[i]),
            backgroundColor: color,
            stack: 'score-stack'
        };

        if (i === 4) {
            dataset.datalabels = {
                anchor: 'end',
                align: 'end',
                offset: 4,
                clip: false,
                color: 'antiquewhite',
                font: { weight: 'bold' },
                formatter: (value, context) => {
                    const index = context.dataIndex;
                    const sum = sortedArtistList[index].buckets.reduce((a, b) => a + b, 0);
                    return sum;
                }
            };
        }

        return dataset;
    });

    const canvas = document.getElementById('bar-chart-artist-canvas');
    const barHeight = 25;
    canvas.height = sortedArtistList.length * barHeight;
    canvas.width = canvas.parentElement.clientWidth;

    const ctx = canvas.getContext('2d');

    artistChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets
        },
        options: {
            indexAxis: 'y',
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: function (tooltipItems) {
                            const idx = tooltipItems[0].dataIndex;
                            return fullLabels[idx];
                        },
                        label: function (tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                        }
                    }
                },
                datalabels: {
                    display: function(context) {
                        return !!context.dataset.datalabels;
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    min: 0,
                    max: Math.ceil(maxTotal * 1.1),
                    ticks: { color: 'antiquewhite' },
                    grid: { color: '#0a0a73' } // blue-toned grid
                },
                y: {
                    stacked: true,
                    ticks: { color: 'antiquewhite' },
                    grid: { color: '#0a0a73' }
                }
            }
        }
    });
}

// PIE-CHART ***********************************************************************
function renderPieChart(dataObj, selectedTag) {
    if (pieChartInstance) { pieChartInstance.destroy(); }

    const totalVideos = Object.keys(allVidObj).length;
    let matchedCount = 0;

    if (selectedTag !== 'all') {
        for (const video of Object.values(allVidObj)) {
            if (Array.isArray(video.vTag) && video.vTag.includes(selectedTag)) {
                matchedCount++;
            }
        }
    } else { matchedCount = totalVideos }

    const unmatchedCount = totalVideos - matchedCount;
    const data = selectedTag === 'all'
        ? [matchedCount]
        : [matchedCount, unmatchedCount];

    const labels = selectedTag === 'all'
        ? ['All']
        : [`${selectedTag}`, 'Others'];

    const ctx = document.getElementById('pie-chart-canvas').getContext('2d');

    pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: selectedTag === 'all'
                    ? ['rgb(50,80,50)']
                    : ['rgb(12, 88, 12)','rgb(50,70,50)'],
                borderWidth: 1,
                borderColor: '#111'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const percent = ((value / totalVideos) * 100).toFixed(1);
                            return `${value} (${percent}%)`;
                        }
                    }
                },
                datalabels: {
                    formatter: (value, context) => {
                        const label = context.chart.data.labels[context.dataIndex];             
                        const percent = ((value / totalVideos) * 100).toFixed(1);
                        return `${cleanString(label)}\n(${percent}%)`;
                    },
                    color: 'antiquewhite',
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    align: 'center',
                    anchor: 'center',
                    clamp: true,
                    padding: 6
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// HISTROGRAM-CHART ***********************************************************************
function renderHistogram(dataObj) {
    if (hisChartInstance) hisChartInstance.destroy();

    // Create 20 bins: 0–1, 1–2, ..., 19–20
    const binCount = 20;
    const binLabels = Array.from({ length: binCount }, (_, i) => `${i}-${i + 1}`);
    const binData = new Array(binCount).fill(0);

    for (const vid of Object.values(dataObj)) {
        const score = vid.vScore;
        const bucket = Math.min(Math.floor(score), binCount - 1);
        binData[bucket]++;
    }

    const canvas = document.getElementById('his-chart-canvas');
    const ctx = canvas.getContext('2d');

    hisChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Score Distribution',
                data: binData,
                backgroundColor: 'rgba(128, 0, 128, 0.6)',
                borderColor: 'rgb(180, 100, 255)',
                borderWidth: 1,
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: 'antiquewhite',
                    font: { weight: 'bold', size: 12 },
                    formatter: (value) => value
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `Count: ${ctx.raw}`
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Score', color: 'antiquewhite' },
                    ticks: { color: 'antiquewhite' },
                    grid: { color: '#3a0a3a' }
                },
                y: {
                    title: { display: true, text: 'Quantity', color: 'antiquewhite' },
                    ticks: { color: 'antiquewhite' },
                    grid: { color: '#3a0a3a' }
                }
            }
        }
    });
}

// FILTER LOGIC FOR RADIO ***************************************************************
document.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll('input[name="tag-filter"]');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selected = document.querySelector('input[name="tag-filter"]:checked')?.value;

            // If "all" is selected, use full dataset
            if (selected === 'all') {
                renderFeatBarChart(allVidObj);
                renderArtistBarChart(allVidObj);
                renderPieChart(allVidObj, 'all');
                renderHistogram(allVidObj);
                return;
            }
            // Filter data by selected tag
            const filteredObj = {};

            for (const [vid, data] of Object.entries(allVidObj)) {
                if (!Array.isArray(data.vTag)) continue;

                // exact match, e.g. "Rock(Genre)"
                if (data.vTag.includes(selected)) { filteredObj[vid] = data }
            }
            renderFeatBarChart(filteredObj);
            renderArtistBarChart(filteredObj);
            renderPieChart(allVidObj, selected);
            renderHistogram(filteredObj);
        });
    });
});


// HELPING FUNC ***************************************************************
function cleanString(str) {
    return str.replace(/\s*\(.*?\)/g, '').trim();
}