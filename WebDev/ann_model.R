rm(list = ls())
library(forecast)
library(tidyverse)
library(readxl)

# Load the dataset
file_path <- "D:/project/WEATHER DATA FINAL/NON ZERO DATA/cbe 2017-2023.xlsx"

data_rb <- read_excel(file_path, sheet = "Rice Blast")
data_fs <- read_excel(file_path, sheet = "False smut")

# Rename columns for Rice Blast and False Smut
colnames(data_rb) <- c("Year", "Week", "RiceBlast", "MaxTemp", "MinTemp", 
                       "RH_Morning", "RH_Evening", "Rainfall", "WindSpeed", 
                       "Evaporation", "Sunshine", "SolarRadiation")
colnames(data_fs) <- c("Year", "Week", "FalseSmut", "MaxTemp", "MinTemp", 
                       "RH_Morning", "RH_Evening", "Rainfall", "WindSpeed", 
                       "Evaporation", "Sunshine", "SolarRadiation")

# Assign seasons
assign_season <- function(data) {
  data$Season <- ifelse(
    format(as.Date(paste(data$Year, data$Week, 1, sep = "-"), "%Y-%U-%u"), "%m") %in% c("03", "04", "05"), "Summer",
    ifelse(format(as.Date(paste(data$Year, data$Week, 1, sep = "-"), "%Y-%U-%u"), "%m") %in% c("06", "07", "08", "09"), "Monsoon", "Winter")
  )
  return(data)
}
data_rb <- assign_season(data_rb)
data_fs <- assign_season(data_fs)

# Transform response variables
data_rb$ARCSINE_RB <- asin(sqrt((data_rb$RiceBlast + 0.5) / 100))
data_fs$ARCSINE_FS <- asin(sqrt((data_fs$FalseSmut + 0.5) / 100))

# Define regressors and responses
regressors_rb <- data_rb[, c("MaxTemp", "MinTemp", "RH_Morning", "RH_Evening", 
                             "Rainfall", "WindSpeed", "Sunshine", "SolarRadiation", "Evaporation")]
response_rb <- data_rb$ARCSINE_RB

regressors_fs <- data_fs[, c("MaxTemp", "MinTemp", "RH_Morning", "RH_Evening", 
                             "Rainfall", "WindSpeed", "Sunshine", "SolarRadiation", "Evaporation")]
response_fs <- data_fs$ARCSINE_FS

# Split and clean data
split_and_clean <- function(regressors, response) {
  train_size <- floor(0.8 * nrow(regressors))
  train_x <- regressors[1:train_size, ]
  train_y <- response[1:train_size]
  test_x <- regressors[(train_size + 1):nrow(regressors), ]
  test_y <- response[(train_size + 1):nrow(regressors)]
  
  train_x <- train_x %>% filter_all(all_vars(!is.na(.) & !is.nan(.) & !is.infinite(.)))
  test_x <- test_x %>% filter_all(all_vars(!is.na(.) & !is.nan(.) & !is.infinite(.)))
  
  list(train_x = train_x, train_y = train_y, test_x = test_x, test_y = test_y)
}

split_rb <- split_and_clean(regressors_rb, response_rb)
split_fs <- split_and_clean(regressors_fs, response_fs)

# Scale data
scale_data <- function(data, params) {
  scaled_data <- sweep(data, 2, params[1, ], FUN = "-")
  scaled_data <- sweep(scaled_data, 2, params[2, ], FUN = "/")
  return(scaled_data)
}

scale_params_rb <- apply(split_rb$train_x, 2, function(x) c(mean = mean(x), sd = sd(x)))
scale_params_fs <- apply(split_fs$train_x, 2, function(x) c(mean = mean(x), sd = sd(x)))

train_x_scaled_rb <- scale_data(split_rb$train_x, scale_params_rb)
test_x_scaled_rb <- scale_data(split_rb$test_x, scale_params_rb)
train_x_scaled_fs <- scale_data(split_fs$train_x, scale_params_fs)
test_x_scaled_fs <- scale_data(split_fs$test_x, scale_params_fs)

# Train models
model_rb <- nnetar(split_rb$train_y, size = 10, repeats = 50, xreg = train_x_scaled_rb, maxit = 150)
model_fs <- nnetar(split_fs$train_y, size = 10, repeats = 50, xreg = train_x_scaled_fs, maxit = 150)

# Save models and scaling parameters
saveRDS(model_rb, file = "model_rb.rds")
saveRDS(model_fs, file = "model_fs.rds")
saveRDS(scale_params_rb, file = "scale_params_rb.rds")
saveRDS(scale_params_fs, file = "scale_params_fs.rds")

cat("Models and scaling parameters saved successfully.\n")
