let interval;

function parseTimeToSeconds(input) {
    // Caso o usuário digite apenas números (ex: 90), tratamos como segundos
    if (!isNaN(input)) return parseInt(input);

    // Regex para capturar horas (h) e minutos (m ou min)
    // Ex: "1h30", "2h", "45min"
    const regex = /(?:(\d+)h)?\s*(?:(\d+)(?:m|min)?)?/;
    const matches = input.toLowerCase().match(regex);

    if (!matches) return 0;

    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;

    return (hours * 3600) + (minutes * 60);
}

function startSystem() {
    clearInterval(interval);

    const inputVal = document.getElementById('input-time').value;
    const totalTime = parseTimeToSeconds(inputVal);

    if (totalTime <= 0) {
        alert("Por favor, insira um tempo válido (ex: 1h, 30min ou 90)");
        return;
    }

    let timeLeft = totalTime;
    const bar = document.getElementById('energy-bar');
    const percentText = document.getElementById('percent-text');
    const timerDisplay = document.getElementById('timer-display');

    updateUI(100, totalTime, bar, percentText, timerDisplay);

    interval = setInterval(() => {
        timeLeft -= 0.1;

        const percentage = (timeLeft / totalTime) * 100;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            updateUI(0, 0, bar, percentText, timerDisplay);
            return;
        }

        updateUI(percentage, timeLeft, bar, percentText, timerDisplay);
    }, 100);
}

function updateUI(percent, time, bar, text, display) {
    bar.style.width = percent + "%";
    
    if (text) text.innerText = Math.max(0, Math.ceil(percent)) + "%";

    // Formatação para exibir HH:MM:SS
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);

    let displayFormat = "";
    if (hrs > 0) {
        displayFormat = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        displayFormat = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    display.innerText = displayFormat;

    // Lógica das cores
    if (percent > 60) {
        bar.style.backgroundColor = "var(--energy-high)";
    } else if (percent > 30) {
        bar.style.backgroundColor = "var(--energy-mid)";
    } else {
        bar.style.backgroundColor = "var(--energy-low)";
    }
}