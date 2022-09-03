import { createElement } from "../../utils/html-utils";

import "./number-input.scss";

export function createNumberInputComponent({ min, max, onChange, onBlur }) {
  const numberInputContainer = createElement({
    cssClass: "number-input-container",
  });
  const numberInput = createElement({ tag: "input" });
  numberInput.type = "number";
  min && (numberInput.min = min);
  max && (numberInput.max = max);
  onChange && numberInput.addEventListener("change", onChange);
  onBlur && numberInput.addEventListener("blur", onBlur);

  const decreaseButton = createElement({
    tag: "button",
    cssClass: "icon-button",
    text: "⬇️",
    onClick: () => {
      if (!min || numberInput.value > min) {
        numberInput.value--;
      }
    },
  });
  const increaseButton = createElement({
    tag: "button",
    cssClass: "icon-button",
    text: "⬆️",
    onClick: () => {
      if (!max || numberInput.value < max) {
        numberInput.value++;
      }
    },
  });

  numberInputContainer.appendChild(decreaseButton);
  numberInputContainer.appendChild(numberInput);
  numberInputContainer.appendChild(increaseButton);

  return {
    container: numberInputContainer,
    input: numberInput,
    validate: () => validateInput(numberInput),
  };
}

function validateInput(numberInput) {
  const goal = numberInput.value;
  const min = numberInput.min;
  const max = numberInput.max;

  if (min && goal < min) {
    numberInput.value = min;
  }

  if (max && goal > max) {
    numberInput.value = max;
  }
}
