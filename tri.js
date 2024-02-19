let mode = "base-3"

const CONFIGS = {
  "base-3": {
    allowedKeys: [
      8, 42, 43, 45, 47, 48, 49, 50, 61
    ],
  },
  "base-10": {
    allowedKeys: [
      8, 42, 43, 45, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 61
    ],
  }
}

const getAllowedKeys = () => CONFIGS[mode].allowedKeys

const base10Buttons = document.querySelectorAll(".base-10-button")

const radios = document.querySelectorAll("input[type=radio]")
radios.forEach((radio) => {
  radio.addEventListener("click", () => {
    mode = radio.value
    screenInput.value = ""
    updateButtons(radio.value)
  })
})

const screenInput = document.querySelector("#screen-input")
screenInput.addEventListener("keypress", (e) => { e.preventDefault() })

const updateButtons = (newMode) => {
  if (newMode === "base-10") {
    base10Buttons.forEach((button) => {
      button.removeAttribute("disabled")
    })
  } else {
    base10Buttons.forEach((button) => {
      button.setAttribute("disabled", true)
    })
  }
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
  document.addEventListener("keypress", (e) => {
    if (getAllowedKeys().includes(e.keyCode)) {
      const targetButton = document.getElementById(e.keyCode)
      targetButton.click()
      targetButton.style.backgroundColor = "hsl(66, 42%, 75%)"
      setTimeout(() => targetButton.style.backgroundColor = "#ffffff", 150)
    }
  })
}
