let isRunning = false;

self.onmessage = function (event) {
  if (isRunning) return;

  isRunning = true;

  const state = event.data;
  const { activeTask, secondsRemaining } = state;

  const endDate = activeTask.startDate + secondsRemaining * 1000;
  const now = Date.now();
  let countDownSeconds = Math.ceil((endDate - now) / 1000);

  function tick() {
    self.postMessage(countDownSeconds);

    const nowInner = Date.now();
    countDownSeconds = Math.floor((endDate - nowInner) / 1000);

    if (countDownSeconds <= 0) {
      self.postMessage(0);
      return;
    }

    setTimeout(tick, 1000);
  }

  tick();
};
