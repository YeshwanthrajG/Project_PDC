import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Define the URL and output file
BASE_URL = "http://tawn.tnau.ac.in/General/HomePublicUI.aspx"
OUTPUT_FILE = "Tamil_Nadu_Weather_Data.xlsx"  #File name

# Define the columns for the Excel sheet
columns = [
    "DISTRICT", "BLOCK", "DATE", "TIME", "MAXIMUM TEMPERATURE (MaxT)",
    "MINIMUM TEMPERATURE (MinT)", "RELATIVE HUMIDITY MORNING (RHm)",
    "RELATIVE HUMIDITY EVENING (RHe)", "MINIMUM RAINFALL (RF)",
    "SUNSHINE (SS)", "SOLAR RADIATION (SR)", "WIND SPEED (WS)",
    "LEAF WETNESS (LW)", "EVAPORATION (EVP)"
]

# Initialize Selenium WebDriver
options = Options()
options.add_argument("--headless")  # Run in headless mode
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def fetch_weather_data():
    driver.get(BASE_URL)
    wait = WebDriverWait(driver, 10)

    # Simulate interaction: Select District and Block
    districts = driver.find_elements(By.XPATH, "//select[@id='ddlDistrict']/option")[1:]  # Skip "Select" option
    all_data = []

    for district in districts:
        district_name = district.text
        district.click()
        time.sleep(2)  # Allow time for blocks to load

        blocks = driver.find_elements(By.XPATH, "//select[@id='ddlBlock']/option")[1:]  # Skip "Select" option
        for block in blocks:
            block_name = block.text
            block.click()

            # Fetch weather data (assuming it loads in a table)
            time.sleep(2)  # Allow time for data to load
            try:
                rows = driver.find_elements(By.XPATH, "//table[@id='weatherDataTable']/tbody/tr")
                for row in rows:
                    cells = row.find_elements(By.TAG_NAME, "td")
                    if len(cells) >= 10:  # Ensure there are enough cells for weather parameters
                        all_data.append([
                            district_name,
                            block_name,
                            cells[0].text,  # Date
                            cells[1].text,  # Time
                            cells[2].text,  # Max Temperature
                            cells[3].text,  # Min Temperature
                            cells[4].text,  # Relative Humidity Morning
                            cells[5].text,  # Relative Humidity Evening
                            cells[6].text,  # Rainfall
                            cells[7].text,  # Sunshine
                            cells[8].text,  # Solar Radiation
                            cells[9].text,  # Wind Speed
                            None,  # Leaf Wetness (Placeholder)
                            None   # Evaporation (Placeholder)
                        ])
            except Exception as e:
                print(f"Error fetching data for {district_name} - {block_name}: {e}")
            time.sleep(1)  # Pause between blocks

    return all_data

# Fetch data
print("Fetching weather data...")
data = fetch_weather_data()
driver.quit()

# Save to Excel
print("Saving data to Excel...")
weather_df = pd.DataFrame(data, columns=columns)
weather_df.to_excel(OUTPUT_FILE, index=False)
print(f"Weather data saved to {OUTPUT_FILE}")


# Key points

# Excel file name : Tamil_Nadu_Weather_Data.xlsx

# Dependencies : Selenium, pandas, openpyxl, http://tawn.tnau.ac.in/General/HomePublicUI.aspx, 
# python (3.7 or more)

# Install Command (should be installed before running the code)
# pip install selenium pandas openpyxl

# Advantage of using Selenium
# The script uses Selenium in headless mode to scrape data without opening a browser window.