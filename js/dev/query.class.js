"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Query = /** @class */ (function () {
    function Query(table, columns, values) {
        this.table = table;
        this.columns = columns;
        this.values = values;
    }
    Query.prototype.insert = function (connection) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            connection.query("insert into ??(??) values(?)", [_this.table, _this.columns, _this.values], function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    resolve(result.insertId);
                }
            });
        });
    };
    return Query;
}());
exports.Query = Query;
var QueryDuplicate = /** @class */ (function (_super) {
    __extends(QueryDuplicate, _super);
    function QueryDuplicate(table, columns, values) {
        return _super.call(this, table, columns, values) || this;
    }
    return QueryDuplicate;
}(Query));
exports.QueryDuplicate = QueryDuplicate;
