
        let audioContext = null;
        let oscillatorNodes = [];
        let gainNode = null;

        function initAudioContext() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                gainNode = audioContext.createGain();
                gainNode.connect(audioContext.destination);
            }
        }

        function stopSound() {
            oscillatorNodes.forEach(oscillator => {
                oscillator.stop();
                oscillator.disconnect();
            });
            oscillatorNodes = [];
        }

        function playChord(chord, partial) {
            stopSound();
            initAudioContext();

            const gainSlider = document.getElementById('gain-slider');
            gainNode.gain.value = gainSlider.value;

            const waveform = document.getElementById('waveform-select').value;
            const baseFrequencies = getChordFrequencies(chord);

            baseFrequencies.forEach(baseFreq => {
                for (let i = 1; i <= partial; i++) {
                    const oscillator = audioContext.createOscillator();
                    oscillator.type = waveform;
                    oscillator.frequency.value = baseFreq * i; // Adjust frequency by partial
                    oscillator.connect(gainNode);
                    oscillator.start();
                    oscillatorNodes.push(oscillator);
                }
            });

            // Add event listener to update gain in real-time
            gainSlider.addEventListener('input', () => {
                gainNode.gain.value = gainSlider.value;
            });
        }

        function getChordFrequencies(chord) {
            const notes = {
                'C Major': [261.63, 329.63, 392.00],
                'A Major': [440.00, 554.37, 659.25],
                'E Major': [329.63, 415.30, 493.88],
                'D Minor': [293.66, 369.99, 440.00],
                'C Minor': [261.63, 311.13, 392.00]
            };
            return notes[chord];
        }
    
