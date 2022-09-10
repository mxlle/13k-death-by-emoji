import { createElement } from "../../utils/html-utils";

import "./dialog.scss";

export function createDialog(innerElement, submitButtonText, headerText) {
  const dialog = createElement({
    cssClass: "dialog",
    onClick: (event) => event.stopPropagation(), // TODO - why?
  });

  let header;
  if (headerText) {
    header = createElement({
      tag: "h2",
      cssClass: "dialog-header",
      text: headerText,
    });
    dialog.appendChild(header);
    dialog.classList.add("has-header");
  }

  const dialogContent = createElement({ cssClass: "dialog-content" });
  dialogContent.appendChild(innerElement);
  dialog.appendChild(dialogContent);

  function closeDialog() {
    dialog.classList.remove("open");
    //setTimeout(() => document.body.removeChild(dialog), 700);
  }

  let buttons, cancelButton, submitButton;
  if (submitButtonText !== undefined) {
    buttons = createElement({ cssClass: "buttons" });

    cancelButton = createElement({
      tag: "button",
      text: "Cancel",
      onClick: closeDialog,
    });
    buttons.appendChild(cancelButton);
    submitButton = createElement({
      tag: "button",
      cssClass: "primary-btn",
      text: submitButtonText,
      onClick: closeDialog,
    });
    buttons.appendChild(submitButton);
    dialog.appendChild(buttons);
  }

  document.body.appendChild(dialog);

  return {
    open: (openImmediately) => {
      //document.body.appendChild(dialog);

      if (openImmediately) {
        dialog.classList.add("open");
      } else {
        setTimeout(() => dialog.classList.add("open"), 0);
      }

      dialogContent.classList.toggle(
        "is-overflowing",
        dialogContent.scrollHeight > dialogContent.clientHeight
      );

      dialogContent.scrollTop = 0;

      return new Promise((resolve, _reject) => {
        cancelButton?.addEventListener("click", () => resolve(false));
        submitButton?.addEventListener("click", () => resolve(true));
      });
    },
    close: () => closeDialog(),
    changeHeader: (newHeaderText) => {
      if (header) header.innerText = newHeaderText;
    },
  };
}
