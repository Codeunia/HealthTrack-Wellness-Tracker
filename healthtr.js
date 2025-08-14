let currentDate = new Date();
let waterGoal = 8;
let sleepGoal = 7;

let dailyData = {}; 
let streakDays = 0;
let totalDays = 0;

function loadData() {
    const saved = localStorage.getItem("wellnestData");
    if (saved) {
        const parsed = JSON.parse(saved);
        dailyData = parsed.dailyData || {};
        waterGoal = parsed.waterGoal || 8;
        sleepGoal = parsed.sleepGoal || 7;
        streakDays = parsed.streakDays || 0;
        totalDays = parsed.totalDays || 0;
    }
}

function saveData() {
    localStorage.setItem(
        "wellnestData",
        JSON.stringify({
            dailyData,
            waterGoal,
            sleepGoal,
            streakDays,
            totalDays
        })
    );
}

function formatDate(date) {
    return date.toDateString(); 
}

function changeDate(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    updateUI();
}

function getTodayData() {
    const key = formatDate(currentDate);
    if (!dailyData[key]) {
        dailyData[key] = { water: 0, sleep: 0 };
        totalDays++;
    }
    return dailyData[key];
}

function updateProgressCircle(id, value, goal) {
    const circle = document.getElementById(id);
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(value / goal, 1);
    const offset = circumference * (1 - percent);

    circle.setAttribute("r", radius);
    circle.setAttribute("cx", 100);
    circle.setAttribute("cy", 100);
    circle.setAttribute("stroke-dasharray", circumference);
    circle.setAttribute("stroke-dashoffset", offset);
}

function addWater() {
    let data = getTodayData();
    data.water++;
    checkWaterGoal(data);
    saveData();
    updateUI();
}

function removeWater() {
    let data = getTodayData();
    if (data.water > 0) data.water--;
    saveData();
    updateUI();
}

function setWater() {
    let num = parseInt(document.getElementById("waterInput").value);
    if (!isNaN(num) && num >= 0) {
        let data = getTodayData();
        data.water = num;
        checkWaterGoal(data);
        saveData();
        updateUI();
    }
}

function setWaterGoal() {
    const num = parseInt(document.getElementById("waterGoalInput").value);
    if (!isNaN(num) && num > 0) {
        waterGoal = num;
        saveData();
        updateUI();
    }
}

function checkWaterGoal(data) {
    const achieveEl = document.getElementById("waterAcheivement");
    if (data.water >= waterGoal) {
        achieveEl.classList.remove("hidden");
    } else {
        achieveEl.classList.add("hidden");
    }
}

function addHours() {
    let data = getTodayData();
    data.sleep++;
    checkSleepGoal(data);
    saveData();
    updateUI();
}

function removeHours() {
    let data = getTodayData();
    if (data.sleep > 0) data.sleep--;
    saveData();
    updateUI();
}

function setHour() {
    let num = parseInt(document.getElementById("hourInput").value);
    if (!isNaN(num) && num >= 0) {
        let data = getTodayData();
        data.sleep = num;
        checkSleepGoal(data);
        saveData();
        updateUI();
    }
}

function setSleepGoal() {
    const num = parseInt(document.getElementById("sleepGoalInput").value);
    if (!isNaN(num) && num > 0) {
        sleepGoal = num;
        saveData();
        updateUI();
    }
}

function checkSleepGoal(data) {
    const achieveEl = document.getElementById("sleepAcheivement");
    if (data.sleep >= sleepGoal) {
        achieveEl.classList.remove("hidden");
    } else {
        achieveEl.classList.add("hidden");
    }
}

function calcStats() {
    let dates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));
    let last7 = dates.slice(-7);

    let totalWater = 0, totalSleep = 0;
    last7.forEach(date => {
        totalWater += dailyData[date].water;
        totalSleep += dailyData[date].sleep;
    });

    document.getElementById("avgWater").textContent = (last7.length ? (totalWater / last7.length).toFixed(1) : "0.0");
    document.getElementById("avgSleep").textContent = (last7.length ? (totalSleep / last7.length).toFixed(1) : "0.0");

    document.getElementById("totalDays").textContent = totalDays;
}


function updateUI() {
    document.getElementById("currentDate").textContent = currentDate.toDateString();

    const data = getTodayData();

    document.getElementById("waterCount").textContent = data.water;
    document.getElementById("sleepCount").textContent = data.sleep;

    document.getElementById("waterGoalInput").value = waterGoal;
    document.getElementById("sleepGoalInput").value = sleepGoal;

    updateProgressCircle("waterProgress", data.water, waterGoal);
    updateProgressCircle("sleepProgress", data.sleep, sleepGoal);

    checkWaterGoal(data);
    checkSleepGoal(data);

    calcStats();

    saveData();
}

loadData();
updateUI();







