// search.js
async function getWeather() {
    const city = document.getElementById("city").value.trim();
    const weatherDiv = document.getElementById("weather");
    const weatherIcon = document.getElementById("weather-icon");
    const tripAdvice = document.getElementById("trip-advice");

    // Validate city input
    const cityRegex = /^[A-Za-z\s]+$/;
    if (!city) {
        weatherDiv.innerHTML = "❌ Please enter a city name.";
        weatherIcon.classList.add("hidden");
        tripAdvice.innerText = "";
        return;
    }

    if (!cityRegex.test(city)) {
        weatherDiv.innerHTML = "❌ Invalid input! Only letters and spaces allowed.";
        weatherIcon.classList.add("hidden");
        tripAdvice.innerText = "";
        return;
    }

    // Use the config object from config.js
    const url = `${config.apiUrl}?key=${config.apiKey}&q=${city}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.status === 404 ? "City not found" : "API Error");
        }

        const data = await response.json();

        // Extract weather details from WeatherAPI response
        const cityName = data.location?.name || "Unknown City";
        const temperature = data.current?.temp_c ?? "N/A";
        const weatherCondition = data.current?.condition?.text ?? "Unknown";
        const iconUrl = data.current?.condition?.icon ?? "https://via.placeholder.com/50"; // WeatherAPI provides icon URL directly

        // Display the weather info
        weatherDiv.innerHTML = `🌍 ${cityName} - ${temperature}°C, ${weatherCondition}`;
        weatherIcon.innerHTML = `<img src="${iconUrl}" alt="${weatherCondition}">`;
        weatherIcon.classList.remove("hidden");

        // Provide trip advice
        tripAdvice.innerText = getAdviceForWeather(weatherCondition);
    } catch (error) {
        weatherDiv.innerHTML = "❌ City not found. Please check the spelling and try again.";
        weatherIcon.classList.add("hidden");
        tripAdvice.innerText = "🔍 Ensure the city name is spelled correctly.";
    }
}

// Function to provide travel advice based on weather
function getAdviceForWeather(weatherCondition) {
    const condition = weatherCondition.toLowerCase();
    const adviceMap = {
        "rain": "☔ Bring an umbrella or raincoat.",
        "sunny": "😎 It's sunny! Wear sunglasses and sunscreen.",
        "cloudy": "🌥 Cloudy day. A light jacket might be useful.",
        "snow": "❄ Wear warm clothes and gloves!",
        "partly cloudy": "🌤️ A light jacket might be useful.",
        "overcast": "🌥 Expect cloudy skies. A jacket might be handy.",
        "mist": "🌫 Visibility might be low. Be cautious if driving.",
        "fog": "🌫 Visibility might be low. Be cautious if driving.",
    };
    return adviceMap[condition] || "🌡 Stay prepared for any weather!";
}