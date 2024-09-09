# Circle Detection Using OpenCV and Firebase Cloud Functions

This project demonstrates how to build a Circle Detection API using **Firebase Cloud Functions**, **OpenCV**, and **Python**. The application takes an image as input, processes it to detect circles using the Hough Circle Transform method, and returns the number of detected circles along with a processed image.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Overview
This project provides an API for detecting circles in images using OpenCV's `HoughCircles` method. The backend is powered by Firebase Cloud Functions, which allows us to handle image processing requests. The circle detection logic is written in Python, while the API is built using Node.js.

The input to the API is a base64-encoded image, and the response includes the number of detected circles and a processed image where the circles are highlighted.

## Features
- Detects circles in an image using the **Hough Circle Transform**.
- Highlights detected circles on the input image.
- Returns the number of detected circles and the processed image.
- Supports CORS for integration with frontend applications.

## Technologies Used
- **OpenCV**: For image processing and circle detection.
- **Firebase Cloud Functions**: To serve the backend API.
- **Node.js**: To implement the API logic and manage file handling.
- **Python**: For executing the circle detection logic.

## Installation

### Prerequisites
Ensure that you have the following installed on your local machine:
- Node.js
- Python 3 with OpenCV (`opencv-python` and `numpy` modules)
- Firebase CLI
- A Firebase project set up

### Steps
1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Initialize Firebase and deploy the function:
    ```bash
    firebase login
    firebase init functions
    firebase deploy --only functions
    ```

4. Ensure you have Python dependencies installed:
    ```bash
    pip install opencv-python numpy
    ```

## Usage

### Frontend
The API expects a POST request with a base64-encoded image in the body. You can integrate this with a frontend application using frameworks like Angular, React, or any other client.

### Sample Request
Here's an example of how to call the API:

```bash
POST /detectCircles HTTP/1.1
Host: <firebase-cloud-functions-url>
Content-Type: application/json

{
  "image": "<base64-encoded-image>"
}
```
## API Endpoints

### `POST /detectCircles`
- **Description**: Detects circles in an uploaded image.
- **Request Body**:
  - `image` (string, required): The base64-encoded image to process.
- **Response**:
  - `circleCount` (integer): The number of circles detected.
  - `processedImage` (string): The processed image (base64-encoded) with circles highlighted.

## Code Explanation

### Python Script (`detect_circles.py`)
- Loads an image using `cv2.imread`.
- Converts the image to grayscale and applies a blur.
- Uses the `HoughCircles` method to detect circles.
- Draws circles on the original image and saves it back.
- Outputs the number of detected circles in JSON format.

### Firebase Function (`index.ts`)
- Handles POST requests using Firebase Cloud Functions.
- Writes the base64-encoded image to a temporary location (`/tmp/image.jpg`).
- Invokes the Python script to detect circles.
- Returns the processed image and circle count as a JSON response.
