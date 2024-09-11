loading();

// Initialize the map and set its view (latitude, longitude, zoom level)
var map = L.map('map', { zoomControl: false }).setView([20, 0], 1);

// Add a base map (OpenStreetMap)
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 18,
attribution: '© OpenStreetMap contributors'
});

// Add the OpenWeather precipitation layer
var apiKey = '340da5e2343ca92b927da39bd7d30457'; // Replace with your API key
var precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
maxZoom: 18,
attribution: '© OpenWeather'
});

// Add both layers to the map
osmLayer.addTo(map);            // Add the base map layer
precipitationLayer.addTo(map); 

function updateLocation(lat, lon, zoom) {
    map.setView([lat, lon], zoom);
}

window.addEventListener("load", ()=>{
    currentTime();
});

navigator.geolocation.getCurrentPosition((position) =>{
    console.log("Latitude & Longitude Detected!");
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    updateLocation(latitude, longitude, 10);

    fetch(`https://api.weatherapi.com/v1/timezone.json?key=fbc4ec1e29e7434cb3f05355240909&q=${latitude},${longitude}`).then(req => req = req.json()).then(data =>{
        console.log("Location detected!");
        
        setTimeout(() => {
            closeLoading();
        }, 1000);

        let location = data.location;        
        document.getElementById("location").innerHTML = `${location.name}, ${location.region}, ${location.country}`;
        

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=fbc4ec1e29e7434cb3f05355240909&q=${location.name}&days=7&aqi=no&alerts=yes`).then(req => req = req.json()).then(data => {            
            setCurrentWeather(data);

            //-------------------------------------Forecst-----------------------------------
            setForecast(data);
            
        });
    });
}, (error) =>{
    console.log(error);
    
});


document.getElementById("btnSearch").addEventListener("click", function(){

    let searchLocation = document.getElementById("txtSearch").value;
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=fbc4ec1e29e7434cb3f05355240909&q=${searchLocation}&days=7&aqi=no&alerts=yes`).then(res => res = res.json()).then(data => {
        updateLocation(data.location.lat, data.location.lon, 10);
        setCurrentWeather(data);
        setForecast(data)
        document.getElementById("location").innerHTML = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
    });
});

document.getElementById("txtSearch").addEventListener("keydown", (event)=>{

    if(event.key == "Enter"){
        document.getElementById("btnSearch").dispatchEvent(new Event("click"));
    }
});


function setForecast(data){
    let forecast = data.forecast.forecastday;
    let forecastBody = ``;

    for (let i = 1; i < forecast.length; i++) {
        let date = new Date(forecast[i].date);

        let imgSrc = `img/day/${forecast[i].day.condition.code}.png`;
        
        forecastBody += `<div class="col-lg-2 col-md-4 col-sm-6 d-flex align-items-center">
                                <div class="box forecast-box">
                                    <p class="m-0 mt-3">${getDayName(date.getDay())} | ${date.getDate()}</p>
                                    <img src="${imgSrc}" alt="">
                                    <h2>${Math.round(forecast[i].day.avgtemp_c)}<sup>o</sup>C</h2>
                                </div>
                            </div>`;
        
    }

    document.getElementById("forecastField").innerHTML = forecastBody;
}


function setCurrentWeather(data){
    document.getElementById("tempNum").innerHTML = Math.round(data.current.temp_c);
    document.getElementById("condition").innerHTML = data.current.condition.text;

    let imgSource = `img/${data.current.is_day == 1? "day": "night"}/${data.current.condition.code}.png`;
    document.getElementById("weatherIcon").src = imgSource;
    document.getElementById("weatherBgImage").src = imgSource;
        
    document.getElementById("wind").innerText = Math.round(data.current.wind_kph) + " km/h";
    document.getElementById("humidity").innerHTML = data.current.humidity + "%";
}

function currentTime(){
    let today = new Date();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    
    let greeting = hours < 12 ? "morning": hours < 15 ? "afternoon": "evening";

    let timeUnit = hours > 12 ? "PM": "AM";
    hours = hours > 12 ? hours % 12: hours;
    hours = hours < 10 ? "0" + hours: hours;
    minutes = minutes < 10 ? "0" + minutes: minutes;
 
    document.getElementById("time").innerHTML = `${hours}:${minutes} ${timeUnit}`;
    document.getElementById("greeting").innerHTML = `Good ${greeting}!`;
    document.getElementById("date").innerHTML = `${getDayName(today.getDay())}, ${today.getDate()} ${getMonthName(today.getMonth())}, ${today.getFullYear()}`;

    setTimeout(currentTime, 1000);
}

function getMonthName(monthNum){
    let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    return monthNames[monthNum];
}

function getDayName(dayNum) {
    let dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    return dayNames[dayNum];
}

function loading(){
    let loadingBody = `<div id="loading" class="position-absolute d-grid top-0 w-100 h-100 z-3 loading">
                            <img class="mx-auto align-self-center loading-logo" src="img/Logo_01.png" alt="">
                        </div>`;


    document.body.innerHTML += loadingBody;
    document.getElementById("weatherIcon").classList.add("visually-hidden");
}


function closeLoading(){
    document.getElementById("loading").style.animation = "1s ease-out normal fadeout";
    setTimeout(() => {
        document.body.removeChild(document.getElementById("loading"));
    }, 1000);
    
    setTimeout(() => {
        document.getElementById("weatherIcon").classList.remove("visually-hidden");
    }, 100);
}



