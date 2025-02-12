var count = 10 + 1,
    durationTime = 400,
    array = [],
    unsortedArray = [...array],
    sortedArray = [],
    stop = false;

var margin = { top: 40, right: 40, bottom: 180, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var barWidth = width / count;

var x = d3.scaleLinear()
    .domain([0, count])
    .range([0, width]);

var svg = d3.select('.sh').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var rects, labels;

// Function to handle submit
function submit() {
    document.getElementById("submit").disabled = true;

    var array2 = document.getElementById("array");
    array2 = array2.value.split(" ").map(function (item) {
        return parseInt(item, 10);
    });
    array = array2;
    unsortedArray = [...array];

    // Bind data to rectangles
    rects = svg.selectAll("rect")
        .data(unsortedArray)
        .enter().append("rect");

    rects.attr("id", function (d, i) { return "rect" + i; })
        .attr("transform", function (d, i) { return "translate(" + (x(i) - barWidth) + ",0)"; })
        .attr("width", barWidth * .9)
        .attr("height", function (d) { return d * barWidth / 3; })
        .attr("y", function (d) { return 400 - d * barWidth / 3; });

    // Bind data to labels
    labels = svg.selectAll("text")
        .data(unsortedArray)
        .enter().append("text");

    labels.attr("id", function (d, i) { return "text" + i; })
        .attr("transform", function (d, i) { return "translate(" + (x(i)) + ",0)"; })
        .html(function (d) { return d; })
        .attr("class", "unsorted");
}

// Function to reset the bars and state
function reset() {
    unsortedArray = [...array];
    sortedArray = [];
    stop = false;

    // Reset labels
    labels.attr("class", "")
        .transition().duration(2000)
        .attr("transform", function (d, i) { return "translate(" + (x(i)) + ", 0)"; })
        .attr("class", "unsorted");

    // Reset rectangles
    rects.attr("class", "")
        .transition().duration(2000)
        .attr("transform", function (d, i) { return "translate(" + (x(i) + barWidth * (i - 1)) + ", 0)"; })
        .attr("y", function (d) { return 400 - d * barWidth / 3; });
}

// Insertion sort function
function insertionSort() {
    if (unsortedArray.length === 0) return;

    var value = unsortedArray.shift();
    sortedArray.push(value);
    reArrange(sortedArray.length - 1);

    function reArrange(n) {
        if (stop) return stop = false;

        d3.selectAll("rect").attr("class", "");
        d3.select("#rect" + n).attr("class", "testing");
        d3.select("#text" + n).attr("class", "sorted");

        if (n > 0 && sortedArray[n - 1] > value) {
            d3.timeout(function () {
                sortedArray.splice(n, 1);
                sortedArray.splice(n - 1, 0, value);

                // Update the rectangles and labels
                updateBarsAndLabels();

                // Recursively call reArrange
                reArrange(--n);
            }, durationTime * 2);
        } else if (unsortedArray.length) {
            d3.timeout(function () { insertionSort(); }, durationTime * 2);
        } else {
            d3.selectAll("rect").attr("class", "").attr("style", "fill:rgb(10, 223, 28)");
        }
    }
}

// Function to update bars and labels
function updateBarsAndLabels() {
    // Select all rectangles and bind data
    rects.data(sortedArray)
        .transition().duration(durationTime)
        .attr("transform", function (d, i) { return "translate(" + (x(i)) + ",0)"; })
        .attr("height", function (d) { return d * barWidth / 3; })
        .attr("y", function (d) { return 400 - d * barWidth / 3; });

    // Update labels
    labels.data(sortedArray)
        .transition().duration(durationTime)
        .attr("transform", function (d, i) { return "translate(" + (x(i)) + ",0)"; })
        .text(function (d) { return d; });
}

// Function to slide elements during sorting
function slide(d, i) {
    // Slide text
    d3.select("#text" + d)
        .transition().duration(durationTime)
        .attr("transform", "translate(" + (x(i)) + ", 0)");

    // Slide rectangle
    d3.select("#rect" + d)
        .transition().duration(durationTime)
        .attr("transform", "translate(" + (x(i)) + ", 0)");
}
