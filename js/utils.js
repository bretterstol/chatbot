"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = __importStar(require("mysql"));
var connection;
var config = {
    host: 'localhost',
    user: 'retterstol',
    password: '',
    database: 'chatbot'
};
function getConnection() {
    var createConnection = function (config) {
        return mysql.createConnection(config);
    };
    if (connection === undefined) {
        connection = createConnection(config);
        connection.connect();
    }
    return connection;
}
exports.default = {
    getConnection: getConnection
};
