"use strict";
const hasOwnPropertyNarrow = (targetObject) => (key) => {
    return targetObject.hasOwnProperty(key);
};
let mode = "base-3";
let currentOperand = "";
let currentOperatorFn = null;
let currentOperatorButton = null;
let operatorJustActivated = false;
const allowedKeys = {
    "base-3": [
        8, 42, 43, 45, 47, 48, 49, 50, 61
    ],
    "base-10": [
        8, 42, 43, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 61
    ],
};
const operators = {
    "+": (operand1, operand2) => {
        if (mode === "base-3") {
            return (parseInt(operand1, 3) + parseInt(operand2, 3)).toString(3);
        }
        else {
            return String(Number(operand1) + Number(operand2));
        }
    },
    "-": (operand1, operand2) => {
        if (mode === "base-3") {
            return (parseInt(operand1, 3) - parseInt(operand2, 3)).toString(3);
        }
        else {
            return String(Number(operand1) - Number(operand2));
        }
    },
    "*": (operand1, operand2) => {
        if (mode === "base-3") {
            return (parseInt(operand1, 3) * parseInt(operand2, 3)).toString(3);
        }
        else {
            return String(Number(operand1) * Number(operand2));
        }
    },
    "/": (operand1, operand2) => {
        if (mode === "base-3") {
            return Math.floor((parseInt(operand1, 3) / parseInt(operand2, 3))).toString(3);
        }
        else {
            return String(Number(operand1) / Number(operand2));
        }
    },
};
const getAllowedKeys = () => allowedKeys[mode];
const base10Buttons = document.querySelectorAll(".base-10-button");
const radios = document.querySelectorAll("input[type=radio]");
radios.forEach((radio) => {
    radio.addEventListener("click", () => {
        mode = radio.value;
        if (screenInput) {
            if (radio.value === "base-10") {
                screenInput.value = parseInt(screenInput.value, 3).toString();
            }
            else {
                screenInput.value = parseInt(screenInput.value).toString(3);
            }
            clearOperatorState();
            updateButtons(radio.value);
        }
    });
});
const screenInput = document.querySelector("#screen-input");
screenInput === null || screenInput === void 0 ? void 0 : screenInput.addEventListener("keypress", (e) => { e.preventDefault(); });
const setScreenInput = (newValue) => {
    if (screenInput) {
        screenInput.value = newValue;
    }
};
const updateButtons = (newMode) => {
    if (newMode === "base-10") {
        base10Buttons.forEach((button) => {
            button.removeAttribute("disabled");
        });
    }
    else {
        base10Buttons.forEach((button) => {
            button.setAttribute("disabled", "true");
        });
    }
};
const buttons = document.querySelectorAll(".inputtable");
buttons.forEach((button) => {
    const handleInteraction = (e) => {
        e.preventDefault();
        if (screenInput) {
            if (currentOperatorFn && operatorJustActivated) {
                screenInput.value = button.innerHTML;
                operatorJustActivated = false;
            }
            else {
                if (screenInput.value === "0") {
                    screenInput.value = button.innerHTML;
                }
                else {
                    screenInput.value += button.innerHTML;
                }
            }
        }
    };
    button.addEventListener("click", handleInteraction);
    button.addEventListener("touchStart", handleInteraction);
});
const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach((operatorButton) => {
    operatorButton.addEventListener("click", () => {
        var _a, _b;
        (_a = currentOperatorButton === null || currentOperatorButton === void 0 ? void 0 : currentOperatorButton.removeAttribute) === null || _a === void 0 ? void 0 : _a.call(currentOperatorButton, "style");
        currentOperatorButton = operatorButton;
        currentOperatorButton.style.backgroundColor = "hsl(169, 38%, 73%)";
        currentOperand = (_b = screenInput === null || screenInput === void 0 ? void 0 : screenInput.value) !== null && _b !== void 0 ? _b : "0";
        currentOperatorFn = operators[operatorButton.innerHTML];
        operatorJustActivated = true;
    });
});
const equalsButton = document.getElementById("61");
equalsButton.addEventListener("click", () => {
    var _a;
    if (currentOperatorFn && screenInput) {
        const operand2 = screenInput.value;
        const result = currentOperatorFn(currentOperand, operand2);
        screenInput.value = result;
        currentOperand = result;
        (_a = currentOperatorButton === null || currentOperatorButton === void 0 ? void 0 : currentOperatorButton.removeAttribute) === null || _a === void 0 ? void 0 : _a.call(currentOperatorButton, "style");
    }
});
const clearOperatorState = () => {
    var _a;
    (_a = currentOperatorButton === null || currentOperatorButton === void 0 ? void 0 : currentOperatorButton.removeAttribute) === null || _a === void 0 ? void 0 : _a.call(currentOperatorButton, "style");
    currentOperand = "";
    currentOperatorFn = null;
    currentOperatorButton = null;
    operatorJustActivated = false;
};
const clearButton = document.getElementById("c-button");
clearButton.addEventListener("click", () => {
    clearOperatorState();
});
const clearAllButton = document.getElementById("ac-button");
clearAllButton.addEventListener("click", () => {
    clearOperatorState();
    if (screenInput) {
        screenInput.value = "0";
    }
});
const acButtonKeys = {
    KeyA: false,
    KeyC: false,
};
const simulateClick = (element, removeBackground = true) => {
    element.click();
    element.style.backgroundColor = "hsl(169, 38%, 73%)";
    if (removeBackground) {
        setTimeout(() => element.removeAttribute("style"), 150);
    }
};
const isPropertyOfAcButtonKeys = hasOwnPropertyNarrow(acButtonKeys);
window.onload = () => {
    document.querySelector("#screen-input")
        .onpaste = e => e.preventDefault();
    document.addEventListener("keypress", (e) => {
        if (getAllowedKeys().includes(e.keyCode)) {
            const targetButton = document.getElementById(String(e.keyCode));
            simulateClick(targetButton, !targetButton.classList.contains("operator"));
        }
    });
    document.addEventListener("keydown", (e) => {
        var _a;
        if (e.code === "Backspace") {
            if (((_a = screenInput === null || screenInput === void 0 ? void 0 : screenInput.value) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                setScreenInput("0");
            }
            else {
                const newValue = screenInput ? screenInput.value.substring(0, screenInput.value.length - 1) : "0";
                setScreenInput(newValue);
            }
        }
        else if (e.code === "Enter") {
            e.preventDefault();
            equalsButton.click();
        }
        else if (isPropertyOfAcButtonKeys(e.code)) {
            acButtonKeys[e.code] = true;
            if (acButtonKeys.KeyA && acButtonKeys.KeyC) {
                simulateClick(clearAllButton);
            }
            else if (acButtonKeys.KeyC) {
                simulateClick(clearButton);
            }
        }
    });
    document.addEventListener("keyup", (e) => {
        if (isPropertyOfAcButtonKeys(e.code)) {
            acButtonKeys[e.code] = false;
        }
    });
};
