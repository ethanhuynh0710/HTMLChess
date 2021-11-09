

function mouseCoord(event) {
  document.body.textContent =
    "clientX: " + event.clientX +
    " - clientY: " + event.clientY;

    return [event.clientX,event.clientY];
}

document.addEventListener("click", mouseCoord);