type OperatorFn = (operand1: string, operand2: string) => string
type Mode = "base-3" | "base-10"
interface ModeRadio extends HTMLInputElement {
  value: Mode
}
const hasOwnPropertyNarrow = <T extends object>(targetObject: T) => (key: any): key is keyof typeof targetObject => {
  return targetObject.hasOwnProperty(key)
}

let mode: Mode = "base-3"
let currentOperand = ""
let currentOperatorFn: OperatorFn | null = null
let currentOperatorButton: HTMLButtonElement | null = null
let operatorJustActivated = false

const allowedKeys = {
  "base-3": [
    8, 42, 43, 45, 47, 48, 49, 50, 61
  ],
  "base-10": [
    8, 42, 43, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 61
  ],
}

const operators: { [op: string]: OperatorFn } = {
  "+": (operand1, operand2) => {
    if (mode === "base-3") {
      return (parseInt(operand1, 3) + parseInt(operand2, 3)).toString(3)
    } else {
      return String(Number(operand1) + Number(operand2))
    }
  },
  "-": (operand1, operand2) => {
    if (mode === "base-3") {
      return (parseInt(operand1, 3) - parseInt(operand2, 3)).toString(3)
    } else {
      return String(Number(operand1) - Number(operand2))
    }
  },
  "*": (operand1, operand2) => {
    if (mode === "base-3") {
      return (parseInt(operand1, 3) * parseInt(operand2, 3)).toString(3)
    } else {
      return String(Number(operand1) * Number(operand2))
    }
  },
  "/": (operand1, operand2) => {
    if (mode === "base-3") {
      return Math.floor((parseInt(operand1, 3) / parseInt(operand2, 3))).toString(3)
    } else {
      return String(Number(operand1) / Number(operand2))
    }
  },
}

const getAllowedKeys = () => allowedKeys[mode]

const base10Buttons = document.querySelectorAll<HTMLButtonElement>(".base-10-button")

const radios = document.querySelectorAll<ModeRadio>("input[type=radio]")
radios.forEach((radio) => {
  radio.addEventListener("click", () => {
    mode = radio.value
    if (screenInput) {
      if (radio.value === "base-10") {
        screenInput.value = parseInt(screenInput.value, 3).toString()
      } else {
        screenInput.value = parseInt(screenInput.value).toString(3)
      }
      clearOperatorState()
      updateButtons(radio.value)
    }

  })
})

const screenInput = document.querySelector<HTMLInputElement>("#screen-input")
screenInput?.addEventListener("keypress", (e) => { e.preventDefault() })
const setScreenInput = (newValue: string) => {
  if (screenInput) {
    screenInput.value = newValue
  }
}

const updateButtons = (newMode: Mode) => {
  if (newMode === "base-10") {
    base10Buttons.forEach((button) => {
      button.removeAttribute("disabled")
    })
  } else {
    base10Buttons.forEach((button) => {
      button.setAttribute("disabled", "true")
    })
  }
}

const buttons = document.querySelectorAll<HTMLButtonElement>(".inputtable")
buttons.forEach((button) => {
  const handleInteraction = (e: Event) => {
    e.preventDefault()
    if (screenInput) {
      if (currentOperatorFn && operatorJustActivated) {
        screenInput.value = button.innerHTML
        operatorJustActivated = false
      } else {
        if (screenInput.value === "0") {
          screenInput.value = button.innerHTML
        } else {
          screenInput.value += button.innerHTML
        }
      }
    }
  }
  button.addEventListener("click", handleInteraction)
  button.addEventListener("touchStart", handleInteraction)
})

const operatorButtons = document.querySelectorAll<HTMLButtonElement>(".operator")
operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", () => {
    currentOperatorButton?.removeAttribute?.("style")
    currentOperatorButton = operatorButton
    currentOperatorButton.style.backgroundColor = "hsl(169, 38%, 73%)"
    currentOperand = screenInput?.value ?? "0"
    currentOperatorFn = operators[operatorButton.innerHTML]
    operatorJustActivated = true
  })
})

const equalsButton = document.getElementById("61") as HTMLButtonElement
equalsButton.addEventListener("click", () => {
  if (currentOperatorFn && screenInput) {
    const operand2 = screenInput.value
    const result = currentOperatorFn(currentOperand, operand2)
    screenInput.value = result
    currentOperand = result
    currentOperatorButton?.removeAttribute?.("style")
  }
})

const clearOperatorState = () => {
  currentOperatorButton?.removeAttribute?.("style")
  currentOperand = ""
  currentOperatorFn = null
  currentOperatorButton = null
  operatorJustActivated = false
}

const clearButton = document.getElementById("c-button") as HTMLButtonElement
clearButton.addEventListener("click", () => {
  clearOperatorState()
})

const clearAllButton = document.getElementById("ac-button") as HTMLButtonElement
clearAllButton.addEventListener("click", () => {
  clearOperatorState()
  if (screenInput) {
    screenInput.value = "0"
  }
})

const acButtonKeys = {
  KeyA: false,
  KeyC: false,
}
const isPropertyOfAcButtonKeys = hasOwnPropertyNarrow(acButtonKeys)

const simulateClick = (element: HTMLButtonElement, removeBackground = true) => {
  element.click()
  element.style.backgroundColor = "hsl(169, 38%, 73%)"
  if (removeBackground) {
    setTimeout(() => element.removeAttribute("style"), 150)
  }
}

window.onload = () => {
  document!.querySelector<HTMLInputElement>("#screen-input")!
    .onpaste = e => e.preventDefault();
  document.addEventListener("keypress", (e) => {
    if (getAllowedKeys().includes(e.keyCode)) {
      const targetButton = document.getElementById(String(e.keyCode)) as HTMLButtonElement
      simulateClick(targetButton, !targetButton.classList.contains("operator"))
    }
  })
  document.addEventListener("keydown", (e) => {
    if (e.code === "Backspace") {
      if (screenInput?.value?.length === 1) {
        setScreenInput("0")
      } else {
        const newValue = screenInput ? screenInput.value.substring(0, screenInput.value.length - 1) : "0"
        setScreenInput(newValue)
      }
    } else if (e.code === "Enter") {
      e.preventDefault()
      equalsButton.click()
    } else if (isPropertyOfAcButtonKeys(e.code)) {
      acButtonKeys[e.code] = true
      if (acButtonKeys.KeyA && acButtonKeys.KeyC) {
        simulateClick(clearAllButton)
      } else if (acButtonKeys.KeyC) {
        simulateClick(clearButton)
      }
    }
  })
  document.addEventListener("keyup", (e) => {
    if (isPropertyOfAcButtonKeys(e.code)) {
      acButtonKeys[e.code] = false
    }
  })
}
