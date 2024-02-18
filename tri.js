let mode = "base-3"


const CONFIGS = {
  "base-3": {
    allowedKeys: [
      42, 43, 45, 47, 48, 49, 50,
    ],
    buttons: [
      "0", "1", "2", "+", "-", "*", "/",
    ]
  },
  "base-10": {
    allowedKeys: [
      42, 43, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
    ],
    buttons: [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/",
    ]
  }
}

const getAllowedKeys = () => CONFIGS[mode].allowedKeys
const getButtons = () => CONFIGS[mode].buttons

const base10Buttons = document.querySelectorAll(".base-10-button")

const radios = document.querySelectorAll("input[type=radio]")
radios.forEach((radio) => {
  radio.addEventListener("click", () => {
    mode = radio.value
    screenInput.value = ""
    if (radio.value === "base-10") {
      base10Buttons.forEach((button) => {
        button.removeAttribute("disabled")
      })
    } else {
      base10Buttons.forEach((button) => {
        button.setAttribute("disabled", true)
      })
    }
  })
})

const screenInput = document.querySelector("#screen-input")
function checkInput(e) {
  const allowedKeys = getAllowedKeys()
  if (!allowedKeys.includes(e.keyCode)) {
    e.preventDefault()
  }
}
screenInput.addEventListener("keypress", checkInput)


const buttonsArea = document.querySelector("#buttons-area")
const updateButtons = () => {
  buttonsArea.innerHTML = ""
  getButtons().forEach((button) => {
    buttonsArea
      .appendChild(document
        .createElement("div")
        .appendChild(document
          .createTextNode(button)))
  })
}

const buttons = document.querySelectorAll(".calc-button")
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    screenInput.value += button.innerHTML
  })
})



window.onload = () => {
  document.querySelector("#screen-input")
    .onpaste = e => e.preventDefault();
}