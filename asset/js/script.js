let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let centre = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
}

let time = 0;
let tick = 300;

class Cible {
    constructor(x, y) {
        this.lives = 10000;
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.color = 'red';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    goodPosition() {
        // si la cible est dans la zone de jeu et pas trop proche des robots

        if (this.x > 100 && this.x < window.innerWidth - 100 && this.y > 100 && this.y < window.innerHeight - 100){
            if (this.x > centre.x - 200 && this.x < centre.x + 200 && this.y > centre.y - 200 && this.y < centre.y + 200) {
                return false;
            }
            return true;
        } 
        return false;
    }

    randomPosition() {
        while(this.goodPosition() == false){
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
        }
    }

    degats(x, y) { // x et y sont les coordonnées du centre du robot qui a touché la cible, les dégats sont accetés si le robot est assez proche de la cible, rayon de 20px
        if (this.x + 20 > x && this.x - 20 < x) {
            if (this.y + 20 > y && this.y - 20 < y) {
                this.lives -= 1;
            }
        }
    }
}



class Robot {
    constructor(startPlace) {
        this.espace = 10;
        this.width = 50;
        this.height = 40;
        this.name = startPlace;

        switch (startPlace) {
            case 1:
                this.x = centre.x - this.width * 2 - this.espace * 1.5;
                this.y = centre.y - this.height * 1.5 - this.espace;
                break;
            case 2:
                this.x = centre.x - this.width * 1 - this.espace * 0.5;
                this.y = centre.y - this.height * 1.5 - this.espace;
                break;
            case 3:
                this.x = centre.x + this.espace * 0.5;
                this.y = centre.y - this.height * 1.5 - this.espace;
                break;
            case 4:
                this.x = centre.x + this.width + this.espace * 1.5;
                this.y = centre.y - this.height * 1.5 - this.espace;
                break;
            case 5:
                this.x = centre.x - this.width * 2 - this.espace * 1.5;
                this.y = centre.y - this.height * 0.5;
                break;
            case 6:
                this.x = centre.x - this.width * 1 - this.espace * 0.5;
                this.y = centre.y - this.height * 0.5;
                break;
            case 7:
                this.x = centre.x + this.espace * 0.5;
                this.y = centre.y - this.height * 0.5;
                break;
            case 8:
                this.x = centre.x + this.width + this.espace * 1.5;
                this.y = centre.y - this.height * 0.5;
                break;
            case 9:
                this.x = centre.x - this.width * 2 - this.espace * 1.5;
                this.y = centre.y + this.height * 0.5 + this.espace;
                break;
            case 10:
                this.x = centre.x - this.width * 1 - this.espace * 0.5;
                this.y = centre.y + this.height * 0.5 + this.espace;
                break;
            case 11:
                this.x = centre.x + this.espace * 0.5;
                this.y = centre.y + this.height * 0.5 + this.espace;
                break;
            case 12:
                this.x = centre.x + this.width + this.espace * 1.5;
                this.y = centre.y + this.height * 0.5 + this.espace;
                break;
        }

        this.radarRadius = 100;
        this.color = 'brown';
        this.speed = 2;
        this.direction = 0;
    }

    draw() { //draw with rotate and translate
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.direction);
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    move() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
    }

    onCible(cible) {
        if (this.x + this.width > cible.x - cible.radius && this.x < cible.x + cible.radius) {
            if (this.y + this.height > cible.y - cible.radius && this.y < cible.y + cible.radius) {
                return true;
            }
        }
        return false;
    }

    detectRobot(robots) {
        for (let i = 0; i < robots.length; i++) {
            if (this.radarRadius > Math.sqrt(Math.pow(this.x - robots[i].x, 2) + Math.pow(this.y - robots[i].y, 2))) {
                return true;
            }
        }
        return false;
    }

    collideRobot(robots) {
        for (let i = 0; i < robots.length; i++) {
            if (this.x + this.width > robots[i].x && this.x < robots[i].x + robots[i].width) {
                if (this.y + this.height > robots[i].y && this.y < robots[i].y + robots[i].height) {
                    if (robots[i].name != this.name)
                        return true;
                }
            }
        }
        return false;
    }

    randomAngle() {
        this.direction = Math.random() * 2 * Math.PI;
    }

    turn(angle) {
        this.direction += angle;
    }

    outOfMap() {
        if (this.x < 0 || this.x + this.width > window.innerWidth || this.y < 0 || this.y + this.height > window.innerHeight) {
            return true;
        }
        return false;
    }


    damageCible(cible) {
        cible.degats(this.x + this.width / 2, this.y + this.height / 2);
    }



    algorithm() {
        // Here is the algorithm to make robots interact with each other
        // This section need to be code by a human and not written by any ia


    }

}



let cible = new Cible(centre.x, centre.y);
let robots = [];
for (let i = 1; i <= 12; i++) {
    robots.push(new Robot(i));
}

cible.randomPosition();
cible.draw();

robots.forEach(robot => {
    robot.draw();
});





// update all caracters every tick
let game = setInterval(() => {
    time += 1;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    cible.draw();

    robots.forEach(robot => {
        robot.draw();
        if (robot.collideRobot(robots)) {
            game = clearInterval(game);
            alert('You lose in ' + time / tick + ' seconds');

        }
        if (robot.outOfMap()) {
            game = clearInterval(game);
            alert('You lose in ' + time / tick + ' seconds');
        }

        robot.algorithm();
    });

    if (cible.lives <= 0) {
        alert('Win in ' + time / tick + ' seconds');
    }

}, 1000 / tick);


