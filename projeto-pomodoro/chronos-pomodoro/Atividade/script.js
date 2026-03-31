document.addEventListener('DOMContentLoaded', () => {
    let timeLeft = 25 * 60; 
    let timerId = null;
    let isRunning = false;

    const display = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const playIcon = document.getElementById('playIcon');

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerId);
            timerId = null;
            playIcon.className = 'fa-solid fa-play';
        } else {
            playIcon.className = 'fa-solid fa-pause';
            timerId = setInterval(() => {
                timeLeft--;
                updateDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    timerId = null;
                    isRunning = false;
                    playIcon.className = 'fa-solid fa-play';
                    alert("Ciclo Chronos Finalizado!");
                    timeLeft = 25 * 60;
                    updateDisplay();
                }
            }, 1000);
        }
        isRunning = !isRunning;
    }

    startBtn.addEventListener('click', toggleTimer);

    // Inicia a visualização
    updateDisplay();
});