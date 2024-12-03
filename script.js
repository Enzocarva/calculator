class Calculator {
    constructor() {
        this.display = document.querySelector(".display");
        this.keys = document.querySelectorAll(".key");
        this.reset();
        this.bindEvents();
    }

    reset() {
        this.operator = null;
        this.operand1 = 0;
        this.operand2 = null;
        this.shouldResetDisplay = false;
        this.display.textContent = "0";
    }

    bindEvents() {
        this.keys.forEach(key => {
            key.addEventListener("click", (event) => this.handleKeyPress(event.target));
        });
    }

    handleKeyPress(key) {
        const keyValue = key.textContent;
        const keyClass = key.classList[1];

        switch (true) {
            case keyValue === "AC":
                this.reset();
                break;
            case keyClass === "numbers":
                this.handleNumberInput(keyValue);
                break;
            case keyClass === "operators":
                this.handleOperatorInput(keyValue);
                break;
            case keyClass === "equals":
                this.calculateResult();
                break;
        }
    }

    handleNumberInput(keyValue) {
        // Handle edge cases for first number after display is reset
        if (this.shouldResetDisplay || this.display.textContent === "0") {
            this.display.textContent = keyValue === "." ? "0." : keyValue;
            this.shouldResetDisplay = false;
        } else if (this.display.childNodes[0].length < 10) {

            // Prevent multiple decimals
            if (keyValue === "." && this.display.textContent.includes(".")) return;

            this.display.textContent += keyValue;
        }
    }

    handleOperatorInput(keyValue) {
        // "Chain" calculations when user just presses another operator instead of equals sign
        if (this.operator !== null) this.calculateResult();

        // Set up new operation
        this.operator = keyValue;
        this.operand1 = parseFloat(this.display.textContent);
        this.shouldResetDisplay = true;
    }

    calculateResult() {
        // Only operate if there are two operands and one operator
        if (this.operator === null) return;

        this.operand2 = parseFloat(this.display.textContent);
        const result = this.operate(this.operator, this.operand1, this.operand2);

        // Limit displayed result to 10 significant digits
        this.display.textContent = result !== "Error"
            ? Number(result.toPrecision(10))
            : result;

        this.operator = null;
    }

    // Arithmatic operations
    add(x, y) { return x + y; }
    subtract(x, y) { return x - y; }
    multiply(x, y) { return x * y; }
    divide(x, y) { return y === 0 ? "Error" : x / y; }

    operate(operator, x, y) {
        switch (operator) {
            case "+":
                return this.add(x, y);
            case "-":
                return this.subtract(x, y);
            case "*":
            case "x":
                return this.multiply(x, y);
            case "/":
            case "÷":
                return this.divide(x, y);
            default:
                return null;
        }
    }
}

// Initialize the calculator
document.addEventListener("DOMContentLoaded", () => new Calculator());

// const keys = document.querySelectorAll(".key");
// const display = document.querySelector(".display");
// let operator = null
// let operand1 = 0;
// let operand2 = null;
// let newNumber = false;

// // Arithmatic functions
// function add(x, y) { return x + y; }

// function subtract(x, y) { return x - y; }

// function multiply(x, y) { return x * y; }

// function divide(x, y) { y === 0 ? "Error" : x / y; }

// // Calculate and return the result of the two operands with the operator
// function operate(operator, x, y) {
//     switch (operator) {
//         case "+":
//             return add(x, y);
//         case "-":
//             return subtract(x, y);
//         case "*":
//         case "x":
//             return multiply(x, y);
//         case "/":
//         case "÷":
//             return divide(x, y);
//         default:
//             return null;
//     }
// }

// // Show the clicked keys and results in the display
// function populateDisplay(keyPressed) {
//     const keyValue = keyPressed.textContent;
//     const keyClass = keyPressed.classList[1];
//     let displayLength = display.childNodes[0].length;

//     console.log(`displayValue = ${display.textContent} keyValue = ${keyValue} keyClass = ${keyClass} operator = ${operator} operand1 = ${operand1} operand2 = ${operand2}`);

//     // Clear the screen with AC button
//     if (keyValue === "AC") {
//         console.log("case AC");
//         display.textContent = 0;
//         operator = null;
//         operand1 = 0;
//         operand2 = null
//     }

//     // Edge case for first number pressed when display is clear
//     else if (display.textContent === "0" && keyClass === "numbers") {
//         console.log("case 0 && keyClass numbers");
//         display.textContent = keyValue;
//     }

//     // Max amount of numbers on display is 10
//     else if ((displayLength < 10 || newNumber) && (keyClass === "numbers")) {
//         console.log("case length < 10 && keyClass numbers");
//         if (newNumber) {
//             display.textContent = keyValue;
//             newNumber = false;
//         } else {
//             display.textContent += keyValue;
//         }
//     }

//     else if (keyClass === "operators") {
//         console.log("case operators");
//         if (operator !== null) {
//             evaluateEqualsKey();
//         }
//         operator = keyValue;
//         operand1 = parseFloat(display.textContent);
//         newNumber = true;
//         console.log(`Inside operators: operator = ${operator} operand1 = ${operand1} operand2 = ${operand2}`);
//     }

//     else if (keyClass === "equals") {
//         evaluateEqualsKey();
//     }
// }

// // Evaluate the current expression when equals key is pressed
// function evaluateEqualsKey() {
//     operand2 = parseFloat(display.textContent);
//     let result = operate(operator, operand1, operand2);
//     if (result !== "Error") {
//         result = Number(result.toPrecision(10));
//     }
//     display.textContent = result;
//     operator = null;
//     console.log(`operand2 = ${operand2} result = ${result}`);
// }

// // Add event listeners and functionality to the keys
// keys.forEach((key) => {
//     // const keyValue = key.textContent;
//     key.addEventListener("click", (event) => {
//         populateDisplay(event.target);
//     });
// });