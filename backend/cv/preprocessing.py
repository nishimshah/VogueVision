"""
Image Preprocessing Module for VogueVision
Handles image decoding, validation, resizing, and color space conversions using OpenCV.
"""

import cv2
import numpy as np

def decode_image(image_bytes: bytes) -> np.ndarray:
    """
    Decodes raw image bytes into an OpenCV BGR numpy array.
    Raises ValueError if image is invalid or cannot be decoded.
    """
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Empty image data provided.")

    np_arr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Failed to decode image. Please provide a valid JPG, JPEG, or PNG file.")

    return image

def preprocess_image(image: np.ndarray, target_size=(256, 256)):
    """
    Preprocesses the decoded image:
    1. Validates dimensions.
    2. Resizes to target dimension (default 256x256) for uniform feature extraction.
    3. Converts to RGB and HSV color spaces.
    Returns a dictionary with processed arrays and metadata.
    """
    if image is None or not isinstance(image, np.ndarray):
        raise ValueError("Invalid image array.")

    h, w = image.shape[:2]
    if h == 0 or w == 0:
        raise ValueError("Image dimensions cannot be zero.")

    # Resize with area interpolation (optimal for downsampling/standardizing)
    resized_bgr = cv2.resize(image, target_size, interpolation=cv2.INTER_AREA)

    # Convert color spaces
    rgb = cv2.cvtColor(resized_bgr, cv2.COLOR_BGR2RGB)
    hsv = cv2.cvtColor(resized_bgr, cv2.COLOR_BGR2HSV)

    return {
        "original_dimensions": [w, h],
        "processed_dimensions": list(target_size),
        "bgr": resized_bgr,
        "rgb": rgb,
        "hsv": hsv
    }
