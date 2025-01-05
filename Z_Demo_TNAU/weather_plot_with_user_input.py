import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the data from Excel
def load_data(file_path):
    df = pd.read_excel(file_path)
    return df

# Filter data based on user inputs (district, block, date, and weather type)
def filter_data(df, district, block, weather_type, date):
    filtered_data = df[(df['DISTRICT'] == district) & 
                       (df['BLOCK'] == block) & 
                       (df['DATE'] == date)]
    return filtered_data[['DATE', 'TIME', weather_type]]

# Bar chart plot for weather data
def plot_bar_chart(filtered_data, weather_type):
    plt.figure(figsize=(10,6))
    sns.barplot(data=filtered_data, x='TIME', y=weather_type)
    plt.title(f'{weather_type} over Time')
    plt.xlabel('Time')
    plt.ylabel(weather_type)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# Heatmap plot for multiple weather data types over time
def plot_heatmap(filtered_data, weather_types):
    # Pivoting data for heatmap (time on x-axis, weather types on y-axis)
    data_pivot = filtered_data.pivot('TIME', 'DATE', weather_types)
    
    plt.figure(figsize=(12, 6))
    sns.heatmap(data_pivot, annot=True, cmap='coolwarm', fmt=".2f", cbar=True)
    plt.title(f'Weather Data Heatmap')
    plt.xlabel('Date')
    plt.ylabel('Time')
    plt.tight_layout()
    plt.show()

# Area plot for weather data
def plot_area_plot(filtered_data, weather_type):
    plt.figure(figsize=(10,6))
    sns.lineplot(data=filtered_data, x='TIME', y=weather_type, marker='o', fill=True)
    plt.title(f'{weather_type} over Time (Area Plot)')
    plt.xlabel('Time')
    plt.ylabel(weather_type)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# Display the table of results
def display_table(filtered_data):
    print(filtered_data)
    return filtered_data

def main():
    # User input
    file_path = 'weather_data.xlsx'  # Replace with your file path
    district = input("Enter the district: ")
    block = input("Enter the block: ")
    date = input("Enter the date (YYYY-MM-DD): ")
    weather_type = input("Enter the weather type (e.g., MaxT, MinT, RHm, RHe, RF, SS, SR, WS, LW, EVP): ")
    
    # Ask user for the plot type
    plot_type = input("Choose the plot type (bar, heatmap, area): ").lower()
    
    # Load data and filter
    df = load_data(file_path)
    filtered_data = filter_data(df, district, block, weather_type, date)
    
    if filtered_data.empty:
        print("No data found for the given criteria.")
    else:
        # Plot the data based on user choice
        if plot_type == 'bar':
            plot_bar_chart(filtered_data, weather_type)
        elif plot_type == 'heatmap':
            weather_types = input("Enter the weather types for heatmap (comma-separated): ").split(',')
            plot_heatmap(filtered_data, weather_types)
        elif plot_type == 'area':
            plot_area_plot(filtered_data, weather_type)
        else:
            print("Invalid plot type chosen.")
        
        # Display the table
        display_table(filtered_data)

if __name__ == "__main__":
    main()



# key features

# Dependencies : pandas, matplotlib, seaborn, file path of excel sheet to be visually represented

# Install command : pip install pandas matplotlib seaborn

# visual representations : line plot, bar graph, heat map, area plot_area_plot

# Bar Chart: Visualizes individual data points as bars, useful for discrete time intervals.

# Heatmap: Provides a color-coded matrix to compare multiple weather parameters over time, making 
# it easy to identify trends or patterns.

# Area Plot: A line plot where the area below the line is filled with color, ideal for visualizing 
# the distribution or cumulative data over time.

