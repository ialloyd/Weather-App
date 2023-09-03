const OPENWEATHERMAP_API_KEY = "3fe0628f157c01d77029201efd7f9bf1";

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function handleError(error) {

    if (error.code === error.PERMISSION_DENIED) {
        alert("You have denied access to your location. Please enable location access to use this feature.");
    }
}

function showPosition(position) {

    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    document.getElementById("main").style.display = "none";

    getWeatherData(lat, lng);
}

function getWeatherData(lat, lng) {

    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${OPENWEATHERMAP_API_KEY}`;
    document.getElementById("spinner").style.display = "";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("spinner").style.display = "none";
            processWeatherData(data, lat, lng);
        })
        .catch(error => {
            console.error(error);
            alert("An error occurred while fetching weather data.");
        });
}

async function processWeatherData(data, lat, lng) {
    document.getElementById('new_main').style.display = ''
    document.getElementById("newHeading").style.display = "";
    document.getElementById("location").style.display = "";
    document.getElementsByClassName('lat-long')[0].firstElementChild.textContent = 'Lat: ' + lat;
    document.getElementsByClassName('lat-long')[0].lastElementChild.textContent = 'Long: ' + lng;

    var mapFrame = `<iframe src="https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed" width="100%" height="400" frameborder="0" style="border:0"></iframe>`;
    document.getElementById("map").innerHTML = mapFrame;

    console.log(data)
    var currentWeather = data.current;
    console.log(currentWeather)

    let container = document.createElement('div');
    container.classList.add('weather-info');
    container.innerHTML += "<h1>Your Weather Data</h1>"

    try {

        var locationName = await getLocationName(lat, lng);
        container.innerHTML += "<div><span >Location : </span><span >" + locationName + "</span></div>";
    } catch (error) {

        console.error(error);
        container.innerHTML += "<div><span >Location : </span><span >Unknown</span></div>";
    }

    container.innerHTML += "<div><span >Temperature : </span><span >" + kelvinToCelsius(currentWeather.temp).toFixed(2) + "°C</span></div>";

    container.innerHTML += "<div><span >Feels Like : </span><span >" + kelvinToCelsius(currentWeather.feels_like).toFixed(2) + "°C</span></div>";

    container.innerHTML += "<div><span >Humidity : </span><span >" + currentWeather.humidity + "%</span></div>";

    container.innerHTML += "<div><span >Pressure : </span><span >" + currentWeather.pressure + " hPa</span></div>";

    container.innerHTML += "<div><span >Wind Speed : </span><span >" + currentWeather.wind_speed + "m/s</span></div>";

    container.innerHTML += "<div><span >Wind Direction : </span><span >" + currentWeather.wind_deg + "°</span></div>";

    container.innerHTML += "<div ><span >UV Index :</span><span >" + currentWeather.uvi + "</span></div>";

    document.getElementById("new_main").append(container);
}

document.getElementById("fetchData").addEventListener("click", function () {
    getLocation();
});

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

function getLocationName(lat, lng) {
    return new Promise((resolve, reject) => {
        var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var locationName = data.display_name;
                resolve(locationName);
            })
            .catch(error => {
                reject(error);
            });
    });
}