// script.js
const cities = ["New York", "London", "Tokyo", "Dubai", "Sydney", "Cape Town"];

document.addEventListener("DOMContentLoaded", function () {
    const cityList = document.getElementById("city-list");
    if (cityList) {
        cities.forEach(city => getWeatherForCity(city, cityList));
    }
});

async function getWeatherForCity(city, container) {
    // Use the config object from config.js
    const url = `${window.config.apiUrl}?key=${window.config.apiKey}&q=${city}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if the API returned an error
        if (data.error) {
            throw new Error(data.error.message);
        }

        // Extract weather details
        const weatherCondition = data.current.condition.text;
        const advice = getAdviceForWeather(weatherCondition);

        // Create the weather card
        const weatherCard = document.createElement("div");
        weatherCard.className = "card";
        weatherCard.innerHTML = `
            <h3>${city}</h3>
            <p>🌡️ ${data.current.temp_c}°C | ${data.current.condition.text}</p>
            <img src="https:${data.current.condition.icon}" alt="${weatherCondition}">
            <p><strong>Travel Tip:</strong> ${advice}</p>
        `;
        container.appendChild(weatherCard);
    } catch (error) {
        console.error("Error fetching data for", city, ":", error);
    }
}

// Function to provide advice based on the weather condition
function getAdviceForWeather(weatherCondition) {
    const condition = weatherCondition.toLowerCase();
    switch (condition) {
        case "sunny":
            return "Perfect weather for sightseeing and outdoor activities!";
        case "cloudy":
        case "partly cloudy":
        case "overcast":
            return "Great weather for a cozy day indoors or exploring the city!";
        case "rain":
        case "light rain":
        case "moderate rain":
        case "heavy rain":
            return "Don't forget your umbrella! It's a great time to explore indoor attractions.";
        case "snow":
            return "Bundle up and enjoy the winter wonderland! Perfect for snow sports.";
        case "thunderstorm":
            return "Stay safe indoors and enjoy the view from a cozy spot!";
        case "drizzle":
            return "Light rain – perfect for a stroll with a light jacket.";
        case "mist":
        case "fog":
            return "Visibility might be low. Be cautious if driving.";
        default:
            return "Check the weather and plan your activities accordingly!";
    }
}