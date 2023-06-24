"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config");
const com_qcobjects_admin_lib_db_sqlite3_1 = __importDefault(require("./packages/com.qcobjects.admin.lib.db.sqlite3"));
require("./package");
exports.default = com_qcobjects_admin_lib_db_sqlite3_1.default;
