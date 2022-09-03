import { createElement } from "../../utils/html-utils";

import "./dialog.scss";

export function createDialog(innerElement, submitButtonText, headerText) {
  const dialog = createElement({
    cssClass: "dialog",
    onClick: (event) => event.stopPropagation(), // TODO - why?
  });

  if (headerText) {
    const header = createElement({
      tag: "h2",
      cssClass: "dialog-header",
      text: headerText,
    });
    dialog.appendChild(header);
    dialog.classList.add("has-header");
  }

  dialog.appendChild(innerElement);

  const buttons = createElement({ cssClass: "buttons" });

  const cancelButton = createElement({
    tag: "button",
    cssClass: "secondary-button",
    text: "Cancel",
    onClick: () => {
      document.body.removeChild(dialog);
    },
  });
  buttons.appendChild(cancelButton);
  const submitButton = createElement({
    tag: "button",
    text: submitButtonText,
    onClick: () => {
      document.body.removeChild(dialog);
    },
  });
  buttons.appendChild(submitButton);
  dialog.appendChild(buttons);

  return {
    open: () => {
      document.body.appendChild(dialog);
      return new Promise((resolve, _reject) => {
        cancelButton.addEventListener("click", () => resolve(false));
        submitButton.addEventListener("click", () => resolve(true));
      });
    },
  };
}
