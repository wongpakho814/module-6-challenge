// The personal APIKey 
var apiKey = "852516b0ede9467dd7bf30dfdee70ba9";

// Handles the submit button where user entered a city's name
function formSubmitHandler(event) {
    event.preventDefault();
  
    let city = $("#city").value;
  
    if (city) {
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
    let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
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

}

$("#city-form").on("submit", formSubmitHandler);
$("#city-buttons").on("click", buttonClickHandler);