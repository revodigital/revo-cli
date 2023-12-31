#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const utils_1 = require("./mobile_app/utils");
const actionsModel_1 = require("./mobile_app/actions/actionsModel");
commander_1.program
    .version('0.0.1')
    .description('revo_cli');
(0, utils_1.createCommand)(commander_1.program, actionsModel_1.ActionsEnum.CREATE_LOG);
(0, utils_1.createCommand)(commander_1.program, actionsModel_1.ActionsEnum.CREATE_ERROR);
(0, utils_1.createCommand)(commander_1.program, actionsModel_1.ActionsEnum.CREATE_FLUTTER_APP);
commander_1.program.parse(process.argv);
