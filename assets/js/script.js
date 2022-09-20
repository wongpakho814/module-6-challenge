var apiKey = "852516b0ede9467dd7bf30dfdee70ba9"; // The personal API Key
var storedCities = []; // The search history

// Handles the submit button where user entered a city's name
function formSubmitHandler(event) {
    event.preventDefault();
    let city = $("#city").val();
  
    if (city) {
        // Add the searched city to the search history   
        storedCities.push(city);
        localStorage.setItem("Stored cities", JSON.stringify(storedCities));
        $('#city-buttons').append("<button data-city='" + city + "' class='btn mb-3'>" + city + "</button>");
        getCityCoords(city);
    } 
    else {
        alert('Please enter a city username');
    }
};

// Handles the city buttons click 
function buttonClickHandler(event) {
    let city = event.target.getAttribute("data-city");
  
    if (city) {
        getCityCoords(city);
    }
};

// Calling the OpenWeather Direct geocoding API to get the latitude and longitude of the given city name
function getCityCoords(name) {
    let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + name + "&appid=" + apiKey;
    let lat = 0;
    let lon = 0;
  
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    // console.log(data);
                    lat = data[0].lat;
                    lon = data[0].lon;
                    getCityWeather(lat, lon, name);
                });
            } 
            else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

// Calling the OpenWeather Call 5 day/3 hour forecast API to get the weather of the given city's latitude and longitude
function getCityWeather(lat, lon, name) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data, name);
                });
            } 
            else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
}

// Displays the weather data fetched from the API
function displayWeather(weather, city) {
    $(".today-weather").css("border", "1px solid black");
    $(".result-title").css("display", "block");
    // Clear the innerHTML of the previous results, if there are
    document.querySelector(".today-weather").innerHTML = "";
    document.querySelector(".forecast-cards").innerHTML = "";

    // Rendering the weather for today
    let i = 0;
    for (i; i < weather.list.length; i++) {
        // Choose the time block with "12:00:00" as the representitive of the entire day's weather, or 
        // the later time blocks as alternatives if the data for "12:00:00" is no longer available for today 
        let desc =  weather.list[i].dt_txt;
        if (desc.includes("12:00:00") || desc.includes("15:00:00") || desc.includes("18:00:00") || desc.includes("21:00:00")) {
            let temp = weather.list[i].main.temp;
            let wind = weather.list[i].wind.speed;
            let humid = weather.list[i].main.humidity;

            let todayTitleEl = document.createElement("h2"); // e.g. Atlanta (9/13/2022)
            todayTitleEl.textContent = city + "(" + weather.list[i].dt_txt.substring(0, 10) + ") ";
            let todayIconEl = document.createElement("img"); // e.g. 🔆
            todayIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + weather.list[i].weather[0].icon + "@2x.png");
            let todayTempEl = document.createElement("p");
            todayTempEl.textContent = "Temp: " + temp + "°C";
            let todayWindEl = document.createElement("p");
            todayWindEl.textContent = "Wind: " + wind + "m/s";
            let todayHumidEl = document.createElement("p");
            todayHumidEl.textContent = "Humidity: " + humid + "%";

            let todayWeatherEl = document.querySelector(".today-weather");
            todayWeatherEl.appendChild(todayTitleEl);
            todayWeatherEl.appendChild(todayIconEl);
            todayWeatherEl.appendChild(todayTempEl);
            todayWeatherEl.appendChild(todayWindEl);
            todayWeatherEl.appendChild(todayHumidEl);
            break;
        }
    }

    // Increment i so we skip the "12:00:00" item we already rendered above
    i++;
    // Rendering the weather forecast for the next 4 days
    for (i; i < weather.list.length; i++) {
        if (weather.list[i].dt_txt.includes("12:00:00")) {
            let temp = weather.list[i].main.temp;
            let wind = weather.list[i].wind.speed;
            let humid = weather.list[i].main.humidity;

            let forecastCardEl = document.createElement("div");
            forecastCardEl.setAttribute("class", "card mr-2");
            let forecastDivEl = document.createElement("div");
            forecastDivEl.setAttribute("class", "p-2");
            let forecastDateEl = document.createElement("h3");
            forecastDateEl.setAttribute("class", "pb-2");
            forecastDateEl.textContent = weather.list[i].dt_txt.substring(0, 10);
            let forecastIconEl = document.createElement("img");
            forecastIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + weather.list[i].weather[0].icon + "@2x.png");
            let forecastTempEl = document.createElement("p");
            forecastTempEl.textContent = "Temp: " + temp + "°C";
            let forecastWindEl = document.createElement("p");
            forecastWindEl.textContent = "Wind: " + wind + "m/s";
            let forecastHumidEl = document.createElement("p");
            forecastHumidEl.textContent = "Humidity: " + humid + "%";

            let forecastWeatherEl = document.querySelector(".forecast-cards");
            forecastWeatherEl.appendChild(forecastCardEl);
            forecastCardEl.appendChild(forecastDivEl);
            forecastDivEl.appendChild(forecastDateEl);
            forecastDivEl.appendChild(forecastIconEl);
            forecastDivEl.appendChild(forecastTempEl);
            forecastDivEl.appendChild(forecastWindEl);
            forecastDivEl.appendChild(forecastHumidEl);
        }
    }
}

// Initialize the page by retrieving the search history (stored cities) from local storage and rendering them, 
// and adding the event listeners to the buttons
function init() {
    if (JSON.parse(localStorage.getItem("Stored cities")) !== null) {
        storedCities = JSON.parse(localStorage.getItem("Stored cities"));
    }
    for (let i = 0; i < storedCities.length; i++) {
        $('#city-buttons').append("<button data-city='" + storedCities[i] + "' class='btn mb-3'>" + storedCities[i] + "</button>");
    }

    $("#city-form").on("submit", formSubmitHandler);
    $("#city-buttons").on("click", buttonClickHandler);
}
init();