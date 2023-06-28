"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFlutterApp = exports.createError = exports.createLog = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const flutterModel_1 = require("./flutter/flutterModel");
const flutterActions_1 = require("./flutter/flutterActions");
const utils_1 = require("../utils");
const createLog = ({ log }) => {
    console.log(log);
};
exports.createLog = createLog;
const createError = ({ error }) => {
    console.error((0, utils_1.errorText)(error));
};
exports.createError = createError;
const createFlutterApp = () => {
    inquirer_1.default
        .prompt([
        {
            type: 'list',
            name: 'method',
            message: 'Scegliere l\'opzione',
            choices: flutterModel_1.flutterMethods.map((method) => method),
        },
    ])
        .then((answers) => {
        (0, flutterActions_1.prepareFlutterApp)(answers);
    });
};
exports.createFlutterApp = createFlutterApp;
