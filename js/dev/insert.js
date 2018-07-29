"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = __importStar(require("mysql"));
var query_class_1 = require("./query.class");
var config = {
    host: 'localhost',
    user: 'retterstol',
    password: '',
    database: 'chatbot'
};
function insert(text) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, sentences, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = mysql.createConnection(config);
                    connection.connect();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    sentences = makeWordList(text);
                    return [4 /*yield*/, insertWords(sentences, connection)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 3:
                    error_1 = _a.sent();
                    return [2 /*return*/, false];
                case 4:
                    connection.end();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function makeWordList(text) {
    //console.log(book);
    var cleanString = text.replace(/\n|\r|\t/g, " ");
    return cleanString.split(/\./g);
}
function insertWords(list, connection) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, list_1, sentence, fixedSentence, sentenceQuery, sentence_id, words, _loop_1, _a, words_1, word, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    _i = 0, list_1 = list;
                    _b.label = 1;
                case 1:
                    if (!(_i < list_1.length)) return [3 /*break*/, 7];
                    sentence = list_1[_i];
                    fixedSentence = sentence.replace(/[\u0800-\uFFFF]/g, '').trim();
                    sentenceQuery = new query_class_1.Query("sentences", "sentence", [fixedSentence]);
                    return [4 /*yield*/, sentenceQuery.insert(connection)];
                case 2:
                    sentence_id = _b.sent();
                    console.log(sentence_id);
                    words = fixedSentence.split(" ");
                    _loop_1 = function (word) {
                        var word_id, wordSentenceQuery, word_sentence_id;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        connection.query("insert into words(word) values(?) on duplicate key update word_count = 1 + word_count", [word], function (error, result) {
                                            if (error)
                                                reject(error);
                                            else {
                                                resolve(result.insertId);
                                            }
                                        });
                                    })];
                                case 1:
                                    word_id = _a.sent();
                                    wordSentenceQuery = new query_class_1.Query("word_sentence", ["word_id", "sentence_id"], [word_id, sentence_id]);
                                    return [4 /*yield*/, wordSentenceQuery.insert(connection)];
                                case 2:
                                    word_sentence_id = _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, words_1 = words;
                    _b.label = 3;
                case 3:
                    if (!(_a < words_1.length)) return [3 /*break*/, 6];
                    word = words_1[_a];
                    return [5 /*yield**/, _loop_1(word)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, true];
                case 8:
                    error_2 = _b.sent();
                    return [2 /*return*/, false];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.default = insert;
