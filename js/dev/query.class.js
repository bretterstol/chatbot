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
        this.query = this.createQuery();
    }
    Query.prototype.insert = function (connection) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            connection.query(_this.query, _this.getVariables(), function (error, result) {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                else
                    resolve(result.insertId);
            });
        });
    };
    Query.prototype.createQuery = function () {
        return "insert into ??(??) values(?)";
    };
    Query.prototype.getVariables = function () {
        return [this.table, this.columns, this.values];
    };
    return Query;
}());
exports.Query = Query;
var QueryDuplicate = /** @class */ (function (_super) {
    __extends(QueryDuplicate, _super);
    function QueryDuplicate(table, columns, values, row_increment) {
        var _this = _super.call(this, table, columns, values) || this;
        _this.row_increment = row_increment;
        _this.query = _this.createQuery(row_increment);
        return _this;
    }
    QueryDuplicate.prototype.createQuery = function (increment) {
        if (increment) {
            return "insert into ??(??) values(?) on duplicate key update ?? = 1 + ??";
        }
        else {
            return "insert into ??(??) values(?) on duplicate key update";
        }
    };
    QueryDuplicate.prototype.getVariables = function () {
        if (this.row_increment)
            return [this.table, this.columns, this.values, this.row_increment, this.row_increment];
        else
            return _super.prototype.getVariables.call(this);
    };
    return QueryDuplicate;
}(Query));
exports.QueryDuplicate = QueryDuplicate;
