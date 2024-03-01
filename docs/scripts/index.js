// Color and time manipulation

const backgroundScale = chroma.bezier([
    "#010816", // 12am
    "#2F2F3D",
    "#514D56",
    "#706972", // 3am
    "#8D868C",
    "#C2BDBF",
    "#E8E3E3",
    "#FAF7F8", // 7am
    "#FCF3F3", // 8am
    "#FBF2EE",
    "#F9F5F0",
    "#F9F7EF",
    "#F6F6EE", // 12pm
    "#F2EFE4",
    "#EDE6D9",
    "#EEE0D3",
    "#EAD6CD", // 4pm
    "#E1CBC6",
    "#D3BFBB", // 6pm
    "#B998A3",
    "#91788D",
    "#58495B",
    "#342E38",
    "#17151E",
    "#010816" // 12am
]).scale().mode("lab").domain([0, 24]);

const strokeScale = chroma.bezier([
    "#B8C2FF", // 12am
    "#FFADC2",
    "#FF9EB2",
    "#FF8FA1", // 3am
    "#FF808F",
    "#FF707B",
    "#FF6165",
    "#FF4F4F", // 7am
    "#FF4242",
    "#FF3838",
    "#FF312E",
    "#FF2724",
    "#FF1D1A", // 12pm
    "#FF170F",
    "#FF0D05",
    "#FA0800",
    "#F00C00",
    "#E50B00",
    "#DB0B00", // 6pm
    "#D1000E",
    "#E50060",
    "#B200B2",
    "#C56CEF",
    "#A98AFF",
    "#B8C2FF" // 12am
]).scale().mode("lab").domain([0, 24]);

const textColors = {
    night: "#FFFFFF",
    dawn: "#FAF7F8",
    day: "#563138",
}

let computedStrokeColor = "#FFFFFF"

function setTextColors(h) {
    var textColor

    if (0 < h && h < 5) {
        textColor = textColors.dawn
    } else if (5 <= h && h < 19) {
        textColor = textColors.day
    } else {
        textColor = textColors.night
    }
    return textColor
}

function timeProvider() {
    let date = new Date()
    let localTime = date.toLocaleTimeString([],{
        "hour": "numeric",
        "minute": "numeric"
    }).replace(/ /g, "")
    let localHour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600
    let timeCollection = {
        "date": date,
        "localTime": localTime,
        "localHour": localHour
    }
    return timeCollection
}

function updateTime(hourMin) {
    document.getElementById("footer-time").innerHTML = hourMin.toLocaleLowerCase()
}

function updateColors(hour) {
    let computedBackgroundColor = backgroundScale(hour);
    let computedTextColor = setTextColors(hour);
    computedStrokeColor = strokeScale(hour);
    let computedTextSelectionColor = chroma(computedTextColor).alpha(0.25);
    let computedBackgroundColorTransparent = chroma(computedBackgroundColor).alpha(0);
    document.documentElement.style.setProperty("--background-color", computedBackgroundColor);
    document.documentElement.style.setProperty("--background-color-transparent", computedBackgroundColorTransparent);
    document.documentElement.style.setProperty("--text-color", computedTextColor);
    document.documentElement.style.setProperty("--text-selection-color", computedTextSelectionColor);
}

function updateTimeAndColor () {
    let timeCollection = timeProvider()
    updateTime(timeCollection.localTime);
    updateColors(timeCollection.localHour);
}

window.onload = updateTimeAndColor
document.addEventListener("DOMContentLoaded", updateTimeAndColor)
const interval = setInterval(updateTimeAndColor, 1000 * 60) // every 1 minute


// Nav bar transition effects
    
document.onscroll = () => {
    if (document.getElementsByTagName("main")[0].getBoundingClientRect().top < 152) {
        document.getElementsByTagName("nav")[0].classList.add("collapsed")
    } else {
        document.getElementsByTagName("nav")[0].classList.remove("collapsed")
    }
}


// Canvas drawing

const canvas = document.getElementById("can")
const ctx = canvas.getContext("2d")
const clearCanvas = document.getElementById("clear-canvas")
resize()

var pos = {
    x: 0,
    y: 0
}

function setPosition(e) {
    pos.x = e.clientX
    pos.y = e.clientY
}

function resize() {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
}

function draw(e) {
    if (e.buttons !== 1) return;
    ctx.beginPath();
    ctx.lineWidth = 70;
    ctx.lineCap = "round";
    ctx.strokeStyle = computedStrokeColor
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    clearCanvas.classList.add("available")
}

function clear() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    clearCanvas.classList.remove("available")
}

window.addEventListener("resize", resize)
document.addEventListener("mouseenter", setPosition)
document.addEventListener("mousedown", setPosition)
document.addEventListener("mousedown", draw)
document.addEventListener("mousemove", draw)


// Global click handler

document.addEventListener("click", function(e) {
    if (e.target) {
        if (e.target.parentNode.classList.contains("nav-menu-item")) {
            var item = e.target.parentNode
            var menuList = item.parentNode
            var index = Array.prototype.indexOf.call(menuList.children, item)
            var pages = document.getElementsByClassName("page")

            for (var i = 0; i < menuList.children.length; i++) {
                menuList.children[i].classList.remove("current")
                pages[i].classList.remove("current", "fadeIn")
            }
            menuList.children[index].classList.add("current")
            pages[index].classList.add("current")
            setTimeout(() => {
                pages[index].classList.add("fadeIn")
            }, 125) 
        } else if (e.target === clearCanvas) {
            clear()
        }
    }
})