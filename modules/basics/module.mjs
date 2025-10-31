

export const name = "Basics";

const schema = {
            "Say": { 
                args: { text: { type: "string", default: "Hello" } }, 
                subWorkspace: false,
                action: function (cmd, unit, state) {
                    log("Say: " + (cmd.args.text || ""));
                }
            },
            "Feel": { 
                args: { space: { type: ["Empty","Wall","Stairs","Unit"], default: "Empty" } }, 
                subWorkspace: true,
                action: function (cmd, unit, state) {
                    log("Feel: " + (cmd.args.space || ""));
                    exec.call(this, cmd.workspace);
                }
            },
            "Hear": { 
                args: { phrase: { type: "string", default: "Hi" } }, 
                subWorkspace: true,
                action: function (cmd, unit, state) {
                    log("Hear: " + (cmd.args.phrase || ""));
                    exec.call(this, cmd.workspace);
                }
            },
            "Attack": {
                args:  {}, 
                subWorkspace: false,
                action: async function (cmd, unit, state) {
                    let startX = unit.x;
                    let startY = unit.y;
                    if (unit.dir===0 && unit.y>0) startY--;
                    if (unit.dir===1 && unit.x + 1 < this.map.width) startX++;
                    if (unit.dir===2 && unit.y + 1 < this.map.height) startY++;
                    if (unit.dir===3 && unit.x>0) startX--;
                    await sleep(333);
                    let gobject = undefined;
                    
                    for (const object of this.map.objects) {
                        if (object.x == startX && object.y == startY && object.attacked) {
                            if (object.dead) {
                                break;
                            }
                            object.attacked.call(this, object, unit, state);
                            gobject = object;
                            break;
                        }
                    }
                    drawGrid();
                    if (gobject)
                        log(`Attack: ${gobject.name}, Unit Life: ${gobject.life}`);
                    else
                        log(`Attack: -Nothing-`);
                }
            },
            "Walk": { 
                args: { steps: { type: "number", default: 1 } }, 
                subWorkspace: false,
                action: async function (cmd, unit, state) {
                    let steps = parseInt(cmd.args.steps) || 0;
                    for (let i=0; i<steps; i++) {
                        const startX = unit.x;
                        const startY = unit.y;
                        if (unit.dir===0 && unit.y>0) unit.y--;
                        if (unit.dir===1 && unit.x + 1 < this.map.width) unit.x++;
                        if (unit.dir===2 && unit.y + 1 < this.map.height) unit.y++;
                        if (unit.dir===3 && unit.x>0) unit.x--;
                        for (const object of this.map.objects) {
                            if (object.dead) continue;
                            if (object.x == unit.x && object.y == unit.y && object.solid) {
                                unit.x = startX;
                                unit.y = startY;
                                log("Cannot move there!");
                            }
                        }
                        await sleep(333);
                        if (i + 1 < steps) {
                            for (const object of this.map.objects) {
                                if (object && object.tick) {
                                    object.tick.call(this, unit, state);
                                }
                            }
                        }
                        
                        drawGrid();
                    }
                    log("Walk " + steps + " step(s)");
                }
            },
            "Repeat": { 
                args: { times: { type: "number", default: 1 } }, 
                subWorkspace: true,
                action: async function (cmd, unit, state) {
                    let steps = parseInt(cmd.args.times) || 0;
                    for (let i=0; i<steps; i++) {
                        await exec.call(this, cmd.workspace);
                    }
                    log("Repeat " + steps + " times(s)");
                }
            },
            "Turn": { 
                args: { direction: { type: ["left","right"], default: "left" } }, 
                subWorkspace: false,
                action: function  (cmd, unit, state) {
                    if (cmd.args.direction==="left") {
                        unit.dir = (unit.dir+3)%4;
                        drawGrid();
                        log("Turn left");
                    } else if (cmd.args.direction==="right") {
                        unit.dir = (unit.dir+1)%4;
                        drawGrid();
                        log("Turn right");
                    }
                }
            },
            "Identify": { 
                args: { 
                key: { type: "string", default: "x" }, 
                operator: { type: ["<","<=",">=",">","==","!="], default: "==" }, 
                value: { type: "string", default: "0" } 
                }, 
                subWorkspace: true ,
                action: function (cmd, unit, state) {
                    const key = cmd.args.key || "";
                    const op = cmd.args.operator || "==";
                    const val = cmd.args.value || "";
                    log(`Identify: ${key} ${op} ${val}`);
                    // For demo, always execute sub-workspace
                    exec.call(this, cmd.workspace);
                }
            },
            "Rest": { 
                args: {}, 
                subWorkspace: false ,
                action: function (cmd, unit, state) {
                    if (unit.life < 20) {
                        unit.life += 1;
                    }
                    log(`Rest: Life ${unit.life}`);
                }
            }
        }

const enemyA = {
    title: function (self) {
        return `${self.name} - Life ${self.life}, Attack ${self.atk}, Range ${self.range}`;
    },
    name: "Enemy A",
    x: 6,
    y: 0,
    char: "👿",
    solid: true,
    life: 2,
    atk: 1,
    range: 1,
    dead: false,
    attacked: function(self, unit, state) {
        self.life -= unit.attack;
        if (self.life <= 0) {
            self.dead = true;
        }
    },
    tick: function (self, unit, state) {
        if (self.dead) {
            return;
        }
        const r = Math.hypot(unit.x - self.x, unit.y - self.y);
        if (r <= 1) {
            unit.life -= 1;
            log(`Enemy A: attacks, Your life: ${unit.life}`);
            if (unit.life <= 0) {
                resetLevel();
            }
        } else {
            log("Enemy A: Looks around");
        }
    }
};

export const levels = {
    level1: {
        name: "Level One",
        desc: "Get to the exit!",
        map: {
            width: 7,
            height: 1,
            objects: [
                {
                    title: "exit",
                    x: 6,
                    y: 0,
                    char: "❌",
                    end: function (unit, state) {
                        if (unit.x == 6 && unit.y == 0) {
                            alert("You exited the level!");
                            loadLevel("level2");
                        }
                    }
                }
            ]
        },
        schema
    },
    level2: {
        name: "Level Two",
        desc: "Get to the exit!",
        map: {
            width: 7,
            height: 2,
            objects: [
                {
                    title: "exit",
                    x: 6,
                    y: 1,
                    char: "❌",
                    end: function (unit, state) {
                        if (unit.x == 6 && unit.y == 1) {
                            alert("You exited the level!");
                            loadLevel("level3");
                        }
                    }
                }
            ]
        },
        schema
    },
    level3: {
        name: "Level Three",
        desc: "Get to the exit!",
        map: {
            width: 7,
            height: 2,
            objects: [
                {
                    title: "exit",
                    x: 6,
                    y: 1,
                    char: "❌",
                    end: function (unit, state) {
                        if (unit.x == 6 && unit.y == 1) {
                            alert("You exited the level!");
                            loadLevel("level4");
                        }
                    }
                },
                {
                    id: "enemyA",
                    title: function (self) {
                        return `enemy A - Life ${self.life}, Attack ${self.atk}, Range ${self.range}`;
                    },
                    name: "Enemy A",
                    x: 6,
                    y: 0,
                    char: "👿",
                    solid: true,
                    life: 2,
                    atk: 1,
                    range: 1,
                    dead: false,
                    attacked: function(self, unit, state) {
                        self.life -= unit.attack;
                        if (self.life <= 0) {
                            self.dead = true;
                        }
                    },
                    tick: function (self, unit, state) {
                        if (self.dead) {
                            return;
                        }
                        const r = Math.hypot(unit.x - self.x, unit.y - self.y);
                        if (r <= 1) {
                            unit.life -= 1;
                            log(`Enemy A: attacks, Your life: ${unit.life}`);
                            if (unit.life <= 0) {
                                resetLevel();
                            }
                        } else {
                            log("Enemy A: Looks around");
                        }
                    }
                }
            ]
        },
        schema
    },
    level4: {
        name: "Level Four",
        desc: "Get to the exit!",
        map: {
            width: 7,
            height: 1,
            objects: [
                {
                    title: "exit",
                    x: 6,
                    y: 0,
                    char: "❌",
                    end: function (unit, state) {
                        if (unit.x == 6 && unit.y == 0) {
                            alert("You exited the level!");
                        }
                    }
                }
            ]
        },
        schema
    },
}

function create_enemy(params, enemy) {
    const e = {};
    for (const key in enemy) {
        const v = enemy[key];
        if (typeof v == "function") e[key] = v;
        else e[key] = structuredClone(v);
    }
    Object.assign(e, params);
    return e;
}

levels.level4.map.objects.push(
    create_enemy({
        x: 3
    }, enemyA)
)

levels.level4.map.objects.push(
    create_enemy({
        x: 5
    }, enemyA)
)