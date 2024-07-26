import cv2
import numpy as np
import sys
import json

# Read image.
img = cv2.imread(sys.argv[1], cv2.IMREAD_COLOR)

# Convert to grayscale.
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Blur using 3 * 3 kernel.
gray_blurred = cv2.blur(gray, (3, 3))

# Apply Hough transform on the blurred image.
detected_circles = cv2.HoughCircles(gray_blurred,
                                    cv2.HOUGH_GRADIENT, 1, 20, param1=50,
                                    param2=43, minRadius=1, maxRadius=40)

circle_count = 0

# Draw circles that are detected.
if detected_circles is not None:
    detected_circles = np.uint16(np.around(detected_circles))
    circle_count = len(detected_circles[0, :])
    for pt in detected_circles[0, :]:
        a, b, r = pt[0], pt[1], pt[2]
        cv2.circle(img, (a, b), r, (0, 255, 0), 2)
        cv2.circle(img, (a, b), 1, (0, 0, 255), 3)

cv2.imwrite(sys.argv[1], img)

result = {
    "circleCount": circle_count
}

print(json.dumps(result))
