class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    createBeep(frequency, duration, type = 'square') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playStartRace() {
        // Race start fanfare
        this.createBeep(440, 0.2);
        setTimeout(() => this.createBeep(554, 0.2), 200);
        setTimeout(() => this.createBeep(659, 0.4), 400);
    }

    playHoofsteps() {
        // Random hoofstep sounds
        const frequencies = [80, 90, 100, 110];
        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
        this.createBeep(freq, 0.05, 'triangle');
    }

    playWinner() {
        // Victory fanfare
        const melody = [523, 659, 784, 1047];
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(freq, 0.3);
            }, index * 200);
        });
    }

    playClick() {
        this.createBeep(800, 0.1);
    }

    playHorseNeigh() {
        // Simulate horse neigh with frequency sweep
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.6);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.6);
    }
}

const soundManager = new SoundManager();