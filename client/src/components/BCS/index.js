import Quagga from 'quagga';
import React, { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { useEffect } from "react"
import axios from 'axios';



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

        try{
            const proxyurl = "https://cors-anywhere.herokuapp.com/"
            const response    = await axios.get(`${proxyurl}https://api.barcodelookup.com/v3/products?barcode=${barCode}&formatted=y&key=n5ztt93jii7dem2cwhbupg9mpi8xen`)
            setDescription(response.data.products[0].description)
            console.log("response.data in getInfo", response.data.products[0].title)
            console.log("response.data in getInfo", response.data.products[0].brand)
            // console.log("response.data in getInfo", response.data.products[0].category)
            // console.log("response.data in getInfo", response.data.products[0].stores)
            const productinfo = await response.data.products
            setDescription(response.data.products[0].title)
            setDescription(response.data.products[0].brand)
            // setDescription(response.data.products[0].category)
            // setDescription(response.data.products[0].stores)
            return response

        }
        catch (err){
            setDescription("Sorry, i dont have that in my database, please try again")
            setBarCode("")
            setDescription("")
            startScanner()
            document.querySelector('#scanner-container').style.display = "block";
            return err
        }

    }

    useEffect(() => {
        startScanner()
    }, [])


    useEffect(() => {
        if(barCode){
            getInfo()
            setBarCode("")
        }
    }, [scannerRunning])


    function startScanner() {
        let counter = 0
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#scanner-container'),
                constraints: {
                    width: { min: 640, ideal: 1920, max: 4096 },
                    height: { min: 480, ideal: 1080, max: 2400 },
                    facingMode: "environment",
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
            document.querySelector('canvas').style.display = "inline";
        });

        Quagga.onProcessed(function (result) {
            let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
            if (result) {
                setDescription("barcode detected")
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
            else{
                counter++
                if(counter % 500 === 0){
                    setDescription("no barcode has been detected")
                }
            }

        });
        Quagga.onDetected(function (result) {
            setBarCode(result.codeResult.code)
            setDescription("barcode scanned")
            document.querySelector('#scanner-container').style.display = "none";
            document.querySelector('canvas').style.display = "none";
            setScannerRunning(false)

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




    return(<>

    <section id="scanner-container"></section>
    <input type="button" id="btn" value="Start/Stop the scanner" onClick={onClick}/>
    <h1>barcode: {barCode}</h1>
    
    
    
    
    </>)


}



export default BCS;
