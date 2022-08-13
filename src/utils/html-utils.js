export function addCanvasToBody() {
  const canvas = createElement({ tag: "canvas" });
  document.body.appendChild(canvas);
  return canvas;
}

export function createElement({ tag, cssClass, text, onClick }) {
  const elem = document.createElement(tag || "div");
  if (cssClass) elem.classList.add(...cssClass.split(" "));
  if (text) {
    const textNode = document.createTextNode(text);
    elem.appendChild(textNode);
  }
  if (onClick) {
    elem.addEventListener("click", onClick);
  }
  return elem;
}

export function addBodyClasses(...classes) {
  document.body.classList.add(...classes);
}

export function removeBodyClasses(...classes) {
  document.body.classList.remove(...classes);
}

export function setBodyStyleProperty(prop, value) {
  document.body.style.setProperty(prop, value);
}

export function setElementToWindowSize(element) {
  element.width = window.innerWidth;
  element.height = window.innerHeight;
}

export function getWidthHeightScale(baseResolution) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const resolution = width * height;
  // adapt object size based on screen size
  const scale = Math.sqrt(resolution) / Math.sqrt(baseResolution);
  return { width, height, scale };
}
