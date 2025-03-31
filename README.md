# FlyForecast - Weather-Based Flight Forecasting

## Overview
FlyForecast is a web application designed to provide real-time weather-based flight forecasting, helping users plan their air travel efficiently. The project integrates the [WeatherAPI](https://www.weatherapi.com/docs/) to deliver up-to-date weather conditions and forecasts for various locations relevant to air travel. With an interactive interface, users can search, filter, and explore weather conditions at popular destinations, ensuring they can plan smarter and travel better.

The application serves a practical purpose by addressing the genuine need for travelers to access accurate weather information for their destinations, enabling them to prepare for their trips effectively. It features a user-friendly interface with meaningful data interactions, such as searching for weather by city and exploring popular destinations with travel advice.

## Features
- **Live Weather Forecasting:** Retrieves real-time weather updates via the WeatherAPI.
- **Search & Explore:** Users can search for specific locations to obtain weather conditions instantly.
- **Popular Destinations:** Displays trending flight destinations with live weather updates and travel tips.
- **User Interaction:** Enables searching for weather data and viewing preloaded popular cities with weather forecasts.
- **Error Handling:** Ensures a smooth user experience with informative feedback on API failures and invalid inputs.
- **Scalable Deployment:** Hosted on two web servers (`6411-web-01` and `6411-web-02`) with a load balancer (`6411-lb-01`) distributing traffic efficiently.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **API Integration:** [WeatherAPI](https://www.weatherapi.com/docs/)
- **Deployment:** Apache/Nginx Web Server, Load Balancer Configuration
- **Version Control:** Git & GitHub
- **External Libraries:**
  - [Font Awesome](https://fontawesome.com/) for icons
  - Cloudflare scripts for additional security and performance (included in HTML files)

## Project Structure
The project includes the following key files:
- `index.html` - The homepage featuring an introduction to FlyForecast and its features.
- `popular.html` - A dedicated page displaying trending flight destinations with weather forecasts.
- `search.html` - A search interface for retrieving weather forecasts for any location.
- `style.css` - Enhances the visual appearance and responsiveness of the application.
- `script.js` - Implements core JavaScript functionalities for displaying weather for popular cities.
- `search.js` - Handles API-based search operations for the search page.
- `config.js` - Stores API configuration (API key and URL).
- `logo.webp` - The official project logo (as shown below).
- `weather.png` & `weather1.png` - Icons representing weather-related elements (not directly used in the current version but included for future enhancements).
- `.gitignore` - Excludes sensitive files like `.env` and unnecessary directories.


## API Integration
The application utilizes the [WeatherAPI](https://www.weatherapi.com/docs/) to fetch:
- Current weather conditions (temperature, weather condition, etc.)
- Weather icons for visual representation
- Location details for searched cities

### Secure API Key Handling
- API keys are stored in `config.js` for local development. However, for production, it is recommended to use environment variables to safeguard sensitive data.
- To securely manage API keys:
  1. Create a `.env` file in the project root:
     ```sh
     echo "API_KEY=your_api_key_here" > .env
     ```
  2. Use a library like `dotenv` in a backend environment (if applicable) to load the API key.
  3. The `.gitignore` file ensures the `.env` file is not committed to the repository:
     ```
     .env
     ```
- In the current implementation, the API key is hardcoded in `config.js` for simplicity. For production, this should be updated to use environment variables or a backend proxy.

## Part One: Local Implementation

### Setup Instructions
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/Betelhemf567/FlyForecast.git
   cd FlyForecast
   ```
2. **Install Dependencies:**
   - No additional dependencies are required since this is a frontend-only application. Ensure you have a modern web browser.
3. **Configure API Key:**
   - Sign up at [WeatherAPI](https://www.weatherapi.com/) to obtain an API key.
   - Update the `config.js` file with your API key:
     ```javascript
     const config = {
         apiKey: "_api_key_here",
         apiUrl: "https://api.weatherapi.com/v1/current.json"
     };
     window.config = config;
     ```
   - Alternatively, set up a `.env` file as described in the "Secure API Key Handling" section.
4. **Run the Application:**
   - Open `index.html` in a web browser to access the homepage.
   - Navigate to `popular.html` to view weather for popular cities.
   - Use `search.html` to search for weather in any city.

### User Interaction
- **Search Functionality:** On `search.html`, users can enter a city name to retrieve current weather conditions, including temperature, weather condition, and a weather icon. The application also provides travel advice based on the weather (e.g., "Bring an umbrella" for rain).
- **Popular Destinations:** On `popular.html`, users can view a list of preloaded popular cities (e.g., New York, London, Tokyo) with their current weather and travel tips.
- **Error Handling:** The application validates user input (e.g., ensuring city names contain only letters and spaces) and provides feedback for API failures or invalid cities (e.g., "City not found").

## Part Two: Deployment

### Server Details
The application is deployed on the following servers:
- **Web Server 1 (`6411-web-01`):** IP `52.91.63.131`, State: Running
- **Web Server 2 (`6411-web-02`):** IP `44.212.73.108`, State: Running
- **Load Balancer (`6411-lb-01`):** IP `52.91.61.116`, State: Running

### Deployment Instructions
#### Web Server Deployment
1. **Prepare the Servers:**
   - Ensure `6411-web-01` (`52.91.63.131`) and `6411-web-02` (`44.212.73.108`) are running Apache or Nginx.
   - Copy the project files to both servers:
     ```sh
     scp -r FlyForecast/* ubuntu@52.91.63.131:/var/www/html/
     scp -r FlyForecast/* ubuntu@44.212.73.108:/var/www/html/
     ```
2. **Set Up Apache/Nginx:**
   - For Apache, ensure the document root points to `/var/www/html/`.
   - For Nginx, configure the server block to serve the files:
     ```nginx
     server {
         listen 80;
         root /var/www/html;
         index index.html;
         location / {
             try_files $uri $uri/ /index.html;
         }
     }
     ```
   - Restart the web server on both `6411-web-01` and `6411-web-02`:
     ```sh
     sudo systemctl restart apache2  # For Apache
     sudo systemctl restart nginx    # For Nginx
     ```
3. **Test Individual Servers:**
   - Access `http://52.91.63.131` (for `6411-web-01`) and `http://44.212.73.108` (for `6411-web-02`) to ensure the application loads correctly on both servers.

#### Load Balancer Configuration
1. **Set Up the Load Balancer (`6411-lb-01`):**
   - Use Nginx or HAProxy as the load balancer on `6411-lb-01` (`52.91.61.116`). Below is an example Nginx configuration:
     ```nginx
     upstream flyforecast_servers {
         server 52.91.63.131:80;  # 6411-web-01
         server 44.212.73.108:80; # 6411-web-02
     }

     server {
         listen 80;
         location / {
             proxy_pass http://flyforecast_servers;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         }
     }
     ```
2. **Apply the Configuration:**
   - Save the configuration and restart the load balancer on `6411-lb-01`:
     ```sh
     sudo systemctl restart nginx
     ```
3. **Test the Load Balancer:**
   - Access the application via the load balancer's URL: `http://52.91.61.116`.
   - Verify that traffic is distributed between `6411-web-01` (`52.91.63.131`) and `6411-web-02` (`44.212.73.108`) using a round-robin algorithm.
   - Test failover by stopping one server (e.g., `6411-web-01`) and ensuring the application remains accessible via `6411-web-02`.

### Deployment Validation
- The application was successfully deployed on `6411-web-01` (`52.91.63.131`) and `6411-web-02` (`44.212.73.108`), with the load balancer (`6411-lb-01`, `52.91.61.116`) distributing traffic evenly.
- Tests confirmed that the application remains accessible even if one server goes down, ensuring high availability.

## Error Handling Implementation
- **API Failures:** Displays messages like "City not found" or "API Error" when the API fails to respond.
- **Invalid Input Handling:** Prevents empty or incorrect search queries with messages like "Invalid input! Only letters and spaces allowed."
- **Server Downtime Resilience:** The load balancer ensures users can still access the application if one server is down.

## Demo Video
**Demo Video**: [https://youtu.be/SawBxIhbiZY] 
The demo video (under 2 minutes) showcases:
- Running the application locally by opening `index.html`.
- Navigating to `popular.html` to view weather for popular cities.
- Using `search.html` to search for a city's weather.
- Accessing the application via the load balancer's URL (`http://52.91.61.116`).
- Highlighting error handling and user interaction features.

## Challenges and Solutions
- **API Rate Limits:** Implemented error handling to manage rate limits and provided user feedback for failed requests. Future improvements could include caching mechanisms.
- **Deployment Hurdles:** Faced issues with load balancer configuration due to incorrect server addresses. Resolved by verifying server IPs (`52.91.63.131` and `44.212.73.108`) and testing connectivity.
- **Optimized Data Presentation:** Refined the UI with CSS to ensure weather data is visually appealing and easy to read, using cards for popular cities and clear text for search results.
- **Secure API Key Handling:** Initially hardcoded the API key in `config.js`. Added instructions for using a `.env` file to secure the key in production.


## Contribution
Contributions are encouraged! Submit issues or pull requests to enhance FlyForecast.  
[Contributing Guidelines](https://github.com/Betelhemf567/FlyForecast/blob/main/CONTRIBUTING.md)

## Acknowledgments
- **Weather API:** [WeatherAPI](https://www.weatherapi.com/) for providing the weather data.
- **Font Awesome:** For the icons used in the UI.
- **Web Server References:** Apache/Nginx documentation for deployment guidance.

## License
This project is distributed under the **MIT License**.  
[MIT License](https://github.com/Betelhemf567/FlyForecast/blob/main/LICENSE)

## Submission Details
- **GitHub Repository:** [https://github.com/Betelhemf567/FlyForecast](https://github.com/Betelhemf567/FlyForecast)
- **Demo Video:** [https://youtu.be/SawBxIhbiZY]
- **Deadline:** Submitted on March 29, 2025, as per the assignment requirements.

