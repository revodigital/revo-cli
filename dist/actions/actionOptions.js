"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.createErrorOptions = exports.createLogOptions = void 0;
exports.createLogOptions = [
    { flags: "-l, --log <message>", description: "Log message" }
];
exports.createErrorOptions = [
    { flags: "-e, --error <message>", description: "Error message" }
];
exports.options = [
    exports.createLogOptions,
    exports.createErrorOptions
];
