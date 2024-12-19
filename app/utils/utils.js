import { useState } from 'react';

const fs = require('fs');
const axios = require('axios');
const cv = require('opencv4nodejs');
const ffi = require('ffi-napi');
const sharp = require('sharp');

// Константы
const IMAGE_SIZE = 416;
const N = 176;
const M = 64;
const FNAME = 'mono.wav';
const IMAGE_PATH = 'output_image.png';
const c_file = './newlib.so';
const c_fun = ffi.Library(c_file, {
    'stereo': ['void', ['pointer']],
    'binaural': ['void', ['pointer', 'pointer']]
});

const useFontSize = () => {
    const [fontSize, setFontSize] = useState({
        title: 48,
        button: 18,
        main: 24,
        buttonResize: 36,
    });

    return { fontSize, setFontSize };
};

async function loadImage(image) {
    if (image.startsWith('http://') || image.startsWith('https://')) {
        const response = await axios.get(image, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const img = await sharp(buffer).raw().toBuffer();
        const mat = cv.matFromImageData(new Uint8Array(img));
        return mat;
    } else {
        return cv.imread(image);
    }
}

// Функция для преобразования изображения с заданной контрастностью
function convertImage(frame, contrast) {
    let gray = frame.resize(N, M).bgrToGray();
    let avg = gray.mean();
    let contrastFrame = gray.add(contrast * (gray.subtract(avg)));
    contrastFrame = contrastFrame.clamp(0, 255);
    let typeFrame = contrastFrame.eq(0).mul(contrastFrame).add(
        contrastFrame.notEq(0).mul(cv.pow(10, (contrastFrame.div(16).sub(15)).div(10)))
    );
    typeFrame = typeFrame.flip(1).flip(0); // flip both horizontally and vertically
    return typeFrame.convertTo(cv.CV_64F);
}

// Функция для сохранения изображения
function saveImage(array, outputPath) {
    const newarr = array.normalize(0, 255, cv.NORM_MINMAX).convertTo(cv.CV_8U);
    cv.imwrite(outputPath, newarr);
}

// Функция для слияния и сохранения половин изображений
function mergeSaveImageHalves(array1, array2, outputPath) {
    const newarr1 = array1.normalize(0, 255, cv.NORM_MINMAX).convertTo(cv.CV_8U);
    const newarr2 = array2.normalize(0, 255, cv.NORM_MINMAX).convertTo(cv.CV_8U);

    const image1 = cv.imdecode(newarr1);
    const image2 = cv.imdecode(newarr2);

    if (image1.rows !== image2.rows) {
        throw new Error("Image heights do not match.");
    }

    const leftHalf = image1.roi(new cv.Rect(0, 0, image1.cols / 2, image1.rows));
    const rightHalf = image2.roi(new cv.Rect(image2.cols / 2, 0, image2.cols, image2.rows));

    const resultImage = new cv.Mat(leftHalf.rows, leftHalf.cols + rightHalf.cols, leftHalf.type);
    leftHalf.copyTo(resultImage.roi(new cv.Rect(0, 0, leftHalf.cols, leftHalf.rows)));
    rightHalf.copyTo(resultImage.roi(new cv.Rect(leftHalf.cols, 0, rightHalf.cols, rightHalf.rows)));

    cv.imwrite(outputPath, resultImage);
}

export async function remake(mode, contrast, image) {
    try {
        const frame = await loadImage(image);
        if (!frame) {
            throw new Error("Cannot load the image.");
        }

        frame.resize(N, M);
        const grayFrame = frame.bgrToGray();
        const [firstImage, secondImage] = grayFrame.split(1);

        if (mode === 0) {
            const meanFrame = firstImage.add(secondImage).div(2);
            const newFrame = convertImage(meanFrame, contrast);
            c_fun.stereo(newFrame.getDataAsArray());
            saveImage(newFrame, IMAGE_PATH);
        } else if (mode === 1) {
            const newFirstImage = convertImage(firstImage, contrast);
            const newSecondImage = convertImage(secondImage, contrast);
            mergeSaveImageHalves(firstImage, secondImage, IMAGE_PATH);
            c_fun.binaural(newFirstImage.getDataAsArray(), newSecondImage.getDataAsArray());
        } else if (mode === 2) {
            let newLeft = new cv.Mat(M, 13, cv.CV_64F);
            let newRight = new cv.Mat(M, 13, cv.CV_64F);
            firstImage = firstImage.flip(0);
            newLeft.col(0).assign(firstImage.col(0));
            newRight.col(0).assign(secondImage.col(0));

            let fs = 1;
            let step = 2;
            for (let i = 1; i < 13; i++) {
                newLeft.col(i).assign(firstImage.colRange(fs, fs + step).mean(1));
                newRight.col(i).assign(secondImage.colRange(fs, fs + step).mean(1));
                fs += step;
                step++;
            }

            const newFirstImage = convertImage(newLeft, contrast);
            const newSecondImage = convertImage(newRight, contrast);
            mergeSaveImageHalves(firstImage, secondImage, IMAGE_PATH);
            c_fun.binaural(newFirstImage.getDataAsArray(), newSecondImage.getDataAsArray());
        } else {
            throw new Error("Invalid mode.");
        }

        console.log(`Image saved to ${IMAGE_PATH}`);
    } catch (e) {
        throw new Error(`Processing error: ${e.message}`);
    }
}



export { useFontSize };
