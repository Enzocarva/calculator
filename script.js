class Calculator {
    constructor() {
        this.display = document.querySelector(".display");
        this.keys = document.querySelectorAll(".key");

        // Pre-build lookup maps for faster key matching
        this.numberKeyMap = this.buildKeyMap(".key.numbers");
        this.operatorKeyMap = this.buildKeyMap(".key.operators");
        this.specialKeyMap = this.buildSpecialKeyMap();
        this.operatorMap = {
            "+": "+",
            "-": "-",
            "*": "/",
            "/": "÷",
            "Enter": "=",
            "=": "="
        };

        this.reset();
        this.bindEvents();
        this.bindKeyboardEvents();
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
            key.addEventListener("click", (event) => { this.handleKeyPress(event.target); console.log(event) });
        });
    }

    buildKeyMap(selector) {
        const map = {};
        document.querySelectorAll(selector).forEach(key => {
            map[key.textContent.trim()] = key;
        });
        return map;
    }

    buildSpecialKeyMap() {
        const specialKeysArray = Array.from(document.querySelectorAll(".key.clear-negative-percent"))
        return {
            "AC": specialKeysArray.find(element => element.textContent.trim() === "AC"),
            "%": specialKeysArray.find(element => element.textContent.trim() === "%"),
            "+/-": specialKeysArray.find(element => element.textContent.trim() === "+/-"),
        };
    }

    bindKeyboardEvents() {
        document.addEventListener("keydown", (event) => {
            // Only prevent default for calculator-specific keys
            const calculatorKeys = [
                ...Object.keys(this.numberKeyMap),
                ...Object.keys(this.operatorKeyMap),
                "Backspace", "Escape", "Enter", "%", "+/-"
            ];

            if (calculatorKeys.includes(event.key) ||
                calculatorKeys.includes(event.key.toLowerCase()) ||
                calculatorKeys.includes(event.key.toUpperCase())) {
                event.preventDefault();
            }

            console.log(event);

            // Number and decimal keys
            if (this.numberKeyMap[event.key]) {
                this.handleKeyPress(this.numberKeyMap[event.key]);
                return;
            }

            // Operator keys
            if (this.operatorMap[event.key] && this.operatorKeyMap[this.operatorMap[event.key]]) {
                this.handleKeyPress(this.operatorKeyMap[this.operatorMap[event.key]]);
                return;
            }

            // Special keys
            switch (event.key) {
                case "Backspace":
                    this.handleBackspace();
                    break;
                case "Escape":
                case "Clear":
                    if (this.specialKeyMap["AC"]) {
                        this.handleKeyPress(this.specialKeyMap["AC"]);
                    }
                    break;
                case "%":
                    if (this.specialKeyMap["%"]) {
                        this.handleKeyPress(this.specialKeyMap["%"]);
                    }
                    break;
            }
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
            case keyValue === "+/-":
            case keyValue === "%":
                this.handleNegativePercentInput(keyValue);
                break;
            default:
                return alert("Something went wrong with your input.");
        }
    }

    handleNumberInput(keyValue) {
        // Handle edge cases for first number after display is reset
        if (this.shouldResetDisplay || this.display.textContent === "0") {
            this.display.textContent = keyValue === "." ? "0." : keyValue;
            this.shouldResetDisplay = false;
        } else if (this.display.childNodes[0].length < 9) {

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

    handleNegativePercentInput(keyValue) {
        if (keyValue === "+/-") {
            this.display.textContent = Number(parseFloat(this.display.textContent) * -1).toPrecision(9);
        } else {
            this.display.textContent = Number(parseFloat(this.display.textContent) / 100).toPrecision(9);
        }
    }

    handleBackspace() {
        // Remove the last character, ensure at least one digit remains
        if (this.display.childNodes[0].length > 1) {
            this.display.textContent = this.display.textContent.slice(0, -1);
        } else {
            this.display.textContent = "0";
        }
    }

    calculateResult() {
        // Only operate if there are two operands and one operator
        if (this.operator === null) return;

        this.operand2 = parseFloat(this.display.textContent);
        const result = this.operate(this.operator, this.operand1, this.operand2);

        // Limit displayed result to 9 significant digits
        this.display.textContent = result !== "Error"
            ? Number(result.toPrecision(9))
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