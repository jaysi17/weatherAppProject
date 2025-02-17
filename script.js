const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const leftContainer = document.querySelector(".left-container");
const rightContainer = document.querySelector(".right-container");

const bottomCard = document.querySelector(".bottom-card");
const apiKey = "4b2c98a47fdba9233efb01ba022aa7cb";

// event listener for form submission
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;

    if(city) {
        try {
            resetAnimations();
            const weatherData = await getWeatherData (city);
            displayWeatherInfo(weatherData);
        }
        catch(error) {
            console.error(error);
            displayError(error);
        }
    }
    else {
        displayError("Please enter a city.");
    }
});
// asynchronous function to fetch weather data from API (using Fetch API & Promises)
async function getWeatherData(city) {
    const apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    const response = await fetch(apiUrl);
    console.log(response);

    if(!response.ok) {
        throw new Error("could not fetch weather data");
    }

    return await response.json();
}

//reset css animationns before applying new styles
function resetAnimations() {
    card.classList.remove('fadeIn');
    bottomCard.classList.remove('fadeANDslide');

    void card.offsetWidth;

    card.classList.add('fadeIn');
    bottomCard.classList.add('fadeANDslide');
}

//function to display retrieved on the user interface
function displayWeatherInfo(data) {
    const opening = document.querySelector(".opening");
    if (opening) {
        opening.style.display = "none";
    }

    const  {
        name: city,
        main: {
            temp,
            pressure,
            feels_like,
            humidity
        },
        weather: [{ description, id}],
        wind: { speed },
        sys: { country }
    } = data; //basic destructuring 

    card.textContent = "";
    rightContainer.textContent = "";
    leftContainer.textContent = "";
    bottomCard.textContent = "";
    card.style.display = "flex";
    bottomCard.style.display = "grid";

    // create element
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    const realFeelDisplay = document.createElement("p");
    const windSpeedDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const pressureDisplay = document.createElement("p");

    //set text content      
    cityDisplay.textContent = `${city}, ${country}`;
    tempDisplay.textContent = `${(temp-273.15).toFixed(1)}°C`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    realFeelDisplay.textContent = `Feels like: ${(feels_like - 273.15).toFixed(1)}°C`;
    windSpeedDisplay.textContent = `Wind Speed: ${speed} m/s`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    pressureDisplay.textContent = `Pressure: ${pressure} hPa`;


    //get css styles
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    //append to left container
    leftContainer.appendChild(cityDisplay);
    leftContainer.appendChild(tempDisplay);   


    //append to right container  
    rightContainer.appendChild(weatherEmoji);
    rightContainer.appendChild(descDisplay);
    
    //append to card
    card.appendChild(leftContainer);
    card.appendChild(rightContainer);
    
    //append to bottom card

    bottomCard.appendChild(realFeelDisplay);
    bottomCard.appendChild(humidityDisplay);
    bottomCard.appendChild(windSpeedDisplay);
    bottomCard.appendChild(pressureDisplay);
}

//get the emoji depending on which case satisfies the condition 
function getWeatherEmoji(weatherId) {
    switch(true) {
        case(weatherId >= 200 && weatherId < 300):
            return "⛈️";

        case(weatherId >= 300 && weatherId < 400):
            return "🌦️";

        case(weatherId >= 500 && weatherId < 600):
            return "🌧️";

        case(weatherId >= 600 && weatherId < 700):
            return "❄️";

        case(weatherId >= 700 && weatherId < 800):
            return "🌫️";

        case(weatherId === 800):
            return "☀️";

        case(weatherId >= 801 && weatherId < 810):
            return "☁️";

        default:
            return "❓";

    }
}

//function to display error message for proper error handling
function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    bottomCard.style.display = "none";
    card.appendChild(errorDisplay);
}

//extra features(darkmode)
//darkmode-lightmode toggle 
const themeSwitch = document.getElementById("theme-switch");
let lightmode = localStorage.getItem("light-mode");

const enableLightMode = () => {
    document.body.classList.add('light-mode');
    localStorage.setItem('light-mode', 'active');
}

const disableLightMode = () => {
    document.body.classList.remove('light-mode');
    localStorage.setItem('light-mode', 'inactive');
}

if (lightmode === 'active') {
    enableLightMode();
}

themeSwitch.addEventListener("click", () => {
    lightmode = localStorage.getItem('light-mode');
    lightmode !== "active" ? enableLightMode() : disableLightMode();
});



