library(plumber)
library(forecast)

# Add CORS headers
#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  
  # Handle preflight OPTIONS requests
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  
  plumber::forward()
}

# Load the saved models and scaling parameters
model_rb <- readRDS("model_rb.rds")
model_fs <- readRDS("model_fs.rds")
scale_params_rb <- readRDS("scale_params_rb.rds")
scale_params_fs <- readRDS("scale_params_fs.rds")

# Helper function to scale input data
scale_data <- function(data, params) {
  scaled_data <- sweep(data, 2, params[1, ], FUN = "-")
  scaled_data <- sweep(scaled_data, 2, params[2, ], FUN = "/")
  return(scaled_data)
}

#* @apiTitle ANN Model API for Rice Blast and False Smut Predictions

#* Predict Rice Blast
#* @param max_temp Maximum Temperature
#* @param min_temp Minimum Temperature
#* @param rh_morning Relative Humidity (Morning)
#* @param rh_evening Relative Humidity (Evening)
#* @param rainfall Rainfall
#* @param wind_speed Wind Speed
#* @param sunshine Sunshine
#* @param solar_radiation Solar Radiation
#* @param evaporation Evaporation
#* @get /predict_rice_blast
function(max_temp, min_temp, rh_morning, rh_evening, rainfall, wind_speed, sunshine, solar_radiation, evaporation) {
  # Prepare input data
  input <- data.frame(
    MaxTemp = as.numeric(max_temp),
    MinTemp = as.numeric(min_temp),
    RH_Morning = as.numeric(rh_morning),
    RH_Evening = as.numeric(rh_evening),
    Rainfall = as.numeric(rainfall),
    WindSpeed = as.numeric(wind_speed),
    Sunshine = as.numeric(sunshine),
    SolarRadiation = as.numeric(solar_radiation),
    Evaporation = as.numeric(evaporation)
  )
  
  # Scale input data
  scaled_input <- scale_data(input, scale_params_rb)
  
  # Predict using the model
  prediction <- forecast(model_rb, xreg = as.matrix(scaled_input), h = 1)$mean * 100
  
  # Return prediction
  list(predicted_rice_blast = prediction)
}

#* Predict False Smut
#* @param max_temp Maximum Temperature
#* @param min_temp Minimum Temperature
#* @param rh_morning Relative Humidity (Morning)
#* @param rh_evening Relative Humidity (Evening)
#* @param rainfall Rainfall
#* @param wind_speed Wind Speed
#* @param sunshine Sunshine
#* @param solar_radiation Solar Radiation
#* @param evaporation Evaporation
#* @get /predict_false_smut
function(max_temp, min_temp, rh_morning, rh_evening, rainfall, wind_speed, sunshine, solar_radiation, evaporation) {
  # Prepare input data
  input <- data.frame(
    MaxTemp = as.numeric(max_temp),
    MinTemp = as.numeric(min_temp),
    RH_Morning = as.numeric(rh_morning),
    RH_Evening = as.numeric(rh_evening),
    Rainfall = as.numeric(rainfall),
    WindSpeed = as.numeric(wind_speed),
    Sunshine = as.numeric(sunshine),
    SolarRadiation = as.numeric(solar_radiation),
    Evaporation = as.numeric(evaporation)
  )
  
  # Scale input data
  scaled_input <- scale_data(input, scale_params_fs)
  
  # Predict using the model
  prediction <- forecast(model_fs, xreg = as.matrix(scaled_input), h = 1)$mean * 100
  
  # Return prediction
  list(predicted_false_smut = prediction)
}

# Code to start the api in port 8000
# library(plumber)
# pr <- plumb("test_api.R")
# pr$run(port = 8000)