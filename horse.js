class Horse {
    constructor(playerName, laneY, canvas) {
        this.playerName = playerName;
        this.x = 50;
        this.y = laneY;
        this.canvas = canvas;
        this.speed = 0;
        this.jumpHeight = 0;
        this.isJumping = false;
        this.jumpDirection = 1;
        this.position = 0;
        this.finished = false;
        this.finishTime = 0;
        
        // Random visual characteristics
        this.horseColor = this.getRandomHorseColor();
        this.jockeyColor = this.getRandomJockeyColor();
        this.horsePattern = this.getRandomPattern();
        this.size = 0.8 + Math.random() * 0.4; // Size variation
        
        // Animation properties
        this.legAnimation = 0;
        this.lastMove = Date.now();
    }

    getRandomHorseColor() {
        const colors = [
            '#8B4513', // Saddle brown
            '#A0522D', // Sienna
            '#D2691E', // Chocolate
            '#000000', // Black
            '#FFFFFF', // White
            '#DAA520', // Goldenrod
            '#CD853F', // Peru
            '#BC8F8F', // Rosy brown
            '#F4A460', // Sandy brown
            '#DEB887'  // Burlywood
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomJockeyColor() {
        const colors = [
            '#FF6B6B', // Red
            '#4ECDC4', // Teal
            '#45B7D1', // Blue
            '#96CEB4', // Green
            '#FFEAA7', // Yellow
            '#DDA0DD', // Plum
            '#FF9F43', // Orange
            '#6C5CE7', // Purple
            '#FD79A8', // Pink
            '#00B894'  // Emerald
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomPattern() {
        const patterns = ['solid', 'spots', 'stripes', 'patches'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    update() {
        const now = Date.now();
        if (now - this.lastMove > 50) { // Update every 50ms
            this.move();
            this.lastMove = now;
        }
        
        // Update leg animation
        this.legAnimation += 0.3;
        
        // Update jump animation
        if (this.isJumping) {
            this.jumpHeight += this.jumpDirection * 8;
            if (this.jumpHeight > 25) {
                this.jumpDirection = -1;
            } else if (this.jumpHeight <= 0) {
                this.jumpHeight = 0;
                this.isJumping = false;
                this.jumpDirection = 1;
            }
        }
    }

    move() {
        if (this.finished) return;

        // Random movement with jumping
        if (!this.isJumping && Math.random() < 0.3) {
            this.isJumping = true;
            soundManager.playHoofsteps();
        }

        if (this.isJumping) {
            // Random speed during jump (limited range)
            this.speed = 2 + Math.random() * 4; // 2-6 pixels per frame
            this.x += this.speed;
        } else {
            // Slower movement when not jumping
            this.speed = 0.5 + Math.random() * 1.5; // 0.5-2 pixels per frame
            this.x += this.speed;
        }

        // Check if finished
        if (this.x >= this.canvas.width - 100) {
            this.finished = true;
            this.finishTime = Date.now();
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Scale based on size
        const scale = this.size;
        ctx.scale(scale, scale);
        
        const adjustedX = this.x / scale;
        const adjustedY = (this.y - this.jumpHeight) / scale;
        
        // Draw horse body
        this.drawHorseBody(ctx, adjustedX, adjustedY);
        
        // Draw jockey
        this.drawJockey(ctx, adjustedX, adjustedY);
        
        // Draw player name
        ctx.restore();
        this.drawPlayerName(ctx);
    }

    drawHorseBody(ctx, x, y) {
        // Horse body (oval)
        ctx.fillStyle = this.horseColor;
        ctx.beginPath();
        ctx.ellipse(x, y, 40, 20, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Apply pattern
        if (this.horsePattern === 'spots') {
            ctx.fillStyle = this.getDarkerColor(this.horseColor);
            for (let i = 0; i < 5; i++) {
                const spotX = x + (Math.random() - 0.5) * 60;
                const spotY = y + (Math.random() - 0.5) * 30;
                ctx.beginPath();
                ctx.arc(spotX, spotY, 3 + Math.random() * 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        } else if (this.horsePattern === 'stripes') {
            ctx.fillStyle = this.getDarkerColor(this.horseColor);
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(x - 30 + i * 20, y - 15, 8, 30);
            }
        }
        
        // Horse head
        ctx.fillStyle = this.horseColor;
        ctx.beginPath();
        ctx.ellipse(x + 45, y - 5, 15, 12, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Horse ears
        ctx.fillStyle = this.getDarkerColor(this.horseColor);
        ctx.beginPath();
        ctx.ellipse(x + 52, y - 12, 4, 6, -0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + 48, y - 12, 4, 6, 0.3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Horse mane
        ctx.fillStyle = this.getDarkerColor(this.horseColor);
        ctx.beginPath();
        ctx.ellipse(x + 35, y - 15, 8, 5, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Horse legs (animated)
        const legOffset = Math.sin(this.legAnimation) * 3;
        ctx.fillStyle = this.horseColor;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        
        // Front legs
        ctx.beginPath();
        ctx.moveTo(x + 15, y + 15);
        ctx.lineTo(x + 15 + legOffset, y + 35);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + 25, y + 15);
        ctx.lineTo(x + 25 - legOffset, y + 35);
        ctx.stroke();
        
        // Back legs
        ctx.beginPath();
        ctx.moveTo(x - 15, y + 15);
        ctx.lineTo(x - 15 + legOffset, y + 35);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x - 5, y + 15);
        ctx.lineTo(x - 5 - legOffset, y + 35);
        ctx.stroke();
        
        // Horse tail
        ctx.fillStyle = this.getDarkerColor(this.horseColor);
        ctx.beginPath();
        ctx.ellipse(x - 35, y + 5, 5, 15, -0.5, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawJockey(ctx, x, y) {
        // Jockey body
        ctx.fillStyle = this.jockeyColor;
        ctx.beginPath();
        ctx.ellipse(x - 5, y - 25, 8, 12, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Jockey head
        ctx.fillStyle = '#FFDBAC'; // Skin color
        ctx.beginPath();
        ctx.arc(x - 5, y - 40, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Jockey helmet
        ctx.fillStyle = this.jockeyColor;
        ctx.beginPath();
        ctx.arc(x - 5, y - 42, 7, Math.PI, 2 * Math.PI);
        ctx.fill();
        
        // Jockey arms
        ctx.strokeStyle = this.jockeyColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 20);
        ctx.lineTo(x + 15, y - 15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + 2, y - 20);
        ctx.lineTo(x + 20, y - 18);
        ctx.stroke();
    }

    drawPlayerName(ctx) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(this.playerName, this.x, this.y - 60);
    }

    getDarkerColor(color) {
        // Simple function to darken a color
        if (color === '#FFFFFF') return '#CCCCCC';
        if (color === '#000000') return '#333333';
        return color.replace(/^#/, '#').slice(0, 7) + '80'; // Add transparency
    }
}

class RaceTrack {
    constructor(canvas, horses) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.horses = horses;
        this.finishLine = canvas.width - 50;
        this.raceStarted = false;
        this.raceFinished = false;
        this.winner = null;
        this.finishOrder = [];
    }

    update() {
        if (!this.raceStarted) return;

        this.horses.forEach(horse => {
            horse.update();
            
            // Check for race finish
            if (horse.finished && !this.finishOrder.includes(horse)) {
                this.finishOrder.push(horse);
                if (!this.winner) {
                    this.winner = horse;
                    soundManager.playWinner();
                }
            }
        });

        // Check if all horses finished
        if (this.finishOrder.length === this.horses.length) {
            this.raceFinished = true;
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw finish line
        this.drawFinishLine();
        
        // Draw horses
        this.horses.forEach(horse => {
            horse.draw(this.ctx);
        });
        
        // Draw race info
        this.drawRaceInfo();
    }

    drawBackground() {
        // Sky
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.4);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.4);
        
        // Grass
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, this.canvas.height * 0.4, this.canvas.width, this.canvas.height * 0.6);
        
        // Track lanes
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        
        for (let i = 1; i < this.horses.length; i++) {
            const laneY = this.canvas.height * 0.4 + (i * (this.canvas.height * 0.6 / this.horses.length));
            this.ctx.beginPath();
            this.ctx.moveTo(0, laneY);
            this.ctx.lineTo(this.canvas.width, laneY);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
    }

    drawFinishLine() {
        // Checkered pattern finish line
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.finishLine, this.canvas.height * 0.4, 5, this.canvas.height * 0.6);
        
        this.ctx.fillStyle = '#FFF';
        for (let i = 0; i < this.canvas.height * 0.6; i += 20) {
            if (Math.floor(i / 20) % 2 === 0) {
                this.ctx.fillRect(this.finishLine, this.canvas.height * 0.4 + i, 5, 10);
            }
        }
    }

    drawRaceInfo() {
        if (this.raceStarted && !this.raceFinished) {
            // Show current positions
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(10, 10, 200, 30);
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = '16px Courier New';
            this.ctx.fillText('Race in Progress...', 20, 30);
        }
    }

    startRace() {
        this.raceStarted = true;
        soundManager.playStartRace();
        
        // Add some random neighing
        setTimeout(() => soundManager.playHorseNeigh(), 500);
        setTimeout(() => soundManager.playHorseNeigh(), 1200);
    }

    reset() {
        this.raceStarted = false;
        this.raceFinished = false;
        this.winner = null;
        this.finishOrder = [];
        
        this.horses.forEach(horse => {
            horse.x = 50;
            horse.finished = false;
            horse.finishTime = 0;
            horse.isJumping = false;
            horse.jumpHeight = 0;
            horse.legAnimation = 0;
        });
    }
}