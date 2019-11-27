"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
router.post('/', function (req, res) {
    res.json({ hello: "world" });
});
router.get('/:name', function (req, res) {
    var name = req.params.name;
    res.send("Hello, " + name + "!");
});
exports.ActionsController = router;
