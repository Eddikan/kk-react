import React, { useState, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import 'Assets/styles/measurement.css';

function PixelComponent() {
    const [vm, setVm] = useState({ instruction: '' });
    const [pixToCmFactor, setPixToCmFactor] = useState(0);
    const [video, setVideo] = useState(null);
    const [model, setModel] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [buffer, setBuffer] = useState(null);
    const [state, setState] = useState(0);
    const [prevFactor, setPrevFactor] = useState(0);
    const [prevChestDepth, setPrevChestDepth] = useState(0);
    const [measurements, setMeasurements] = useState({
        height: 0,
        chest: 0,
        mid: 0,
        bottom: 0,
        shoulder: 0,
        length: 0,
        waist: 0,
        trouser: 0,
        collar: 0,
        sleeve: 0,
    });
    const [measurementsSample, setMeasurementsSample] = useState([]);
    const [sampleCount, setSampleCount] = useState(0);

    function Pixel(x, y) {
        return { x, y };
    }

    function distance(x1,y1,x2,y2){
        const distance = Math.sqrt(((x2-x1) ** 2) + ((y2-y1) ** 2));
        return distance * pixToCmFactor;
    }

    function getPixToCm(ctx,  height, leftEye, leftAnkle, mask){
        const headTop = getBlobEdge("up", {x: leftEye.position.x, y: leftEye.position.y }, mask, false);
        headTop.y++;
        const top = getBlobEdge("left", headTop, mask, false);
        const heel = getBlobEdge("left", {x: leftAnkle.position.x, y: leftAnkle.position.y }, mask, false);
        const pixHeight = distancePixel(top.x, top.y, heel.x, heel.y);
        drawLine(ctx,top,heel,'black');
    
        pixToCmFactor = height / pixHeight;
    }
    
    function distancePixel(x1,y1,x2,y2){
        const distance = Math.sqrt(((x2-x1) ** 2) + ((y2-y1) ** 2));
        return distance;
    }

    function drawLine(ctx, start, end, color='black'){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(end.x,end.y);
        ctx.stroke();
    }
    

    function pixToImageDataCoord(x, y, width, height){
        return (y * width + x) * 4;
    }

    function getPixColor(x, y, mask){
        const i = pixToImageDataCoord(x,y,mask.width,mask.height);
        return [mask.data[i], mask.data[i+1], mask.data[i+2]];
    }

    function getPixColor(x, y, mask){
        const i = pixToImageDataCoord(x,y,mask.width,mask.height);
        return [mask.data[i], mask.data[i+1], mask.data[i+2]];
    }

    function isColoured(color){
        return !((color[0] == 255) && (color[1] == 255) && (color[2] == 255));
    }

    function isEqualArray(first, second){
        if(first.length == second.length){
            for(let i = 0; i < first.length; i++) {
                if(first[i] != second[i]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    function getScores(segmentation, idealScore){
        if(segmentation.allPoses[0].score <= idealScore)
            return false;
        if(segmentation.allPoses[0].keypoints[5].score <= idealScore)
            return false;
        if(segmentation.allPoses[0].keypoints[6].score <= idealScore)
            return false;
        if(segmentation.allPoses[0].keypoints[1].score <= idealScore)
            return false;
        if(segmentation.allPoses[0].keypoints[3].score <= idealScore)
            return false;
        if(segmentation.allPoses[0].keypoints[15].score <= idealScore)
            return false;
        if(segmentation.allPoses[0].keypoints[11].score <= idealScore)
            return false;
        if(segmentation.allPoses[0].keypoints[7].score <= idealScore)
            return false;
        if(segmentation.allPoses[0].keypoints[0].score <= idealScore)
            return false;
        
        return true;
    }

    const setup = async () => {
        console.info('TensorFlow.js version', tf.version['tfjs']);
        console.log(tf.getBackend());
        const vid = document.getElementById("video");
        setVideo(vid);
        const can = document.getElementById('output');
        setCanvas(can);
        const buf = document.getElementById("buffer");
        setBuffer(buf);

        setState(0);

        const mod = await bodyPix.load();
        setModel(mod);
        console.log('Model loaded');
        vid.setAttribute('autoPlay', '');
        vid.setAttribute('muted', '');
        vid.setAttribute('playsInline', '');

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(function (stream) {
                    vid.srcObject = stream;
                })
                .catch(function (err) {
                    console.error("Camera error: " + err + err.message);
                })
        } else {
            console.log("NO CAMERA FOUND");
        }

        vid.onloadedmetadata = () => {
            // canvas.width = video.videoWidth;
            // canvas.height = video.videoHeight;
        }

        vid.onplay = () => {
            vid.width = can.width;
            vid.height = can.height;
            predictF();
        }
    };

    const sharpen = (ctx, w, h, mix) => {
        var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
            weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
            katet = Math.round(Math.sqrt(weights.length)),
            half = (katet * 0.5) | 0,
            dstData = ctx.createImageData(w, h),
            dstBuff = dstData.data,
            srcBuff = ctx.getImageData(0, 0, w, h).data,
            y = h;

        while (y--) {
            x = w;
            while (x--) {
                sy = y;
                sx = x;
                dstOff = (y * w + x) * 4;
                r = 0;
                g = 0;
                b = 0;
                a = 0;

                for (cy = 0; cy < katet; cy++) {
                    for (cx = 0; cx < katet; cx++) {
                        scy = sy + cy - half;
                        scx = sx + cx - half;

                        if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                            srcOff = (scy * w + scx) * 4;
                            wt = weights[cy * katet + cx];

                            r += srcBuff[srcOff] * wt;
                            g += srcBuff[srcOff + 1] * wt;
                            b += srcBuff[srcOff + 2] * wt;
                            a += srcBuff[srcOff + 3] * wt;
                        }
                    }
                }

                dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
                dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
                dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
                dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
            }
        }

        ctx.putImageData(dstData, 0, 0);
    };

    function getBlobEdge(direction, origin, mask, ignoreColor=false, testColor=false){
        var currentX = Math.round(origin.x);
        var currentY = Math.round(origin.y);
        if((currentY < 0 || currentY > mask.height) || (currentX < 0 || currentX > mask.width)){
            
            currentY =  Math.min(Math.max(currentY, 0), mask.height);
            currentX =  Math.min(Math.max(currentX, 0), mask.width);
            // console.log(currentX + " " + currentY);
            return new Pixel(currentX,currentY);
        }
    
        const originColor = getPixColor(currentX, currentY, mask);
        var currentColor = originColor;
        if(direction == "up"){
             while((isEqualArray(originColor,currentColor)) || (ignoreColor && isColoured(currentColor)) || (testColor && isColoured(currentColor) &&  !isEqualArray(testColor,currentColor))){
                --currentY
                currentColor = getPixColor(currentX, currentY, mask);
            }
        }else if(direction == "down"){
            while((isEqualArray(originColor,currentColor)) || (ignoreColor && isColoured(currentColor)) || (testColor && isColoured(currentColor) && !isEqualArray(testColor,currentColor))){
                ++currentY;
                currentColor = getPixColor(currentX, currentY, mask);
            }
        }else if(direction == "left"){
            while((isEqualArray(originColor,currentColor)) || (ignoreColor && isColoured(currentColor)) || (testColor && isColoured(currentColor) && !isEqualArray(testColor,currentColor))){
                --currentX;
                currentColor = getPixColor(currentX, currentY, mask);
            }
        }else if(direction == "right"){
            while((isEqualArray(originColor,currentColor)) || (ignoreColor && isColoured(currentColor)) || (testColor && isColoured(currentColor) && !isEqualArray(testColor,currentColor))){
                ++currentX;
                currentColor = getPixColor(currentX, currentY, mask);
            }
        }
    
        return new Pixel(currentX,currentY);
    }

    const predictF = async () => {
        var leftShoulder;
        var rightShoulder;
        var leftEye;
        var nose;
        var leftAnkle;
        var leftHip;
        var leftElbow;
        var leftWrist;
        let ctx;
        const opacity = 0.5;
        const flipHorizontal = false;
        const maskBlurAmount = 0;

        var internalResolution = 'high';
        var segmentationThreshold = 0.7;
         
        if (state == 0 && buffer) {
            vm.instruction = "Stand Straight and stay still, Make sure your full length is in view of camera";

            ctx = buffer.getContext('2d');
            // ctx.drawImage(video, 0, 0);
            //resize?
            var scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
            var x = (canvas.width / 2) - (video.videoWidth / 2) * scale;
            var y = (canvas.height / 2) - (video.videoHeight / 2) * scale;
            ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale)
            sharpen(ctx, buffer.width, buffer.height, 0.7);

            // person segment that shit and draw
            //front measurement
            const frontSegementation = await model.segmentPersonParts(buffer, {
                flipHorizontal: false,
                internalResolution: internalResolution,
                segmentationThreshold: segmentationThreshold,
                maxDetections: 1
            });

            if(typeof frontSegementation.allPoses[0] !== 'undefined'){
                //calculate keypoints
                leftShoulder = frontSegementation.allPoses[0].keypoints[5];
                rightShoulder = frontSegementation.allPoses[0].keypoints[6];
                leftEye = frontSegementation.allPoses[0].keypoints[1];
                nose = frontSegementation.allPoses[0].keypoints[0];
                leftAnkle = frontSegementation.allPoses[0].keypoints[15];
                leftHip = frontSegementation.allPoses[0].keypoints[11];
                leftElbow = frontSegementation.allPoses[0].keypoints[7];
                leftWrist = frontSegementation.allPoses[0].keypoints[9];
            
                // draw the mask
                const frontMask = bodyPix.toColoredPartMask(frontSegementation);
                bodyPix.drawMask(canvas, buffer, frontMask, opacity, maskBlurAmount, flipHorizontal);
            
                //Draw helpers
                ctx = canvas.getContext('2d');
                ctx.fillRect(leftShoulder.position.x, leftShoulder.position.y, 4, 4);
                ctx.fillRect(rightShoulder.position.x, rightShoulder.position.y, 4, 4);
                ctx.fillRect(leftHip.position.x, leftHip.position.y, 4, 4);
                ctx.fillRect(leftAnkle.position.x, leftAnkle.position.y, 4, 4);
                ctx.fillRect(leftEye.position.x, leftEye.position.y, 4, 4);

                // calculate measurements if score is more that 90% and increment state
                if(getScores(frontSegementation, 0.9)){
                    vm.instruction = "Stand Still, Measuring";
                    vm.loading = true;
                    getPixToCm(ctx, measurements.height, leftEye, leftAnkle, frontMask);
                    console.log(frontSegementation);
                    //get measurements
                    const shoulderLeft = getBlobEdge("right", leftShoulder.position, frontMask, false);
                    const shoulderRight = getBlobEdge("left", rightShoulder.position, frontMask, false);
                    drawLine(ctx, shoulderRight, shoulderLeft, 'black');
                    measurements.shoulder = distance(shoulderLeft.x, shoulderLeft.y, shoulderRight.x, shoulderRight.y);
                    
                    var shirtTop = getBlobEdge("up", leftHip.position, frontMask, false);
                    var shirtBottom = new Pixel(leftHip.position.x, leftHip.position.y);
                    drawLine(ctx, shirtTop, shirtBottom, 'black');
                    measurements.length = distance(shirtTop.x, shirtTop.y, shirtBottom.x, shirtBottom.y);

                    var chestPoint = new Pixel((2*shirtTop.x + shirtBottom.x) / 3 ,  (2*shirtTop.y + shirtBottom.y) / 3);
                    var shirtLeft = getBlobEdge("left", chestPoint, frontMask, false);
                    var shirtRight = getBlobEdge("right", chestPoint, frontMask, false);
                    const chest = distance(shirtLeft.x, shirtLeft.y, shirtRight.x, shirtRight.y);
                    drawLine(ctx, shirtLeft, shirtRight, 'green');
                    measurements.chest = chest ;

                    var midPoint = new Pixel((shirtTop.x + shirtBottom.x) / 2 ,  (shirtTop.y + shirtBottom.y) / 2);
                    var shirtLeft = getBlobEdge("left", midPoint, frontMask, false);
                    var shirtRight = getBlobEdge("right", midPoint, frontMask, false);
                    const mid = distance(shirtLeft.x, shirtLeft.y, shirtRight.x, shirtRight.y);
                    drawLine(ctx, shirtLeft, shirtRight, 'black');
                    measurements.mid = mid ;

                    var bottomPoint = new Pixel((shirtTop.x + 2*shirtBottom.x) / 3 ,  (shirtTop.y + 2*shirtBottom.y) / 3);
                    var shirtLeft = getBlobEdge("left", bottomPoint, frontMask, false);
                    var shirtRight = getBlobEdge("right", bottomPoint, frontMask, false);
                    const bottom = distance(shirtLeft.x, shirtLeft.y, shirtRight.x, shirtRight.y);
                    drawLine(ctx, shirtLeft, shirtRight, 'blue');
                    measurements.bottom = bottom ;


                    var leftWaist = getBlobEdge("left", leftHip.position, frontMask, false);
                    var rightWaist = getBlobEdge("right", leftHip.position, frontMask, false);
                    drawLine(ctx, leftWaist, rightWaist, 'black');
                    const waist = distance(leftWaist.x, leftWaist.y, rightWaist.x, rightWaist.y);
                    measurements.waist = waist ;

                    var sleeveTop = getBlobEdge("right", leftShoulder.position, frontMask, false);
                    // var sleeveBottom = getBlobEdge("down", sleeveTop, frontMask, false, [217, 194, 49]);
                    var sleeveBottom = new Pixel(leftWrist.position.x, leftWrist.position.y);
                    const sleeve = distance(sleeveTop.x, sleeveTop.y, sleeveBottom.x, sleeveBottom.y);
                    drawLine(ctx, sleeveTop, sleeveBottom, "black");
                    measurements.sleeve = sleeve;

                    const t = distance(leftHip.position.x, leftHip.position.y, leftAnkle.position.x, leftAnkle.position.y);
                    drawLine(ctx, leftHip.position, leftAnkle.position, "red");
                    measurements.trouser = t;

                    ctx.fillRect(sleeveTop.x, sleeveTop.y, 4, 4);
                    ctx.fillRect(sleeveBottom.x, sleeveBottom.y, 4, 4); 
                    ctx.fillRect(leftWaist.x, leftWaist.y, 2, 2);
                    ctx.fillRect(rightWaist.x, rightWaist.y, 2, 2);
                    ctx.fillRect(shirtTop.x, shirtTop.y, 4, 4);
                    ctx.fillRect(shirtBottom.x, shirtBottom.y, 4, 4);

                    // if person is static
                    //Math.abs(prevFactor - pixToCmFactor) < 0.00001
                    if(Math.abs(prevFactor - pixToCmFactor) < 0.01){
                        //record 10 measurements
                        if(measurementsSample.length < 10){
                            measurementsSample.push(Object.assign({},measurements));
                        }else{
                            //take a snap
                            console.log(frontSegementation);
                            vm.loading = false;
                            const snap1 = document.getElementById('snap1');
                            snap1.width = canvas.width;
                            snap1.height = canvas.height;
                            const snap1Ctx = snap1.getContext('2d');
                            const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            snap1Ctx.putImageData(img, 0, 0);
                            console.log(measurementsSample);
                            console.log("TURN");
                            // console.log(frontSegementation);
                            // console.log("Shirt Chest: " + measurements.chest + " cm");
                            // console.log("Shirt Mid: "+ measurements.mid + " cm");
                            // console.log("Shirt Bottom: "+ measurements.bottom + " cm");
                            // console.log("Waist: " + measurements.waist + " cm");
                            // console.log("TURN Right!");
                            state++;
                        }
                    }
                    else
                        prevFactor = pixToCmFactor;
                }
            }
        }

        if (model) {
            const segmentation = await model.segmentPerson(video);
            const mask = bodyPix.toMask(segmentation);
            const ctx = buffer.getContext('2d');
            const ctxOut = canvas.getContext('2d');
            ctxOut.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imgData = ctxOut.getImageData(0, 0, canvas.width, canvas.height);
            const pix = imgData.data;
            const alpha = mask.data;
            const ref = this;
            const factor = pixToCmFactor;
            const chestDepth = measurements.chest;
            const chestDepthBottom = measurements.bottom;
            let chestDiff = 0;

            for (let i = 0; i < alpha.length; i++) {
                if (alpha[i] == 255) {
                    const pos = Math.floor(i / 4);
                    const y = Math.floor(pos / canvas.width);
                    const x = pos % canvas.width;
                    const depth = y - chestDepthBottom;
                    const back = 255 - pix[                4 * pos];
                    const front = pix[4 * pos + 3];
                    const index = 4 * pos + 1;

                    if (depth > 0 && back > front) {
                        chestDiff += (depth / factor);
                        imgData.data[index] = 0;
                        imgData.data[index + 1] = 255;
                        imgData.data[index + 2] = 0;
                        imgData.data[index + 3] = 255;
                    } else {
                        imgData.data[index] = 255;
                        imgData.data[index + 1] = 0;
                        imgData.data[index + 2] = 0;
                        imgData.data[index + 3] = 255;
                    }
                }
            }

            ctx.putImageData(imgData, 0, 0);

            if (chestDiff > 0) {
                chestDiff = chestDiff / 100;
                chestDiff = parseFloat(chestDiff).toFixed(2);
                setPrevChestDepth(chestDepth);
                setMeasurements({
                    ...measurements,
                    chest: parseFloat(chestDepth) + parseFloat(chestDiff)
                });
            }

            const previousChestDepth = prevChestDepth;

            if (previousChestDepth !== 0 && chestDepth !== 0) {
                setState(1);
            } else {
                setState(0);
            }

            const midPos = (chestDepth + chestDepthBottom) / 2;
            const toDraw = Math.round(midPos * canvas.width);
            ctxOut.beginPath();
            ctxOut.moveTo(toDraw, 0);
            ctxOut.lineTo(toDraw, canvas.height);
            ctxOut.stroke();
            const ctxMeasure = canvas.getContext('2d');
            ctxMeasure.font = "30px Arial";
            ctxMeasure.fillText(chestDiff + " cm", toDraw + 10, 50);
            // console.log(chestDiff);
            requestAnimationFrame(predictF);
        }

        
    };

    useEffect(() => {
        
        setup();
    }, [model]);

    return (
        <div>
            {/* HTML elements go here if needed */}
            <video autoPlay="" id="video" muted="" playsInline="" width="640" height="480"></video>
            <canvas width="640" height="480" id="output"></canvas>
            <canvas width="640" height="480" id="buffer"></canvas>
        </div>
    );
}

export default PixelComponent;

