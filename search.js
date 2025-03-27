const apiKey = "d977d3f5d4d4032a55e40ba33a9b03aa";

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

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);

        // Check if API response is not OK (404 or other errors)
        if (!response.ok) {
            throw new Error(response.status === 404 ? "City not found" : "API Error");
        }

        const data = await response.json();

        // Extract weather details
        const cityName = data.name || "Unknown City";
        const temperature = data.main?.temp ?? "N/A";
        const weatherCondition = data.weather?.[0]?.main ?? "Unknown";
        const iconCode = data.weather?.[0]?.icon ?? "01d";
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

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
    const adviceMap = {
        "Rain": "☔ Bring an umbrella or raincoat.",
        "Clear": "😎 It's sunny! Wear sunglasses and sunscreen.",
        "Clouds": "🌥 Cloudy day. A light jacket might be useful.",
        "Snow": "❄ Wear warm clothes and gloves!",
    };
    return adviceMap[weatherCondition] || "🌡 Stay prepared for any weather!";
}
