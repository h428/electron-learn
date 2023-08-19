const counter = document.getElementById("counter");

window.electronAPI.onUpdateCounter((_event, value) => {
  const oldValue = Number(counter.innerText);
  let newValue = oldValue + value;
  if (newValue < 0) {
    newValue = 0;
  }
  counter.innerText = newValue;
});
