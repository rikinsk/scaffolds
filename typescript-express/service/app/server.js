"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var controllers_1 = require("./controllers");
var app = express_1.default();
var port = Number(process.env.PORT) || 3000;
app.use(body_parser_1.default.json());
app.use('/', controllers_1.ActionsController);
app.listen(port, function () {
    console.log("Listening at http://localhost:" + port + "/");
});
