/***********************************/
/*          PARTICLE CLASS         */
/***********************************/

class Particle {
    constructor(ctx, textures, x, y) {
        this.ctx = ctx;
        this.textures = textures;

        this.x = x + Math.random() * 20 - 10;
        this.y = y + Math.random() * 20 - 10;

        this.vx = Math.random() * 4 - 2;
        this.vy = -2;

        this.gravity = Math.random() * 0.075 + 0.075;

        this.type = Math.floor(Math.random() * 8);
    }

    render(viewY) {
        this.ctx.drawImage(this.textures.get("particles"), 12 * this.type, 0, 12, 10, this.x - 6, this.y - 5 - viewY, 12, 10);
    }

    update(dt) {
        if(this.vy < 8) this.vy += this.gravity * dt * 60;
        if(this.vx < -0.5) this.vx += 0.02 * dt * 60;
        if(this.vx > 0.5) this.vx -= 0.02 * dt * 60;

        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;
    }
}

/***********************************/
/*         PARTICLE ENGINE         */
/***********************************/

class ParticleEngine {
    constructor(ctx, textures) {
        this.ctx = ctx;
        this.textures = textures;

        this.particles = [];
    }

    render(viewY) {
        for(let i = 0; i < this.particles.length; i++) {
            this.particles[i].render(viewY);
        }
    }

    update(dt, viewY) {
        for(let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(dt);
        }

        for(let i = 0; i < this.particles.length; i++) {
            if(this.particles[i].y > viewY + 550) {
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    add(x, y) {
        this.particles.push(new Particle(this.ctx, this.textures, x, y));
    }
}

// Exports

export { Particle, ParticleEngine };