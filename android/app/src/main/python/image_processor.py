import base64
import os
import cv2
from ctypes import CDLL, POINTER, c_double
import numpy as np
import requests
from PIL import Image
from io import BytesIO

IMAGE_SIZE = 416
N = 176
M = 64
FNAME = 'mono.wav'
IMAGE_PATH = 'output_image.png'
c_file = '../jniLibs/arm64-v8a/libmynative.so'
c_fun = CDLL(c_file)

def load_image(image):
    """Loads an image from a file path or URL."""
    if image.startswith('http://') or image.startswith('https://'):
        response = requests.get(image)
        img = Image.open(BytesIO(response.content))
        return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    else:
        return cv2.imread(image)

def convert_image(frame, contrast):
    """Converts the image with the given contrast adjustment."""
    gray = cv2.resize(frame, (N, M))
    avg = gray.mean()
    contrast_frame = gray + contrast * (gray - avg)
    contrast_frame = np.clip(contrast_frame, 0, 255)
    type_frame = np.where(contrast_frame == 0, contrast_frame, 10 ** ((contrast_frame / 16 - 15) / 10))
    type_frame = np.flip(np.fliplr(type_frame))
    return type_frame.astype(np.float64)

def save_image(array, output_path):
    """Saves an array as an image."""
    newarr = cv2.normalize(array, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    image = Image.fromarray(newarr)
    image.save(output_path)

def merge_save_image_halves(array1, array2, output_path):
    """Merges two image halves and saves the result."""
    newarr1 = cv2.normalize(array1, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    newarr2 = cv2.normalize(array2, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    image1 = Image.fromarray(newarr1)
    image2 = Image.fromarray(newarr2)

    if image1.height != image2.height:
        raise ValueError("Image heights do not match.")

    left_half = image1.crop((0, 0, image1.width // 2, image1.height))
    right_half = image2.crop((image2.width // 2, 0, image2.width, image2.height))

    result_image = Image.new("RGB", (left_half.width + right_half.width, left_half.height))
    result_image.paste(left_half, (0, 0))
    result_image.paste(right_half, (left_half.width, 0))
    result_image.save(output_path)

def remake(mode, contrast, image):
    """Processes an image based on mode and contrast."""
    frame = load_image(image)
    if frame is None:
        raise ValueError("Cannot load the image.")

    frame = cv2.resize(frame, (N, M))
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    first_image, second_image = np.split(gray_frame, 2, axis=1)

    try:
        if mode == 0:
            mean_frame = (first_image + second_image) / 2
            new_frame = convert_image(mean_frame, contrast)
            c_fun.stereo(new_frame.ctypes.data_as(POINTER(c_double)))
            save_image(new_frame, IMAGE_PATH)

        elif mode == 1:
            new_first_image = convert_image(first_image, contrast)
            new_second_image = convert_image(second_image, contrast)
            merge_save_image_halves(first_image, second_image, IMAGE_PATH)
            c_fun.binaural(new_first_image.ctypes.data_as(POINTER(c_double)),
                           new_second_image.ctypes.data_as(POINTER(c_double)))

        elif mode == 2:
            newleft = np.empty((M, 13))
            newright = np.empty((M, 13))
            first_image = np.flip(first_image)
            newleft[:, 0] = first_image[:, 0]
            newright[:, 0] = second_image[:, 0]
            fs = 1
            step = 2
            for i in range(1, 13):
                newleft[:, i] = np.mean(first_image[:, fs:fs + step], axis=1)
                newright[:, i] = np.mean(second_image[:, fs:fs + step], axis=1)
                fs += step
                step += 1

            new_first_image = convert_image(newleft, contrast)
            new_second_image = convert_image(newright, contrast)
            merge_save_image_halves(first_image, second_image, IMAGE_PATH)
            c_fun.binaural(new_first_image.ctypes.data_as(POINTER(c_double)),
                           new_second_image.ctypes.data_as(POINTER(c_double)))

        else:
            raise ValueError("Invalid mode.")

        print(f"Image saved to {IMAGE_PATH}")

    except Exception as e:
        raise RuntimeError(f"Processing error: {str(e)}")
