window.addEventListener("load", ()=>{
    currentTime();
});

navigator.geolocation.getCurrentPosition((position) =>{
    fetch(`http://api.weatherapi.com/v1/timezone.json?key=fbc4ec1e29e7434cb3f05355240909&q=${position.coords.latitude},${position.coords.longitude}`).then(req => req = req.json()).then(data =>{
        console.log("Location detected!");
        
        let location = data.location;        
        document.getElementById("location").innerHTML = `${location.name}, ${location.region}, ${location.country}`;
        

        fetch(`http://api.weatherapi.com/v1/forecast.json?key=fbc4ec1e29e7434cb3f05355240909&q=${location.name}&days=7&aqi=no&alerts=yes`).then(req => req = req.json()).then(data => {            
            document.getElementById("tempNum").innerHTML = Math.round(data.current.temp_c);
            document.getElementById("condition").innerHTML = data.current.condition.text;

            let imgSource = `img/${data.current.is_day == 1? "day": "night"}/${data.current.condition.code}.png`;
            document.getElementById("weatherIcon").src = imgSource;
            document.getElementById("weatherBgImage").src = imgSource;
            
            console.log(data);
            
            document.getElementById("wind").innerText = Math.round(data.current.wind_kph) + " km/h";
            document.getElementById("humidity").innerHTML = data.current.humidity + "%";

            //-------------------------------------Forecst-----------------------------------
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
            
        });
    });
}, (error) =>{
    console.log(error);
    
});

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




