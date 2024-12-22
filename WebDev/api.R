library(plumber)

#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, ngrok-skip-browser-warning")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  } else {
    forward()
  }
}

# Example endpoint for prediction
#* @get /predict
predict_risk <- function(req, res, temperature, humidity) {
  if (is.null(temperature) || is.null(humidity)) {
    res$status <- 400
    return(list(error = "Temperature and humidity are required"))
  }
  
  temperature <- as.numeric(temperature)
  humidity <- as.numeric(humidity)
  
  if (is.na(temperature) || is.na(humidity)) {
    res$status <- 400
    return(list(error = "Temperature and humidity must be valid numbers"))
  }
  
  tryCatch({
    model <- readRDS("ann_model.rds")
  }, error = function(e) {
    res$status <- 500
    return(list(error = paste("Error loading model:", e$message)))
  })
  
  input_data <- data.frame(
    temperature = temperature,
    humidity = humidity
  )
  
  prediction <- compute(model, input_data)
  risk <- ifelse(prediction$net.result > 0.5, 1, 0)
  
  res$setHeader("Content-Type", "application/json")
  return(list(rice_blast = risk))
}

# Initialize the API
pr <- Plumber$new()
pr$filter("cors", cors)
pr$handle("GET", "/predict", predict_risk)
pr$run(port = 8000)
