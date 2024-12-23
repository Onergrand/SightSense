// sonification.js
import { Audio } from 'expo-av';

const TwoPi = 6.283185307179586;
const Pi = 3.141592653589793;

const FL = 500;
const FH = 5000;
const FS = 44100;
const T = 1.05;
const HIFI = 1;
const STEREO = 1;
const DELAY = 0;
const FADE = 1;
const DIFFR = 1;
const BSPL = 1;
// CONTRAST уже учитывается при обработке пикселей до вызова функций

const HIST = (1+HIFI)*(1+STEREO);
const M = 64;
const N = 176;

const PERSON = 1;
const BICYCLE = 2;
const VEHICLE = 3;
const MOTORBIKE = 4;

// Случайный генератор, как в оригинале
let ir=0, ia=9301, ic=49297, im=233280;

function rnd() {
    ir = (ir*ia+ic) % im;
    return ir / (im*1.0);
}

function wi(i, wavData) {
    const b0 = i & 0xFF;
    const b1 = (i >> 8) & 0xFF;
    wavData.push(b0,b1);
}

function wl(l, wavData) {
    const i0 = l & 0xFFFF;
    const i1 = (l >> 16) & 0xFFFF;
    wi(i0, wavData);
    wi(i1, wavData);
}

function pushString(str, wavData) {
    for (let i=0; i<str.length; i++) {
        wavData.push(str.charCodeAt(i));
    }
}

function fill_in_file(ns) {
    let wavData = [];
    pushString("RIFF", wavData);
    wl(ns*HIST+36, wavData);
    pushString("WAVEfmt ", wavData);
    wl(16, wavData);
    wi(1, wavData);
    wi(STEREO?2:1, wavData);
    wl(FS, wavData);
    wl(FS*HIST, wavData);
    wi(HIST, wavData);
    wi(HIFI?16:8, wavData);
    pushString("data", wavData);
    wl(ns*HIST, wavData);
    return wavData;
}

function wave(cls,a,f,t) {
    switch(cls) {
        case PERSON:
            return a * Math.sin(f*2*Pi*t) + ((a * Math.sin((f+25)*2*Pi * t) > 0)?1:-1);
        case BICYCLE:
            return -2.0*a/Pi*Math.atan(1.0/Math.tan(f*2*Pi*t));
        case VEHICLE:
            return 2*a/Pi*Math.asin(Math.sin(f*2*Pi*t)) + (-2.0*a/Pi*Math.atan(1.0/Math.tan(f*2*Pi*t)));
        case MOTORBIKE:
            return (a * Math.sin(f*2*Pi*t)>0)?1:-1;
        default:
            return 0.01*Math.sin(100*2*Pi*t);
    }
}

function base64FromByteArray(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    // Предполагается наличие btoa или import {encode as btoa} from 'base-64'
    return btoa(binary);
}

// Функция для воспроизведения звука из base64 WAV
export async function playBase64Sound(base64Sound) {
    try {
        const sound = new Audio.Sound();
        const soundUri = `data:audio/wav;base64,${base64Sound}`;
        await sound.loadAsync({ uri: soundUri });
        await sound.playAsync();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// stereo: принимает MxN массив A
export async function stereo(A) {
    let ns = 2*(Math.floor(0.5*FS*T));
    let wavData = fill_in_file(ns);

    let m = Math.floor(ns/N);
    let sso = HIFI?0:128;
    let ssm = HIFI?32768:128;

    let dt = 1.0/FS;
    let w = new Array(M);
    let phi0 = new Array(M);
    let scale = 0.5/Math.sqrt(M);
    let tau1,tau2,yl,yr,zl,zr;

    for (let i=0; i<M; i++) w[i]= TwoPi*FL*Math.pow(FH/FL,(i/(M-1)));
    for (let i=0; i<M; i++) phi0[i]=TwoPi*rnd();

    tau1=0.5/w[M-1];
    tau2=0.25*(tau1*tau1);
    yl=yr=zl=zr=0.0;

    let k=0;
    while(k<ns){
        let q,q2,a;
        if(BSPL){
            q=((k%m)/(m-1.0));
            q2=0.5*q*q;
        }
        let j=(k/m)|0;
        if (j>N-1) j=N-1;
        let r=k/(ns-1);
        let theta=(r-0.5)*TwoPi/3;
        let x=0.5*0.20*(theta+Math.sin(theta));
        let tl=k*dt;
        let tr=k*dt;
        if(DELAY) tr+=x/340.0;
        x=Math.abs(x);
        let sl=0.0, sr=0.0, hrtfl=1.0, hrtfr=1.0, hrtf;

        for (let i=0; i<M; i++){
            if(DIFFR){
                if((TwoPi*340.0/w[i])>x) hrtf=1.0; else hrtf=(TwoPi*340.0/(x*w[i]));
                if(theta<0){hrtfl=1.0;hrtfr=hrtf;} else {hrtfl=hrtf;hrtfr=1.0;}
            }
            if(FADE){
                hrtfl*=(1.0-0.7*r);
                hrtfr*=(0.3+0.7*r);
            }

            a = A[i][j];
            sl+=hrtfl*a*Math.sin(w[i]*tl+phi0[i]);
            sr+=hrtfr*a*Math.sin(w[i]*tr+phi0[i]);
        }

        if (k<ns/(5*N)) sl=(2.0*rnd()-1.0)/scale;
        if (tl<0.0) sl=0.0;
        if (tr<0.0) sr=0.0;

        let ypl=yl;
        yl=tau1/dt+tau2/(dt*dt);
        yl=(sl+yl*ypl+tau2/dt*zl)/(1.0+yl);
        zl=(yl-ypl)/dt;

        let ypr=yr;
        yr=tau1/dt+tau2/(dt*dt);
        yr=(sr+yr*ypr+tau2/dt*zr)/(1.0+yr);
        zr=(yr-ypr)/dt;

        let l = sso+0.5+scale*ssm*yl;
        if(l>=sso-1+ssm) l=sso-1+ssm;
        if(l<sso-ssm) l=sso-ssm;
        let ss=l|0;
        if(HIFI) wi(ss, wavData); else wavData.push(ss);

        l = sso+0.5+scale*ssm*yr;
        if(l>=sso-1+ssm) l=sso-1+ssm;
        if(l<sso-ssm) l=sso-ssm;
        ss=l|0;
        if(HIFI) wi(ss, wavData); else wavData.push(ss);

        k++;
    }

    const base64String = base64FromByteArray(new Uint8Array(wavData));
    return base64String;
}

// binaural: принимает два MxN массива A и B
export async function binaural(A,B) {
    let ns=2*(Math.floor(0.5*FS*T));
    let wavData = fill_in_file(ns);

    let m=(ns/N)|0;
    let sso = HIFI?0:128;
    let ssm = HIFI?32768:128;
    let dt=1.0/FS;
    let w=new Array(M);
    let phi0=new Array(M);
    let scale=0.5/Math.sqrt(M);

    for(let i=0; i<M; i++) w[i]=TwoPi*FL*Math.pow(FH/FL,i/(M-1));
    for(let i=0; i<M; i++) phi0[i]=TwoPi*rnd();

    let tau1=0.5/w[M-1];
    let tau2=0.25*tau1*tau1;

    let yl=0, yr=0, zl=0, zr=0;

    let k=0;
    while(k<ns) {
        let sl=0.0, sr=0.0;
        let t=k*dt;
        let j=(k/m)|0;
        if(j>N-1) j=N-1;

        if(k<ns/(5*N)){
            sl=(2.0*rnd()-1.0)/scale;
            sr=(2.0*rnd()-1.0)/scale;
        } else {
            for(let i=0; i<M; i++){
                sl+= A[i][j]*Math.sin(w[i]*t+phi0[i]);
                sr+= B[i][j]*Math.sin(w[i]*t+phi0[i]);
            }
        }

        let ypl=yl;
        yl=tau1/dt+tau2/(dt*dt);
        yl=(sl+yl*ypl+tau2/dt*zl)/(1.0+yl);
        zl=(yl-ypl)/dt;

        let ypr=yr;
        yr=tau1/dt+tau2/(dt*dt);
        yr=(sr+yr*ypr+tau2/dt*zr)/(1.0+yr);
        zr=(yr-ypr)/dt;

        let l=sso+0.5+scale*ssm*yl;
        if(l>=sso-1+ssm) l=sso-1+ssm;
        if(l<sso-ssm) l=sso-ssm;
        let ss=l|0;
        if(HIFI) wi(ss, wavData); else wavData.push(ss);

        l=sso+0.5+scale*ssm*yr;
        if(l>=sso-1+ssm) l=sso-1+ssm;
        if(l<sso-ssm) l=sso-ssm;
        ss=l|0;
        if(HIFI) wi(ss, wavData); else wavData.push(ss);

        k++;
    }

    const base64String = base64FromByteArray(new Uint8Array(wavData));
    return base64String;
}

// Псевдо-функция, которая принимает матрицу пикселей (M x N, каждый пиксель от 0 до 255)
// и возвращает base64-кодированное PNG-изображение.
// В реальном приложении нужно либо использовать доп. библиотеку, либо нативный модуль.
async function matrixToBase64Image(pixelMatrix) {
    // Псевдокод:
    // 1. Создать Bitmap или Canvas в памяти нужного размера.
    // 2. Установить каждый пиксель в оттенок серого pixelMatrix[i][j].
    // 3. Экспортировать изображение в PNG или JPEG в виде ArrayBuffer.
    // 4. Закодировать ArrayBuffer в base64.
    // Возвращаем строку base64 (без префикса data:image/png;base64, при необходимости можно добавить).

    // Здесь только логика, в реальном коде нужно использовать соответствующую библиотеку.
    throw new Error("matrixToBase64Image не реализована. Используйте библиотеку для генерации изображения.");
}

export async function processImage(imageBase64, mode, contrast) {
    try {
        const M = 64;
        const N = 176;
        const imageArray = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));

        // Превращаем в матрицу MxN
        const grayFrame = Array.from({ length: M }, (_, i) => {
            const start = i * N;
            return Array.from(imageArray.slice(start, start + N));
        });

        // Разделяем на левую и правую части
        const firstImage = grayFrame.map(row => row.slice(0, N/2));
        const secondImage = grayFrame.map(row => row.slice(N/2));

        const applyContrast = (val) => {
            const newVal = val + contrast * (val - 128);
            return Math.max(0, Math.min(255, newVal));
        };

        if (mode === 0) {
            // Смешиваем левую и правую в среднее
            const meanFrame = firstImage.map((row, i) => row.map((val, j) => (val + secondImage[i][j]) / 2));
            const processedFrame = meanFrame.map(row => row.map(applyContrast));

            // Генерируем звук
            const audioBase64 = await stereo(processedFrame);

            // Преобразуем processedFrame (M x N) в base64-картинку
            const processedImage = await matrixToBase64Image(processedFrame);

            return { processedImage, audioBase64 };

        } else if (mode === 1) {
            // Две отдельные обработанные части
            const processedFirst = firstImage.map(row => row.map(applyContrast));
            const processedSecond = secondImage.map(row => row.map(applyContrast));

            // Склеиваем в одно изображение M x N
            const combined = processedFirst.map((row, i) => row.concat(processedSecond[i]));

            // Генерируем звук
            const audioBase64 = await binaural(processedFirst, processedSecond);

            // Преобразуем combined в base64-картинку
            const processedImage = await matrixToBase64Image(combined);

            return { processedImage, audioBase64 };

        } else if (mode === 2) {
            // Третий режим
            const newLeft = Array.from({ length: M }, () => Array(13).fill(0));
            const newRight = Array.from({ length: M }, () => Array(13).fill(0));

            for (let i = 0; i < M; i++) {
                newLeft[i][0] = firstImage[i][0];
                newRight[i][0] = secondImage[i][0];
                let fs = 1;
                let step = 2;
                for (let j = 1; j < 13; j++) {
                    const leftSlice = firstImage[i].slice(fs, fs + step);
                    const rightSlice = secondImage[i].slice(fs, fs + step);
                    newLeft[i][j] = leftSlice.reduce((a, b) => a + b, 0) / step;
                    newRight[i][j] = rightSlice.reduce((a, b) => a + b, 0) / step;
                    fs += step;
                    step++;
                }
            }

            const processedLeft = newLeft.map(row => row.map(applyContrast));
            const processedRight = newRight.map(row => row.map(applyContrast));

            // Склеиваем в одно изображение M x 26 (13+13), если N был 176,
            // теперь у нас другая ширина. Предполагаем, что так и нужно.
            // Если необходимо соблюсти исходный размер, нужно уточнить логику.
            const combined = processedLeft.map((row, i) => row.concat(processedRight[i]));

            // Генерируем звук
            const audioBase64 = await binaural(processedLeft, processedRight);

            // Преобразуем combined в base64-картинку
            const processedImage = await matrixToBase64Image(combined);

            return { processedImage, audioBase64 };

        } else {
            throw new Error('Invalid mode');
        }

    } catch (error) {
        console.error('Error in processing image:', error);
        throw error;
    }
}
