import { createButton, createElement } from "../../utils/html-utils";

import "./number-input.scss";

export function createNumberInputComponent({
  value,
  min,
  max,
  onChange,
  onBlur,
}) {
  const numberInputContainer = createElement({
    cssClass: "number-input-container",
  });
  const numberInput = createElement({ tag: "input", cssClass: "rbc" });
  numberInput.type = "number";
  numberInput.value = value;
  min && (numberInput.min = min);
  max && (numberInput.max = max);
  onChange && numberInput.addEventListener("change", onChange);
  onBlur && numberInput.addEventListener("blur", onBlur);

  const decreaseButton = createButton({
    iconBtn: true,
    text: "▽️",
    rbc: true,
  });
  const increaseButton = createButton({
    iconBtn: true,
    text: "△️",
    rbc: true,
  });

  function checkDisabledStates() {
    decreaseButton.disabled = min && numberInput.value <= min;
    increaseButton.disabled = max && numberInput.value >= max;
  }

  checkDisabledStates();

  decreaseButton.addEventListener("click", () => {
    if (!min || numberInput.value > min) {
      numberInput.value--;
      onChange && onChange();
    }
    checkDisabledStates();
  });

  increaseButton.addEventListener("click", () => {
    if (!max || numberInput.value < max) {
      numberInput.value++;
      onChange && onChange();
    }
    checkDisabledStates();
  });

  numberInputContainer.appendChild(decreaseButton);
  numberInputContainer.appendChild(numberInput);
  numberInputContainer.appendChild(increaseButton);

  return {
    container: numberInputContainer,
    input: numberInput,
    validate: () => validateInput(numberInput, checkDisabledStates),
  };
}

function validateInput(numberInput, checkDisabledStates) {
  const value = Number(numberInput.value);
  const min = Number(numberInput.min);
  const max = Number(numberInput.max);

  if (min && value < min) {
    numberInput.value = min;
  }

  if (max && value > max) {
    numberInput.value = max;
  }

  checkDisabledStates();
}
