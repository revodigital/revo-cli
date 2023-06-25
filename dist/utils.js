"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = void 0;
const actionsModel_1 = require("./actions/actionsModel");
const createCommand = (program, action) => {
    const myProgram = program.command(action);
    createOptions(myProgram, action);
    myProgram.action((args) => {
        console.log(args);
        (0, actionsModel_1.runAction)(action, args);
    });
};
exports.createCommand = createCommand;
const createOptions = (program, action) => {
    const options = (0, actionsModel_1.prepareOptions)(action);
    for (let i = 0; i < options.length; i++) {
        program.option(options[i].flags, options[i].description);
    }
};
