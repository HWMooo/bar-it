import Quagga from 'quagga';
import React, { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { useEffect } from "react"
import axios from "axios"




function BCS() {
    const [scannerRunning, setScannerRunning] = useState(false);
    const [barCode, setBarCode] = useState("");
    const [description, setDescription] = useState("");
    const { speak } = useSpeechSynthesis();
    const msg = new SpeechSynthesisUtterance()
    msg.text = description

    useEffect(() => {
        window.speechSynthesis.speak(msg)
    }, [description])

    async function getInfo(){
        const proxyurl = "https://cors-anywhere.herokuapp.com/"
        const response    = await axios.get(`${proxyurl}https://api.barcodelookup.com/v3/products?barcode=${barCode}&formatted=y&key=1rpdqrw4o3u4meisknmxfu8q0dorwz`)
        console.log("response.data in getInfo", response.data.products[0].title)
        console.log("response.data in getInfo", response.data.products[0].brand)
        console.log("response.data in getInfo", response.data.products[0].category)
        console.log("response.data in getInfo", response.data.products[0].stores)
        const productinfo = await response.data.products
        setDescription(response.data.products[0].title)
        setDescription(response.data.products[0].brand)
        setDescription(response.data.products[0].category)
        setDescription(response.data.products[0].stores)
        return response
    }

    useEffect(() => {
        let response = getInfo()
        console.log("here is useEffect Hook")
        console.log("response types", response)
    }, [barCode])
                

    function startScanner() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#scanner-container'),
                constraints: {
                    width: 480,
                    height: 320,
                    facingMode: "environment"
                },
            },
            decoder: {
                readers: [
                    "ean_reader"
                ],
                debug: {
                    showCanvas: true,
                    showPatches: true,
                    showFoundPatches: true,
                    showSkeleton: true,
                    showLabels: true,
                    showPatchLabels: true,
                    showRemainingPatchLabels: true,
                    boxFromPatches: {
                        showTransformed: true,
                        showTransformedBox: true,
                        showBB: true
                    }
                }
            },

        }, function (err) {
            if (err) {
                console.log("this is the error", err);
                return
            }

            console.log("Process starting");
            Quagga.start();
            setScannerRunning(true)
        });

        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0,
                        parseInt(drawingCanvas.getAttribute("width")), 
                        parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, 
                            { x: 0, y: 1 }, 
                            drawingCtx, 
                            { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, 
                        { x: 0, y: 1 }, 
                        drawingCtx, 
                        { color: "blue", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, 
                        { x: 'x', y: 'y' }, 
                        drawingCtx, 
                        { color: 'red', lineWidth: 3 });
                }
            }
        });
        Quagga.onDetected(function (result) {
            setBarCode(result.codeResult.code)
            Quagga.stop();

        });
    }

    function onClick(){
        if(scannerRunning){
            document.querySelector('#scanner-container').style.display = "none";
            setScannerRunning(false)
            Quagga.stop();

        }
        else{
            document.querySelector('#scanner-container').style.display = "block";
            startScanner()
        }
    }

    function handleSpeech(description){
        speak({ text: description })
    }



    return(<>

    <section id="scanner-container"></section>
    <input type="button" id="btn" value="Start/Stop the scanner" onClick={onClick}/>
    <h1>barcode: {barCode}</h1>
    <h2 onChange={() => handleSpeech(description)}>{description}</h2>
    
    
    
    
    </>)


}



export default BCS;
