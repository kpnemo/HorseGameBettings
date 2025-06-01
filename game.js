class GameManager {
    constructor() {
        this.players = [];
        this.horses = [];
        this.raceTrack = null;
        this.canvas = null;
        this.gameLoop = null;
        
        this.setupEventListeners();
        this.updatePlayerCount();
    }

    setupEventListeners() {
        // Player setup
        document.getElementById('add-player').addEventListener('click', () => this.addPlayer());
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        
        // Results screen
        document.getElementById('play-again').addEventListener('click', () => this.playAgain());
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        
        // Player input handling
        document.addEventListener('input', (e) => {
            if (e.target.matches('.player-input input')) {
                this.updatePlayers();
                soundManager.playClick();
            }
        });
        
        // Remove player buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.remove-player')) {
                this.removePlayer(e.target);
                soundManager.playClick();
            }
        });
        
        // Button click sounds
        document.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                soundManager.playClick();
            }
        });
    }

    addPlayer() {
        const playerInputs = document.getElementById('player-inputs');
        const currentCount = playerInputs.children.length;
        
        if (currentCount >= 8) {
            alert('Maximum 8 players allowed!');
            return;
        }
        
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-input';
        playerDiv.innerHTML = `
            <input type="text" placeholder="Player ${currentCount + 1} Name" maxlength="12">
            <button class="remove-player">×</button>
        `;
        
        playerInputs.appendChild(playerDiv);
        this.updatePlayerCount();
        
        // Focus on new input
        playerDiv.querySelector('input').focus();
        
        // Update add button state
        if (currentCount + 1 >= 8) {
            document.getElementById('add-player').disabled = true;
        }
    }

    removePlayer(button) {
        const playerInputs = document.getElementById('player-inputs');
        const currentCount = playerInputs.children.length;
        
        if (currentCount <= 2) {
            alert('Minimum 2 players required!');
            return;
        }
        
        button.parentElement.remove();
        this.updatePlayerCount();
        this.updatePlayers();
        
        // Re-enable add button
        document.getElementById('add-player').disabled = false;
        
        // Update placeholders
        const inputs = playerInputs.querySelectorAll('input');
        inputs.forEach((input, index) => {
            if (!input.value) {
                input.placeholder = `Player ${index + 1} Name`;
            }
        });
    }

    updatePlayerCount() {
        const count = document.getElementById('player-inputs').children.length;
        document.getElementById('player-count').textContent = `${count} player${count !== 1 ? 's' : ''} added`;
        
        // Show/hide remove buttons
        const removeButtons = document.querySelectorAll('.remove-player');
        removeButtons.forEach(button => {
            button.style.display = count > 2 ? 'block' : 'none';
        });
    }

    updatePlayers() {
        const inputs = document.querySelectorAll('.player-input input');
        this.players = [];
        
        inputs.forEach(input => {
            if (input.value.trim()) {
                this.players.push(input.value.trim());
            }
        });
        
        // Update start button state
        const startButton = document.getElementById('start-game');
        startButton.disabled = this.players.length < 2;
    }

    startGame() {
        if (this.players.length < 2) {
            alert('Need at least 2 players to start!');
            return;
        }
        
        this.showScreen('game-screen');
        this.initializeRace();
        this.startRace();
    }

    initializeRace() {
        this.canvas = document.getElementById('race-canvas');
        
        // Set canvas size
        const container = document.getElementById('game-screen');
        const maxWidth = Math.min(1200, container.clientWidth - 40);
        this.canvas.width = maxWidth;
        this.canvas.height = Math.max(400, Math.min(600, window.innerHeight * 0.6));
        
        // Create horses
        this.horses = [];
        const laneHeight = (this.canvas.height * 0.6) / this.players.length;
        
        this.players.forEach((playerName, index) => {
            const laneY = this.canvas.height * 0.4 + (index * laneHeight) + (laneHeight / 2);
            const horse = new Horse(playerName, laneY, this.canvas);
            this.horses.push(horse);
        });
        
        // Create race track
        this.raceTrack = new RaceTrack(this.canvas, this.horses);
    }

    startRace() {
        this.raceTrack.startRace();
        this.gameLoop = setInterval(() => this.updateGame(), 1000 / 60); // 60 FPS
    }

    updateGame() {
        this.raceTrack.update();
        this.raceTrack.draw();
        
        // Check if race is finished
        if (this.raceTrack.raceFinished) {
            this.endRace();
        }
    }

    endRace() {
        clearInterval(this.gameLoop);
        
        // Wait a moment before showing results
        setTimeout(() => {
            this.showResults();
        }, 2000);
    }

    showResults() {
        this.showScreen('results-screen');
        
        const winner = this.raceTrack.winner;
        const finishOrder = this.raceTrack.finishOrder;
        
        // Update winner display
        document.getElementById('winner-horse').textContent = '🏆🐎';
        document.getElementById('winner-text').textContent = `🎉 ${winner.playerName} WINS! 🎉`;
        
        // Update final positions
        const finalPositions = document.getElementById('final-positions');
        finalPositions.innerHTML = '<h3>Final Results:</h3>';
        
        finishOrder.forEach((horse, index) => {
            const positionDiv = document.createElement('div');
            positionDiv.className = `final-position ${index === 0 ? 'winner' : ''}`;
            
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            positionDiv.textContent = `${medal} ${horse.playerName}`;
            
            finalPositions.appendChild(positionDiv);
        });
    }

    playAgain() {
        this.raceTrack.reset();
        this.showScreen('game-screen');
        this.startRace();
    }

    resetGame() {
        this.showScreen('setup-screen');
        this.players = [];
        this.horses = [];
        this.raceTrack = null;
        
        // Clear player inputs except first two
        const playerInputs = document.getElementById('player-inputs');
        while (playerInputs.children.length > 2) {
            playerInputs.removeChild(playerInputs.lastChild);
        }
        
        // Clear input values
        playerInputs.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        
        this.updatePlayerCount();
        this.updatePlayers();
        
        // Re-enable add button
        document.getElementById('add-player').disabled = false;
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameManager();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (game.canvas && game.raceTrack) {
            const container = document.getElementById('game-screen');
            const maxWidth = Math.min(1200, container.clientWidth - 40);
            game.canvas.width = maxWidth;
            game.canvas.height = Math.max(400, Math.min(600, window.innerHeight * 0.6));
            
            // Update finish line
            game.raceTrack.finishLine = game.canvas.width - 50;
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen.id === 'setup-screen') {
                const startButton = document.getElementById('start-game');
                if (!startButton.disabled) {
                    startButton.click();
                }
            } else if (activeScreen.id === 'results-screen') {
                document.getElementById('play-again').click();
            }
        }
        
        if (e.key === 'Escape') {
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen.id !== 'setup-screen') {
                game.resetGame();
            }
        }
    });
});