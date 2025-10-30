

export const name = "Basics";
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
        schema : {
            "Say": { 
                args: { text: { type: "string", default: "Hello" } }, 
                subWorkspace: false,
                action: (cmd, unit, state) => {
                    log("Say: " + (cmd.args.text || ""));
                }
            },
            "Feel": { 
                args: { space: { type: ["Empty","Wall","Stairs","Unit"], default: "Empty" } }, 
                subWorkspace: true,
                action: (cmd, unit, state) => {
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
            "Walk": { 
                args: { steps: { type: "number", default: 1 } }, 
                subWorkspace: false,
                action: function (cmd, unit, state) {
                    let steps = parseInt(cmd.args.steps) || 0;
                    for (let i=0; i<steps; i++) {
                        if (unit.dir===0 && unit.y>0) unit.y--;
                        if (unit.dir===1 && unit.x + 1 < this.map.width) unit.x++;
                        if (unit.dir===2 && unit.y + 1 < this.map.height) unit.y++;
                        if (unit.dir===3 && unit.x>0) unit.x--;
                        drawGrid();
                    }
                    log("Walk " + steps + " step(s)");
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
            }
        }
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
                        }
                    }
                }
            ]
        },
        schema : {
            "Say": { 
                args: { text: { type: "string", default: "Hello" } }, 
                subWorkspace: false,
                action: (cmd, unit, state) => {
                    log("Say: " + (cmd.args.text || ""));
                }
            },
            "Feel": { 
                args: { space: { type: ["Empty","Wall","Stairs","Unit"], default: "Empty" } }, 
                subWorkspace: true,
                action: (cmd, unit, state) => {
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
            "Walk": { 
                args: { steps: { type: "number", default: 1 } }, 
                subWorkspace: false,
                action: async function (cmd, unit, state) {
                    let steps = parseInt(cmd.args.steps) || 0;
                    for (let i=0; i<steps; i++) {
                        if (unit.dir===0 && unit.y>0) unit.y--;
                        if (unit.dir===1 && unit.x + 1 < this.map.width) unit.x++;
                        if (unit.dir===2 && unit.y + 1 < this.map.height) unit.y++;
                        if (unit.dir===3 && unit.x>0) unit.x--;
                        await sleep(333);
                        drawGrid();
                    }
                    log("Walk " + steps + " step(s)");
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
            }
        }
    }
}
