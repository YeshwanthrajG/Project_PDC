library(plumber)

#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  } else {
    forward()
  }
}

# Example endpoint for prediction
#* @get /predict
predict_risk <- function(temperature, humidity) {
  # Load the trained ANN model
  model <- readRDS("ann_model.rds")
  
  # Create a data frame for prediction
  input_data <- data.frame(
    temperature = as.numeric(temperature),
    humidity = as.numeric(humidity)
  )
  
  # Make prediction
  prediction <- compute(model, input_data)
  risk <- ifelse(prediction$net.result > 0.5, 1, 0)
  
  # Return the prediction
  list(rice_blast = risk)
}