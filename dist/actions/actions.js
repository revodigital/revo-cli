"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.createLog = void 0;
const createLog = ({ log }) => {
    console.log(log);
};
exports.createLog = createLog;
const createError = ({ error }) => {
    console.error(error);
};
exports.createError = createError;
