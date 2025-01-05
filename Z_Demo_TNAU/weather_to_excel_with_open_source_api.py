#This is to fetch values from open source weather api called "open meteo" and to input those values in 
# newly created excel sheet

#All the districts/regions will be identifed with the latitude and longitude of that particuar location

import requests
import pandas as pd
from datetime import datetime, timedelta

# Define the districts and their latitude/longitude
districts = {
    "Thanjavur": {"lat": 10.7852, "lon": 79.1391},
    "Tirunelveli": {"lat": 8.7139, "lon": 77.7567},
    "Coimbatore": {"lat": 11.0168, "lon": 76.9558},
}

# Define the parameters for Open-Meteo API
BASE_URL = "https://archive-api.open-meteo.com/v1/archive"
parameters = {
    "temperature_2m_max": "MAXIMUM TEMPERATURE (MaxT)",
    "temperature_2m_min": "MINIMUM TEMPERATURE (MinT)",
    "relative_humidity_2m_max": "RELATIVE HUMIDITY MORNING (RHm)",
    "relative_humidity_2m_min": "RELATIVE HUMIDITY EVENING (RHe)",
    "precipitation_sum": "MINIMUM RAINFALL (RF)",
    "sunshine_duration": "SUNSHINE (SS)",
    "shortwave_radiation_sum": "SOLAR RADIATION (SR)",
    "windspeed_10m_max": "WIND SPEED (WS)",
}

# Define the columns for the Excel sheet
columns = [
    "DISTRICT", "DATE", "TIME", "MAXIMUM TEMPERATURE (MaxT)",
    "MINIMUM TEMPERATURE (MinT)", "RELATIVE HUMIDITY MORNING (RHm)",
    "RELATIVE HUMIDITY EVENING (RHe)", "MINIMUM RAINFALL (RF)",
    "SUNSHINE (SS)", "SOLAR RADIATION (SR)", "WIND SPEED (WS)",
    "LEAF WETNESS (LW)", "EVAPORATION (EVP)"
]

# Function to fetch weather data for a district
def fetch_weather_data(district, lat, lon, start_date, end_date):
    url = BASE_URL
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": ",".join(parameters.keys()),
        "timezone": "auto",
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data for {district}: {response.status_code}")
        return None

# Generate the date range for the past 7 days
end_date = datetime.utcnow().date()
start_date = end_date - timedelta(days=6)

# Collect weather data for each district
all_data = []

for district, coords in districts.items():
    print(f"Fetching data for {district}...")
    weather_data = fetch_weather_data(
        district,
        coords["lat"],
        coords["lon"],
        start_date.strftime("%Y-%m-%d"),
        end_date.strftime("%Y-%m-%d")
    )
    if weather_data:
        hourly_data = weather_data.get("hourly", {})
        times = hourly_data.get("time", [])
        for i, time in enumerate(times):
            dt = datetime.fromisoformat(time)
            all_data.append([
                district,
                dt.strftime("%Y-%m-%d"),  # Date
                dt.strftime("%H:%M"),    # Time
                hourly_data.get("temperature_2m_max", [None])[i],
                hourly_data.get("temperature_2m_min", [None])[i],
                hourly_data.get("relative_humidity_2m_max", [None])[i],
                hourly_data.get("relative_humidity_2m_min", [None])[i],
                hourly_data.get("precipitation_sum", [None])[i],
                hourly_data.get("sunshine_duration", [None])[i],
                hourly_data.get("shortwave_radiation_sum", [None])[i],
                hourly_data.get("windspeed_10m_max", [None])[i],
                None,  # Placeholder for LEAF WETNESS
                None,  # Placeholder for EVAPORATION
            ])

# Create a DataFrame and save it to Excel
weather_df = pd.DataFrame(all_data, columns=columns)
output_file = "Hourly_Weather_Data.xlsx"
weather_df.to_excel(output_file, index=False)
print(f"Weather data saved to {output_file}")


# Explanation of the Code:

# Districts: Latitude and longitude for Thanjavur, Tirunelveli, and Coimbatore are provided.

# API: Uses the Open-Meteo archive-api to fetch hourly data for the last 7 days 
# (contains 80 years of historical data and open-source)
    
# Parameters: Fetches the following weather attributes:
# Maximum/Minimum temperature, Relative Humidity (Morning/Evening), Rainfall, Sunshine duration, 
# Solar radiation, Wind speed

# Date Range: Automatically calculates the past 7 days. (can be modified)

# Output: Saves the data into an Excel sheet with the specified columns.

# Requirements:
# Python Packages: Install requests, pandas, and openpyxl:

# we have to use the command on the terminal before running this code.
# pip install requests pandas openpyxl

# Adjust Parameters: Open-Meteo provides hourly data for specific fields; some custom calculations 
# (e.g., "Leaf Wetness") are placeholders.

# Output:
# The script generates an Excel file named Hourly_Weather_Data.xlsx with the weather data for the past 7 days, 
# including hourly readings for the three districts. Let me know if you need further assistance!

# Depedencies required : pandas, requests, openpyxl, https://open-meteo.com/

# Bottlenecks : API calls (may affect speed)

# Benchmarks : 10-15 seconds (from start till getting excel sheet)



