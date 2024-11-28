const keys = document.querySelectorAll(".key");
const display = document.querySelector(".display");
let operator = null
let operand1 = 0;
let operand2 = null;
let newNumber = false;

// Arithmatic functions
function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

function multiply(x, y) {
    return x * y;
}

function divide(x, y) {
    if (y === 0) return "Error";
    return x / y;
}

// Calculate and return the result of the two operands with the operator
function operate(operator, operand1, operand2) {
    switch (operator) {
        case "+":
            return add(operand1, operand2);
        case "-":
            return subtract(operand1, operand2);
        case "*":
        case "x":
            return multiply(operand1, operand2);
        case "/":
        case "÷":
            return divide(operand1, operand2);
        default:
            return null;
    }
}

// Show the clicked keys and results in the display
function populateDisplay(keyPressed) {
    const keyValue = keyPressed.textContent;
    const keyClass = keyPressed.classList[1];
    let displayLength = display.childNodes[0].length;

    console.log(`displayValue = ${display.textContent} keyValue = ${keyValue} keyClass = ${keyClass} operator = ${operator} operand1 = ${operand1} operand2 = ${operand2}`);

    // Clear the screen with AC button
    if (keyValue === "AC") {
        console.log("case AC");
        display.textContent = 0;
        operator = null;
        operand1 = 0;
        operand2 = null
    }

    // Edge case for first number pressed when display is clear
    else if (display.textContent === "0" && keyClass === "numbers") {
        console.log("case 0 && keyClass numbers");
        display.textContent = keyValue;
    }

    // Max amount of numbers on display is 10
    else if ((displayLength < 10 || newNumber) && (keyClass === "numbers")) {
        console.log("case length < 10 && keyClass numbers");
        if (newNumber) {
            display.textContent = keyValue;
            newNumber = false;
        } else {
            display.textContent += keyValue;
        }
    }

    else if (keyClass === "operators") {
        console.log("case operators");
        operator = keyValue;
        operand1 = parseInt(display.textContent);
        // operand2 = operand1;
        newNumber = true;
        console.log(`Inside operators: operator = ${operator} operand1 = ${operand1} operand2 = ${operand2}`);
    }

    else if (keyClass === "equals") {
        console.log("case equals");
        operand2 = parseInt(display.textContent);
        let result = operate(operator, operand1, operand2);
        result = Number(result.toPrecision(10));
        display.textContent = result;
        operator = null;
        console.log(`operand2 = ${operand2} result = ${result}`);
    }

}

// Add event listeners and functionality to the keys
keys.forEach((key) => {
    // const keyValue = key.textContent;
    key.addEventListener("click", (event) => {
        populateDisplay(event.target);
    });
});