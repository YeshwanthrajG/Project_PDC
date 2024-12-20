# Load necessary library
if (!require("neuralnet")) install.packages("neuralnet", dependencies = TRUE)
library(neuralnet)

# Example dataset
# Replace this with your actual data
set.seed(123)
data <- data.frame(
  Temperature = runif(100, 20, 40),  # Random temperatures between 20 and 40
  Humidity = runif(100, 50, 100),    # Random humidity values between 50 and 100
  Disease = sample(0:1, 100, replace = TRUE)  # Binary outcome: 0 or 1
)

# Normalize the data
normalize <- function(x) {
  (x - min(x)) / (max(x) - min(x))
}
data_norm <- as.data.frame(lapply(data, normalize))

# Train-test split
set.seed(123)
index <- sample(1:nrow(data_norm), 0.8 * nrow(data_norm))
train <- data_norm[index, ]
test <- data_norm[-index, ]

# Train the ANN model
set.seed(123)
formula <- Disease ~ Temperature + Humidity
model <- neuralnet(
  formula, 
  data = train, 
  hidden = c(5, 3),   # Two hidden layers with 5 and 3 neurons
  linear.output = FALSE
)

# Plot the model
plot(model)

# Make predictions
predictions <- compute(model, test[, c("Temperature", "Humidity")])
predicted_values <- ifelse(predictions$net.result > 0.5, 1, 0)

# Evaluate the model
actual_values <- test$Disease
confusion_matrix <- table(Predicted = predicted_values, Actual = actual_values)
accuracy <- sum(diag(confusion_matrix)) / sum(confusion_matrix)

# Print results
cat("Confusion Matrix:\n")
print(confusion_matrix)
cat("\nAccuracy:", accuracy, "\n")

# Load necessary library
library(neuralnet)

# Example training data
train_data <- data.frame(
  temperature = c(25, 30, 35, 40, 24, 24),
  humidity = c(50, 60, 70, 80, 90, 91),
  disease_risk = c(0, 1, 1, 0, 1, 0) # Target variable
)

# Train the ANN model
ann_model <- neuralnet(disease_risk ~ temperature + humidity, data = train_data, hidden = c(5), linear.output = FALSE)

# Save the trained ANN model
saveRDS(ann_model, "ann_model.rds")

# Print a confirmation message
cat("Model saved successfully as 'ann_model.rds'\n")