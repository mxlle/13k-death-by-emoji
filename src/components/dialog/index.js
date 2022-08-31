import { createElement } from "../../utils/html-utils";

import "./dialog.scss";

export function createDialog(innerElement, submitButtonText) {
  const dialog = createElement({
    cssClass: "dialog",
    onClick: (event) => event.stopPropagation(), // TODO - why?
  });

  dialog.appendChild(innerElement);

  const buttons = createElement({ cssClass: "buttons" });

  const afterClosed = new Promise((resolve, _reject) => {
    const cancelButton = createElement({
      tag: "button",
      cssClass: "secondary-button",
      text: "Cancel",
      onClick: () => {
        document.body.removeChild(dialog);
        resolve(false);
      },
    });
    buttons.appendChild(cancelButton);
    const submitButton = createElement({
      tag: "button",
      text: submitButtonText,
      onClick: () => {
        document.body.removeChild(dialog);
        resolve(true);
      },
    });
    buttons.appendChild(submitButton);
    dialog.appendChild(buttons);
  });

  return {
    open: () => {
      document.body.appendChild(dialog);
      return afterClosed;
    },
  };
}
