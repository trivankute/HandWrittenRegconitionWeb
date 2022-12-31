// fs
const fs = require('fs');
class Network {
    constructor(layers=null) {
        if(layers)
        {

            this.arrA = new Array(layers.length);
            for (let i = 0; i < this.arrA.length; i++) {
                this.arrA[i] = new Array(layers[i]);
                for (let j = 0; j < this.arrA[i].length; j++) {
                    this.arrA[i][j] = "nope";
                }
            }
    
            this.arrWeights = new Array(layers.length);
            this.arrWeights[0] = new Array(0);
            for (let i = 1; i < this.arrWeights.length; i++) {
                this.arrWeights[i] = new Array(layers[i - 1]);
                for (let j = 0; j < this.arrWeights[i].length; j++) {
                    this.arrWeights[i][j] = new Array(layers[i]);
                    for (let k = 0; k < this.arrWeights[i][j].length; k++) {
                        this.arrWeights[i][j][k] = Math.random();
                    }
                }
            }
    
            this.arrBiases = new Array(layers.length);
            this.arrBiases[0] = new Array(0);
            for (let i = 1; i < this.arrBiases.length; i++) {
                this.arrBiases[i] = new Array(layers[i - 1]);
                for (let j = 0; j < this.arrBiases[i].length; j++) {
                    this.arrBiases[i][j] = new Array(layers[i]);
                    for (let k = 0; k < this.arrBiases[i][j].length; k++) {
                        this.arrBiases[i][j][k] = Math.random();
                    }
                }
            }
    
            this.arrE = new Array(layers.length);
            this.arrE[0] = new Array(0);
            for (let i = 1; i < this.arrE.length; i++) {
                this.arrE[i] = new Array(layers[i]);
                for (let j = 0; j < this.arrE[i].length; j++) {
                    this.arrE[i][j] = 0;
                }
            }
            this.arrDeltaWeights = JSON.parse(JSON.stringify(this.arrWeights))
            this.arrDeltaBiases = JSON.parse(JSON.stringify(this.arrBiases))
            this.arrOutputsTraining = [];
        }
        else
        {
            this.forLoad()
        }
        this.mode = "";
    }
    changeMode(mode) {
        this.mode = mode;
    }
    loadInputTraining(inputs) {
        for (let i = 0; i < this.arrA[0].length; i++)
            this.arrA[0][i] = inputs[i];
    }
    loadInputTesting(inputs) {
        for (let i = 0; i < this.arrA[0].length; i++)
            this.arrA[0][i] = inputs[i];
    }
    loadOutputTraining(outputs) {
        this.arrOutputsTraining = outputs;
    }
    sigmoid(value) {
        return 1 / (1 + Math.exp(-value));
    }
    sigmoid_derivative(value) {
        return this.sigmoid(value) * (1 - this.sigmoid(value));
    }
    feedForward() {
        let z = 0;
        for (let i = 1; i < this.arrA.length; i++) {
            for (let j = 0; j < this.arrA[i].length; j++) {
                z = this.findZ(i, j);
                this.arrA[i][j] = this.sigmoid(z);
            }
        }
    }
    costFunction() {
        let sum = 0;
        for (let i = 0; i < this.arrA[this.arrA.length - 1].length; i++) {
            sum += Math.pow(this.arrOutputsTraining[i] - this.sigmoid(this.arrA[this.arrA.length - 1][i]), 2);
        }
        return sum / (2 * this.arrOutputsTraining.length);
    }
    training(inputs, outputs, eta) {
        if (this.mode === "training") {
            this.loadInputTraining(inputs);
            this.loadOutputTraining(outputs);
            this.feedForward();
            this.loadE();
            this.cost_derivative_weights();
            this.cost_derivative_biases();
            this.backpropagation(eta);
        }
    }
    findZ(layer, index) {
        let sum = 0;
        for (let i = 0; i < this.arrA[layer - 1].length; i++) {
            sum += this.arrA[layer - 1][i] * this.arrWeights[layer][i][index] + this.arrBiases[layer][i][index];
        }
        return sum;
    }
    loadE() {
        let z = 0;
        for (let i = this.arrE.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.arrE[i].length; j++) {
                z = this.findZ(i, j)
                if (i === this.arrE.length - 1) {
                    this.arrE[i][j] = (this.arrOutputsTraining[j] - this.sigmoid(z)) * this.sigmoid_derivative(z) / this.arrOutputsTraining.length;
                }
                else {
                    let multiply = 0;
                    for (let k = 0; k < this.arrE[i + 1].length; k++) {
                        multiply += this.arrE[i + 1][k] * this.arrWeights[i + 1][j][k];
                    }
                    this.arrE[i][j] = multiply * this.sigmoid_derivative(z);
                }
            }
        }
    }
    cost_derivative_weights() {
        if (this.mode === "training") {
            // fill out this.arrDeltaWeights
            for (let i = this.arrDeltaWeights.length - 1; i > 0; i--) {
                for (let j = 0; j < this.arrDeltaWeights[i].length; j++) {
                    for (let k = 0; k < this.arrDeltaWeights[i][j].length; k++) {
                        this.arrDeltaWeights[i][j][k] = this.arrA[i - 1][j] * this.arrE[i][k];
                    }
                }
            }
        }
    }
    cost_derivative_biases() {
        // fill out this.arrDeltaBiases
        for (let i = this.arrDeltaBiases.length - 1; i > 0; i--) {
            for (let j = 0; j < this.arrDeltaBiases[i].length; j++) {
                for (let k = 0; k < this.arrDeltaBiases[i][j].length; k++) {
                    this.arrDeltaBiases[i][j][k] = this.arrE[i][k];
                }
            }
        }

    }
    backpropagation(eta) {
        if (this.mode === "training") {
            // update weights
            for (let i = this.arrWeights.length - 1; i > 0; i--) {
                for (let j = 0; j < this.arrWeights[i].length; j++) {
                    for (let k = 0; k < this.arrWeights[i][j].length; k++) {
                        this.arrWeights[i][j][k] += (eta * this.arrDeltaWeights[i][j][k]);
                    }
                }
            }
            // update biases
            for (let i = this.arrBiases.length - 1; i > 0; i--) {
                for (let j = 0; j < this.arrBiases[i].length; j++) {
                    for (let k = 0; k < this.arrBiases[i][j].length; k++) {
                        this.arrBiases[i][j][k] += (eta * this.arrDeltaBiases[i][j][k]);
                    }
                }
            }
        }
    }
    test(inputs) {
        if (this.mode === "testing") {
            this.loadInputTesting(inputs);
            this.feedForward();
            // find maximum position
            let max = 0;
            let maxPos = 0;
            for (let i = 0; i < this.arrA[this.arrA.length - 1].length; i++) {
                if (this.arrA[this.arrA.length - 1][i] > max) {
                    max = this.arrA[this.arrA.length - 1][i];
                    maxPos = 9-i;
                }
            }
            if(maxPos === 0) {
                console.log("Minh Phát AI đoán là: 0 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 1) {
                console.log("Minh Phát AI đoán là: 1 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 2) {
                console.log("Minh Phát AI đoán là: 2 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 3) {
                console.log("Minh Phát AI đoán là: 3 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 4) {
                console.log("Minh Phát AI đoán là: 4 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 5) {
                console.log("Minh Phát AI đoán là: 5 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 6) {
                console.log("Minh Phát AI đoán là: 6 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 7) {
                console.log("Minh Phát AI đoán là: 7 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 8) {
                console.log("Minh Phát AI đoán là: 8 với xác suất: ", max*100, "%");
            }
            else if(maxPos === 9) {
                console.log("Minh Phát AI đoán là: 9 với xác suất: ", max*100, "%");
            }
        }
    }
    forSave() {
        // save to file
        fs.writeFileSync("data.json", JSON.stringify({
            arrA: this.arrA,
            arrWeights: this.arrWeights,
            arrBiases: this.arrBiases,
            arrE: this.arrE,
            arrDeltaWeights: this.arrDeltaWeights,
            arrDeltaBiases: this.arrDeltaBiases
        }));
    }
    forLoad() {
        // load from file
        let data = JSON.parse(fs.readFileSync("data.json"));
        this.arrA = data.arrA;
        this.arrWeights = data.arrWeights;
        this.arrBiases = data.arrBiases;
        this.arrE = data.arrE;
        this.arrDeltaWeights = data.arrDeltaWeights;
        this.arrDeltaBiases = data.arrDeltaBiases;
    }
    console() {
        console.log("A: ", this.arrA);
        console.log("Weights: ", this.arrWeights);
        console.log("Biases: ", this.arrBiases);
        // console.log("Cost: ", test.costFunction());
        console.log("E: ", this.arrE);
        console.log("DeltaWeights: ", this.arrDeltaWeights);
        console.log("DeltaBiases: ", this.arrDeltaBiases);
        console.log("\n")
    }
}

////////////////////////////////////////////////////// for training
// var test = new Network([1, 6, 10]);
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
////////////////////////////////////////////////////// test save and load
var test = new Network(null);
test.console();

////////////////////////////////////////////////////// for testing
test.changeMode("testing");
test.test([0]);
test.test([1]);
test.test([2]);
test.test([3]);
test.test([4]);
test.test([5]);
test.test([6]);
test.test([7]);
test.test([8]);
test.test([9]);
// test.forSave();