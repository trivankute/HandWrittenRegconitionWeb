const BG_COLOR = "#231f20"
const wallColor = "#aaa"
let BG_SIZE = (window.innerWidth < 440) ? 250 : 600
let squareSize = (window.innerWidth < 440) ? 12.5 : 30
let width
let height
width = height = BG_SIZE / squareSize
const totalSquares = (BG_SIZE / squareSize) * 2 - 1
let time = 25
let totalTime = time * totalSquares
const createDraw = document.getElementById('draw')
const checkButton = document.getElementById('checkButton')
const addButton = document.getElementById('addButton')
const resetButton = document.getElementById('resetButton')
const text = document.getElementById('text')
let canvas = document.getElementById('canvas')

canvas.width = canvas.height = BG_SIZE
let ctx = canvas.getContext('2d')
ctx.fillStyle = BG_COLOR
ctx.fillRect(0, 0, canvas.width, canvas.height)

let array = []

for (let i = 0; i < BG_SIZE / squareSize; i++) {
    let smallArray = []
    for (let j = 0; j < BG_SIZE / squareSize; j++) {
        smallArray.push(0)
    }
    array.push(smallArray)
}

resetButton.addEventListener('click', () => {
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < BG_SIZE / squareSize; i++) {
        for (let j = 0; j < BG_SIZE / squareSize; j++) {
            array[i][j] = 0
        }
    }
})

function handleDrawing(e) {
    if (createDraw.checked === true) {
        let point = getEventLocation(canvas, e)
        point.x = Math.floor(point.x / squareSize)
        point.y = Math.floor(point.y / squareSize)
        if (array[point.y][point.x] !== 1 && array[point.y][point.x] !== 2) {
            array[point.y][point.x] = 1
            ctx.fillStyle = wallColor
            ctx.fillRect(squareSize * point.x, squareSize * point.y, squareSize, squareSize)
        }
        if (window.innerWidth < 440) {
            canvas.addEventListener('touchmove', handleDrawing)
        }
        else
            canvas.addEventListener('mousemove', handleDrawing)
    }
}
if (window.innerWidth < 440) {
    canvas.addEventListener('touchstart', handleDrawing)
    canvas.addEventListener('touchend', () => {
        canvas.removeEventListener('touchmove', handleDrawing)
    })
}
else {
    canvas.addEventListener('mousedown', handleDrawing)
    canvas.addEventListener('mouseup', () => {
        canvas.removeEventListener('mousemove', handleDrawing)
    })
}

function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function getEventLocation(element, event) {
    if (window.innerWidth < 440) {
        var pos = getElementPosition(element);
        return {
            x: (event.touches[0].pageX - pos.x),
            y: (event.touches[0].pageY - pos.y)
        };
    }
    else {
        var pos = getElementPosition(element);
        return {
            x: (event.pageX - pos.x),
            y: (event.pageY - pos.y)
        };
    }
}
function findMinTop(arr2d) {
    for (let i = 0; i < arr2d.length; i++) {
        for (let j = 0; j < arr2d[i].length; j++) {
            if (arr2d[i][j] === 1) {
                return i
            }
        }
    }
}
function findMinBottom(arr2d) {
    for (let i = 0; i < arr2d.length; i++) {
        for (let j = 0; j < arr2d[i].length; j++) {
            if (arr2d[arr2d.length - 1 - i][j] === 1) {
                return i
            }
        }
    }
}
function findMinLeft(arr2d) {
    for (let i = 0; i < arr2d.length; i++) {
        for (let j = 0; j < arr2d[i].length; j++) {
            if (arr2d[j][i] === 1) {
                return i
            }
        }
    }
}
function findMinRight(arr2d) {
    for (let i = arr2d.length - 1; i >= 0; i--) {
        for (let j = 0; j < arr2d[i].length; j++) {
            if (arr2d[j][i] === 1) {
                return 19 - i
            }
        }
    }
}
function moveArr2dLeft(arr2d) {
    for (let i = 0; i < arr2d.length; i++) {
        for (let j = 0; j < arr2d[i].length; j++) {
            if (j === arr2d[i].length - 1) {
                arr2d[i][j] = 0
            }
            else {
                arr2d[i][j] = arr2d[i][j + 1]
            }
        }
    }
}
function moveArr2dRight(arr2d) {
    for (let i = 0; i < arr2d.length; i++) {
        for (let j = arr2d[i].length - 1; j >= 0; j--) {
            if (j === 0) {
                arr2d[i][j] = 0
            }
            else {
                arr2d[i][j] = arr2d[i][j - 1]
            }
        }
    }
}
function moveArr2dUp(arr2d) {
    for (let i = 0; i < arr2d.length; i++) {
        for (let j = 0; j < arr2d[i].length; j++) {
            if (i === arr2d.length - 1) {
                arr2d[i][j] = 0
            }
            else {
                arr2d[i][j] = arr2d[i + 1][j]
            }
        }
    }
}
function moveArr2dDown(arr2d) {
    for (let i = arr2d.length - 1; i >= 0; i--) {
        for (let j = 0; j < arr2d[i].length; j++) {
            if (i === 0) {
                arr2d[i][j] = 0
            }
            else {
                arr2d[i][j] = arr2d[i - 1][j]
            }
        }
    }
}

// find list of variations
function findVariations(arr2d) {
    let variations = []
    // move arr2d to top until top=0
    while (findMinTop(arr2d) > 0) {
        moveArr2dUp(arr2d)
    }
    // move arr2d to left until left=0
    while (findMinLeft(arr2d) > 0) {
        moveArr2dLeft(arr2d)
    }
    // add arr2d to variations from up to down and left to right
    let arrInit = JSON.parse(JSON.stringify(arr2d))
    while (findMinRight(arrInit) >= 0) {
        arr2d = JSON.parse(JSON.stringify(arrInit))
        while (findMinBottom(arr2d) >= 0) {
            variations.push(JSON.parse(JSON.stringify(arr2d)))
            if (findMinBottom(arr2d) > 0)
                moveArr2dDown(arr2d)
            else {
                break;
            }
        }
        if (findMinRight(arrInit) > 0)
            moveArr2dRight(arrInit)
        else {
            break;
        }
    }
    return variations
}
// addButton.addEventListener('click', () => {
//     // propmt
//     let output = prompt("Enter the value of the drawing correctly, please huhu")
//     output = parseInt(output)
//     // console.log type of output
//     if (output === 0 || output === 1 || output === 2 || output === 3 || output === 4 || output === 5 || output === 6 || output === 7 || output === 8 || output === 9) {
//         let variationsArray = findVariations(array)
//         for (let k = 0; k < variationsArray.length; k++) {
//             array = variationsArray[k]
//             let newArray = []
//             for (let i = 0; i < array.length; i++) {
//                 for (let j = 0; j < array[i].length; j++) {
//                     newArray.push(array[i][j])
//                 }
//             }
//             if(output===0)
//             {
//                 output={"zero":1}
//             }
//             else if(output===1)
//             {
//                 output={"one":1}
//             }
//             else if(output===2)
//             {
//                 output={"two":1}
//             }
//             else if(output===3)
//             {
//                 output={"three":1}
//             }
//             else if(output===4)
//             {
//                 output={"four":1}
//             }
//             else if(output===5)
//             {
//                 output={"five":1}
//             }
//             else if(output===6)
//             {
//                 output={"six":1}
//             }
//             else if(output===7)
//             {
//                 output={"seven":1}
//             }
//             else if(output===8)
//             {
//                 output={"eight":1}
//             }
//             else if(output===9)
//             {
//                 output={"nine":1}
//             }
            
//             var formdata = new FormData();
//             formdata.append("input", JSON.stringify(newArray));
//             formdata.append("output", JSON.stringify(output));
//             var requestOptions = {
//                 method: 'POST',
//                 body: formdata,
//                 redirect: 'follow'
//             };

//             fetch("http://localhost/handwrittenRegconition/addtrainingdata.php", requestOptions)
//                 .then(response => response.text())
//                 .then(result => {
//                     console.log(result);
//                     // make text block in 5s
//                     text.style.display = "block"
//                     setTimeout(() => {
//                         text.style.display = "none"
//                     }, 2000)
//                 })
//                 .catch(error => console.log('error', error));
//         }
//     }
// })


async function getTrainingData() {
    let trainingData

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    await fetch("http://localhost/handwrittenRegconition/gettrainingdata.php", requestOptions)
        .then(response => { return response.text(); })
        .then(result => { trainingData = JSON.parse(result); })
        .catch(error => console.log('error', error));
    // // json.parse all input and output
    for (let i = 0; i < trainingData.length; i++) {
        trainingData[i].input = JSON.parse(trainingData[i].input)
        trainingData[i].output = JSON.parse(trainingData[i].output)
    }
    return trainingData


}

////////////////////////////////////////////////////////////// for brain.js
// const brain = require("brain.js");
// import brain from 'brain.js';
// import fetch from 'node-fetch'
// import fs from 'fs'
// const config = {
//     hiddenLayers: [30], // array of ints for the sizes of the hidden layers in the network
// };
// const net = new brain.NeuralNetwork(config);
// // take out from old to keep training
// let network = fs.readFileSync('network.json', 'utf8');
// net.fromJSON(JSON.parse(network));

// async function allTheWork() {
//     let trainingData = await getTrainingData()
//     // super training 10 times longer than your granfather old, best art 10657/10827
//     // for(let i = 0; i < 10; i++)
//     // {
//     //     await net.train(trainingData)
//     // }
//     // const networkState = JSON.stringify(net);
//     // add to network.json
//     fs.writeFile('network.json', networkState, function (err) {
//         if (err) throw err;
//         console.log('Saved!');
//     });
//     // add the network state to database addtrainingdata.php
//                 // var formdata = new FormData();
//                 // formdata.append("network", networkState);

//                 // var requestOptions = {
//                 //     method: 'POST',
//                 //     body: formdata,
//                 //     redirect: 'follow'
//                 // };

//                 // fetch("http://localhost/handwrittenRegconition/addnetwork.php", requestOptions)
//                 //     .then(response => response.text())
//                 //     .then(result => {console.log(result);
//                         let numberRight = 0;
//                         for(let i = 0; i < trainingData.length; i++){
//                             let output = net.run(trainingData[i].input);
//                             let keys = Object.keys(output);
//                             let values = Object.values(output);
//                             let max = Math.max(...values);
//                             let index = values.indexOf(max);
//                             let key = keys[index];
//                             if(key === Object.keys(trainingData[i].output)[0]){
//                                 numberRight++;
//                             }
//                         }
//                         console.log(`${numberRight}/${trainingData.length}`);

// //                     })
// //                     .catch(error => console.log('error', error));

// }
// allTheWork()
///////////////////////////////////////////// load and run
// import file json from network.json
const network = require('./network.json');
// console.log(network)
const brain = require("brain.js") ;
const config = {
    binaryThresh: 0.5,
    hiddenLayers: [30], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu',
    learningRate: 0.01, // global learning rate, useful when training using streams
};
let trainedNet = new brain.NeuralNetwork(config);
trainedNet.fromJSON(network);

// // load from file
// let data
// var requestOptions = {
//     method: 'GET',
//     redirect: 'follow'
// };

// fetch("http://localhost/handwrittenRegconition/getnetwork.php", requestOptions)
//     .then(response => response.text())
//     .then(result => JSON.parse(result))
//     .then(result => {
//         result = JSON.parse(result)
//         trainedNet.fromJSON(result)
//     })
//     .catch(error => console.log('error', error));

function handleCheck() {
    let newArray = []
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            newArray.push(array[i][j])
        }
    }
    let output = trainedNet.run(newArray);
    let keys = Object.keys(output);
    let values = Object.values(output);
    let max = Math.max(...values);
    let index = values.indexOf(max);
    let key = keys[index];
    let value = values[index];
    alert(`AI Minh Phat doan so la: ${key} voi xac suat la ${(value*100).toFixed(2)}%`)
}
checkButton.addEventListener("click", handleCheck)


// // ///////////////////////////////////////////////////////////////////// basic neural network coded by myself
// class Network {
//     constructor(layers = null) {
//         if (layers) {

//             this.arrA = new Array(layers.length);
//             for (let i = 0; i < this.arrA.length; i++) {
//                 this.arrA[i] = new Array(layers[i]);
//                 for (let j = 0; j < this.arrA[i].length; j++) {
//                     this.arrA[i][j] = "nope";
//                 }
//             }

//             this.arrWeights = new Array(layers.length);
//             this.arrWeights[0] = new Array(0);
//             for (let i = 1; i < this.arrWeights.length; i++) {
//                 this.arrWeights[i] = new Array(layers[i - 1]);
//                 for (let j = 0; j < this.arrWeights[i].length; j++) {
//                     this.arrWeights[i][j] = new Array(layers[i]);
//                     for (let k = 0; k < this.arrWeights[i][j].length; k++) {
//                         this.arrWeights[i][j][k] = Math.random();
//                     }
//                 }
//             }

//             this.arrBiases = new Array(layers.length);
//             this.arrBiases[0] = new Array(0);
//             for (let i = 1; i < this.arrBiases.length; i++) {
//                 this.arrBiases[i] = new Array(layers[i]);
//                 for (let j = 0; j < this.arrBiases[i].length; j++) {
//                     {
//                         this.arrBiases[i][j] = Math.random();
//                     }
//                 }
//             }

//             this.arrE = new Array(layers.length);
//             this.arrE[0] = new Array(0);
//             for (let i = 1; i < this.arrE.length; i++) {
//                 this.arrE[i] = new Array(layers[i]);
//                 for (let j = 0; j < this.arrE[i].length; j++) {
//                     this.arrE[i][j] = 0;
//                 }
//             }
//             this.arrDeltaWeights = JSON.parse(JSON.stringify(this.arrWeights))
//             this.arrDeltaBiases = JSON.parse(JSON.stringify(this.arrBiases))
//             this.arrOutputsTraining = [];
//         }
//         else {
//             this.forLoad()
//         }
//         this.mode = "";
//     }
//     changeMode(mode) {
//         this.mode = mode;
//     }
//     loadInputTraining(inputs) {
//         for (let i = 0; i < this.arrA[0].length; i++)
//             this.arrA[0][i] = inputs[i];
//     }
//     loadInputTesting(inputs) {
//         for (let i = 0; i < this.arrA[0].length; i++)
//             this.arrA[0][i] = inputs[i];
//     }
//     loadOutputTraining(outputs) {
//         this.arrOutputsTraining = outputs;
//     }
//     sigmoid(value) {
//         return 1 / (1 + Math.exp(-value));
//     }
//     sigmoid_derivative(value) {
//         return this.sigmoid(value) * (1 - this.sigmoid(value));
//     }
//     feedForward() {
//         let z = 0;
//         for (let i = 1; i < this.arrA.length; i++) {
//             for (let j = 0; j < this.arrA[i].length; j++) {
//                 z = this.findZ(i, j);
//                 this.arrA[i][j] = this.sigmoid(z);
//             }
//         }
//     }
//     costFunction() {
//         let sum = 0;
//         for (let i = 0; i < this.arrA[this.arrA.length - 1].length; i++) {
//             sum += Math.pow(this.arrOutputsTraining[i] - (this.arrA[this.arrA.length - 1][i]), 2);
//         }
//         return sum / (2 * this.arrOutputsTraining.length);
//     }
//     training(inputs, outputs, eta) {
//         if (this.mode === "training") {
//             this.loadInputTraining(inputs);
//             this.loadOutputTraining(outputs);
//             this.feedForward();
//             this.loadE();
//             this.cost_derivative_weights();
//             this.cost_derivative_biases();
//             this.backpropagation(eta);
//         }
//     }
//     findZ(layer, index) {
//         let sum = 0;
//         for (let i = 0; i < this.arrA[layer - 1].length; i++) {
//             sum += this.arrA[layer - 1][i] * this.arrWeights[layer][i][index];
//         }
//         sum += this.arrBiases[layer][index];
//         return sum;
//     }
//     loadE() {
//         let z = 0;
//         for (let i = this.arrE.length - 1; i >= 0; i--) {
//             for (let j = 0; j < this.arrE[i].length; j++) {
//                 z = this.findZ(i, j)
//                 if (i === this.arrE.length - 1) {
//                     this.arrE[i][j] = (this.arrOutputsTraining[j] - this.sigmoid(z)) * this.sigmoid_derivative(z) / this.arrOutputsTraining.length;
//                 }
//                 else {
//                     let multiply = 0;
//                     for (let k = 0; k < this.arrE[i + 1].length; k++) {
//                         multiply += this.arrE[i + 1][k] * this.arrWeights[i + 1][j][k];
//                     }
//                     this.arrE[i][j] = multiply * this.sigmoid_derivative(z);
//                 }
//             }
//         }
//     }
//     cost_derivative_weights() {
//         if (this.mode === "training") {
//             // fill out this.arrDeltaWeights
//             for (let i = this.arrDeltaWeights.length - 1; i > 0; i--) {
//                 for (let j = 0; j < this.arrDeltaWeights[i].length; j++) {
//                     for (let k = 0; k < this.arrDeltaWeights[i][j].length; k++) {
//                         this.arrDeltaWeights[i][j][k] = this.arrA[i - 1][j] * this.arrE[i][k];
//                     }
//                 }
//             }
//         }
//     }
//     cost_derivative_biases() {
//         // fill out this.arrDeltaBiases
//         for (let i = this.arrDeltaBiases.length - 1; i > 0; i--) {
//             for (let j = 0; j < this.arrDeltaBiases[i].length; j++) {
//                 this.arrDeltaBiases[i][j] = this.arrE[i][j];
//             }
//         }

//     }
//     backpropagation(eta) {
//         if (this.mode === "training") {
//             // update weights
//             for (let i = this.arrWeights.length - 1; i > 0; i--) {
//                 for (let j = 0; j < this.arrWeights[i].length; j++) {
//                     for (let k = 0; k < this.arrWeights[i][j].length; k++) {
//                         this.arrWeights[i][j][k] += (eta * this.arrDeltaWeights[i][j][k]);
//                     }
//                 }
//             }
//             // update biases
//             for (let i = this.arrBiases.length - 1; i > 0; i--) {
//                 for (let j = 0; j < this.arrBiases[i].length; j++) {
//                     this.arrBiases[i][j] += (eta * this.arrDeltaBiases[i][j]);
//                 }
//             }
//         }
//     }
//     test(inputs) {
//         if (this.mode === "testing") {
//             this.loadInputTesting(inputs);
//             this.feedForward();
//             // find maximum position
//             let max = 0;
//             let maxPos = 0;
//             for (let i = 0; i < this.arrA[this.arrA.length - 1].length; i++) {
//                 if (this.arrA[this.arrA.length - 1][i] > max) {
//                     max = this.arrA[this.arrA.length - 1][i];
//                     maxPos = 9 - i;
//                 }
//             }
//             if (maxPos === 0) {
//                 alert(` Minh Ph??t AI ??o??n l??: 0 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 1) {
//                 alert(` Minh Ph??t AI ??o??n l??: 1 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 2) {
//                 alert(` Minh Ph??t AI ??o??n l??: 2 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 3) {
//                 alert(` Minh Ph??t AI ??o??n l??: 3 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 4) {
//                 alert(` Minh Ph??t AI ??o??n l??: 4 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 5) {
//                 alert(` Minh Ph??t AI ??o??n l??: 5 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 6) {
//                 alert(` Minh Ph??t AI ??o??n l??: 6 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 7) {
//                 alert(` Minh Ph??t AI ??o??n l??: 7 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 8) {
//                 alert(` Minh Ph??t AI ??o??n l??: 8 v???i x??c su???t: ${max * 100} %`);
//             }
//             else if (maxPos === 9) {
//                 alert(` Minh Ph??t AI ??o??n l??: 9 v???i x??c su???t: ${max * 100} %`);
//             }
//         }
//     }
//     forTestPerformance(valueChecking, output) {
//         this.loadInputTesting(valueChecking);
//         this.feedForward();
//         // find maximum position
//         let max = 0;
//         let maxPos = 0;
//         for (let i = 0; i < this.arrA[this.arrA.length - 1].length; i++) {
//             if (this.arrA[this.arrA.length - 1][i] > max) {
//                 max = this.arrA[this.arrA.length - 1][i];
//                 maxPos = i;
//             }
//         }
//         if (output[maxPos] === 1) {
//             return true;
//         }
//         else {
//             return false;
//         }
//     }
//     testPerformance(testData) {
//         let correct = 0;
//         let total = testData.length
//         for (let i = 0; i < testData.length; i++) {
//             let input = testData[i]['input'];
//             let output = testData[i]['output'];
//             if (this.forTestPerformance(input, output)) {
//                 correct++;
//             }
//         }
//         console.log(`${correct}/${total}`);
//         return `${correct}/${total}`
//     }
//     SGD(training_data, epochs, mini_batch_size, eta, testData = null) {
//         if (this.mode === "training") {
//             // shuffle training data
//             for (let i = training_data.length - 1; i > 0; i--) {
//                 let j = Math.floor(Math.random() * (i + 1));
//                 [training_data[i], training_data[j]] = [training_data[j], training_data[i]];
//             }
//             // split training data into mini batches
//             let mini_batches = [];
//             for (let i = 0; i < training_data.length; i += mini_batch_size) {
//                 mini_batches.push(training_data.slice(i, i + mini_batch_size));
//             }
//             // train
//             for (let i = 0; i < epochs; i++) {
//                 for (let j = 0; j < mini_batches.length; j++) {
//                     this.updateMiniBatch(mini_batches[j], eta);
//                 }
//                 // print cost
//                 if ((i + 1) % 10 === 0) {
//                     if (testData && (i + 1) === epochs) {
//                         let result = this.testPerformance(testData);
//                         console.log("Epoch: ", i + 1, " Cost: ", this.costFunction(), result);
//                         if (result === `${testData.length}/${testData.length}`) {
//                             console.log("???? ?????t ????? ch??nh x??c 100%!");
//                             break;
//                         }
//                     }
//                     else
//                         console.log("Epoch: ", i + 1, " Cost: ", this.costFunction());

//                 }
//             }
//         }
//     }
//     updateMiniBatch(mini_batch, eta) {
//         if (this.mode === "training") {
//             // reset delta weights and biases
//             for (let i = 0; i < this.arrDeltaWeights.length; i++) {
//                 for (let j = 0; j < this.arrDeltaWeights[i].length; j++) {
//                     for (let k = 0; k < this.arrDeltaWeights[i][j].length; k++) {
//                         this.arrDeltaWeights[i][j][k] = 0;
//                     }
//                 }
//             }
//             for (let i = 0; i < this.arrDeltaBiases.length; i++) {
//                 for (let j = 0; j < this.arrDeltaBiases[i].length; j++) {
//                     this.arrDeltaBiases[i][j] = 0;
//                 }
//             }
//             // update delta weights and biases
//             for (let i = 0; i < mini_batch.length; i++) {
//                 this.loadInputTraining(mini_batch[i]['input']);
//                 this.feedForward();
//                 this.loadOutputTraining(mini_batch[i]['output']);
//                 this.loadE();
//                 for (let i = this.arrDeltaWeights.length - 1; i > 0; i--) {
//                     for (let j = 0; j < this.arrDeltaWeights[i].length; j++) {
//                         for (let k = 0; k < this.arrDeltaWeights[i][j].length; k++) {
//                             this.arrDeltaWeights[i][j][k] += this.arrA[i - 1][j] * this.arrE[i][k];
//                         }
//                     }
//                 }
//                 for (let i = this.arrDeltaBiases.length - 1; i > 0; i--) {
//                     for (let j = 0; j < this.arrDeltaBiases[i].length; j++) {
//                         this.arrDeltaBiases[i][j] += this.arrE[i][j];
//                     }
//                 }
//             }
//             // update weights and biases
//             for (let i = 0; i < this.arrWeights.length; i++) {
//                 for (let j = 0; j < this.arrWeights[i].length; j++) {
//                     for (let k = 0; k < this.arrWeights[i][j].length; k++) {
//                         this.arrWeights[i][j][k] += (eta / mini_batch.length) * this.arrDeltaWeights[i][j][k];
//                     }
//                 }
//             }
//             for (let i = 0; i < this.arrBiases.length; i++) {
//                 for (let j = 0; j < this.arrBiases[i].length; j++) {
//                     this.arrBiases[i][j] += (eta / mini_batch.length) * this.arrDeltaBiases[i][j];
//                 }
//             }
//         }
//     }
//     forSave() {
//         // save to file
//         const network = JSON.stringify({
//             arrA: this.arrA,
//             arrWeights: this.arrWeights,
//             arrBiases: this.arrBiases,
//             arrE: this.arrE,
//             arrDeltaWeights: this.arrDeltaWeights,
//             arrDeltaBiases: this.arrDeltaBiases
//         })
//         var formdata = new FormData();
//         formdata.append("network", network);

//         var requestOptions = {
//             method: 'POST',
//             body: formdata,
//             redirect: 'follow'
//         };

//         fetch("http://localhost/handwrittenRegconition/addnetwork.php", requestOptions)
//             .then(response => response.text())
//             .then(result => console.log(result))
//             .catch(error => console.log('error', error));
//     }
//     async forLoad() {
//         // load from file
//         let data
//         var requestOptions = {
//             method: 'GET',
//             redirect: 'follow'
//         };

//         await fetch("http://localhost/handwrittenRegconition/getnetwork.php", requestOptions)
//             .then(response => response.text())
//             .then(result => {
//                 data = JSON.parse(result); data = JSON.parse(data)
//                 this.arrA = data.arrA;
//                 this.arrWeights = data.arrWeights;
//                 this.arrBiases = data.arrBiases;
//                 this.arrE = data.arrE;
//                 this.arrDeltaWeights = data.arrDeltaWeights;
//                 this.arrDeltaBiases = data.arrDeltaBiases;
//             })
//             .catch(error => console.log('error', error));
//     }
//     console() {
//         console.log("A: ", this.arrA);
//         console.log("Weights: ", this.arrWeights);
//         console.log("Biases: ", this.arrBiases);
//         console.log("Cost: ", test.costFunction());
//         console.log("E: ", this.arrE);
//         console.log("DeltaWeights: ", this.arrDeltaWeights);
//         console.log("DeltaBiases: ", this.arrDeltaBiases);
//         // console.log("\n")
//     }
// }

// ////////////////////////////////////////////////////// for normal full-batch gradient descent training
// var test = new Network([1, 30, 10]);
// test.changeMode("training");
// for (let i = 0; i < 10000; i++) {
//     test.training([0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 0.9);
//     test.training([1], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0], 0.9);
//     test.training([2], [0, 0, 0, 0, 0, 0, 0, 1, 0, 0], 0.9);
//     test.training([3], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0], 0.9);
//     test.training([4], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], 0.9);
//     test.training([5], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0], 0.9);
//     test.training([6], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], 0.9);
//     test.training([7], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0], 0.9);
//     test.training([8], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0], 0.9);
//     test.training([9], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0.9);
// }
// test.console()
// ////////////////////////////////////////////////////// for SGD training
// // var trainingData = [
// //     {input: [0], output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]},
// //     {input: [1], output: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]},
// //     {input: [2], output: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]},
// //     {input: [3], output: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]},
// //     {input: [4], output: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]},
// //     {input: [5], output: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0]},
// //     {input: [6], output: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]},
// //     {input: [7], output: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]},
// //     {input: [8], output: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
// //     {input: [9], output: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
// // ]
// // var testData = [
// //     {input: [0], output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]},
// //     {input: [1], output: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]},
// //     {input: [2], output: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]},
// //     {input: [3], output: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0]},
// //     {input: [4], output: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0]},
// //     {input: [5], output: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0]},
// //     {input: [6], output: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]},
// //     {input: [7], output: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0]},
// //     {input: [8], output: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0]},
// //     {input: [9], output: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
// // ]
// // var test = new Network([1, 6, 10]);
// // test.changeMode("training");
// // test.SGD(trainingData, 10000, 5, 10, testData);

// ////////////////////////////////////////////////////// test save and load
// // var test = new Network(null);
// // test.console();

// ////////////////////////////////////////////////////// for testing
// test.changeMode("testing");
// test.test([0]);
// test.test([1]);
// test.test([2]);
// test.test([3]);
// test.test([4]);
// test.test([5]);
// test.test([6]);
// test.test([7]);
// test.test([8]);
// test.test([9]);
// test.test([10]);
// test.test([-1]);
// test.forSave();

// ////////////////////////////////////////////////////// for real digit test
// var test = new Network([400, 5, 10]);
// // async function letgo() {
// //     let trainingData = await getTrainingData();
// //     test.changeMode("training");
// //     test.SGD(trainingData, 1000, 10, 10, trainingData);
// //     test.console()
// //     test.forSave();
// // }
// // letgo()
// // async function letgoAlreadyTrain() {
// //     await test.forLoad();
// // }
// // letgoAlreadyTrain();
// function handleCheck() {
//     test.changeMode("testing");
//     let newArray = []
//     for (let i = 0; i < array.length; i++) {
//         for (let j = 0; j < array[i].length; j++) {
//             newArray.push(array[i][j])
//         }
//     }
//     test.test(newArray);
// }
// checkButton.addEventListener("click", handleCheck)