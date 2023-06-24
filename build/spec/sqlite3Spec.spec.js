#!/usr/bin/env node
"use strict";
/* eslint-disable no-undef */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const com_qcobjects_admin_lib_db_sqlite3_1 = __importDefault(require("../js/packages/com.qcobjects.admin.lib.db.sqlite3"));
const qcobjects_1 = require("qcobjects");
const absolutePath = node_path_1.default.resolve(__dirname, "./");
describe("SQLite3 DB Main Test", function () {
    const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const testConfig = require(absolutePath + "/sqlite3TestData.js");
    async function close() {
        gateway.getClient().close();
    }
    const createDatabase = async () => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[createDatabase]");
        return await gateway.createDatabase("databaseTest");
    };
    const createContainer = async () => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[createContainer]");
        return await gateway.createContainer("databaseTest", "tabletest", "id text primary key,partitionKey,Country,parents,children,address,isRegistered,lastName");
    };
    const readContainer = async () => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[readContainer]");
        return await gateway.readContainer("databaseTest", "tabletest");
    };
    const createFamilyItem = async (item) => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[createFamilyItem]");
        return await gateway.createFamilyItem("databaseTest", "tabletest", item);
    };
    const updateFamilyItem = async (item) => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[createFamilyItem]");
        return await gateway.createFamilyItem("databaseTest", "tabletest", item);
    };
    const getFamilyItem = async (item) => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[getFamilyItem]");
        return await gateway.getFamilyItem("databaseTest", "tabletest", item);
    };
    const queryContainer = async () => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[queryContainer]");
        return await gateway.queryContainer("databaseTest", "tabletest", `
      SELECT rowId,id,partitionKey,Country,parents,children,address,isRegistered,lastName from tabletest;
    `, {});
    };
    const dbSerialize = async () => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[queryContainer]");
        return await gateway.getClient().dbSerialize("databaseTest", `
      SELECT rowId,id,partitionKey,Country,parents,children,address,isRegistered,lastName from tabletest;
    `, {});
    };
    const deleteFamilyItem = async (item) => {
        const gateway = new com_qcobjects_admin_lib_db_sqlite3_1.default();
        qcobjects_1.logger.info("[deleteFamilyItem]");
        return await gateway.deleteFamilyItem("databaseTest", "tabletest", item);
    };
    it("SQLite3 Test Spec CreateDatabase", function (done) {
        createDatabase()
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec CreateContainer", function (done) {
        createContainer()
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec CreateDatabase", function (done) {
        createDatabase()
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec readContainer", function (done) {
        readContainer()
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec CreateFamilyItem", function (done) {
        createFamilyItem(testConfig.items.Andersen)
            .then(() => createFamilyItem(testConfig.items.Wakefield))
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec GetFamilyItem", function (done) {
        getFamilyItem(testConfig.items.Andersen)
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec UpdateFamilyItem", function (done) {
        updateFamilyItem(testConfig.items.Andersen)
            .then(() => createFamilyItem(testConfig.items.Wakefield))
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec QueryContainer", function (done) {
        queryContainer()
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec DeleteFamilyItem", function (done) {
        deleteFamilyItem(testConfig.items.Andersen)
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec dbSerialize", function (done) {
        dbSerialize()
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
    it("SQLite3 Test Spec Close Database", function (done) {
        close()
            .then((result) => {
            console.log(result);
            console.log("Success");
            done();
        })
            .catch(error => {
            done();
            throw new Error(error.message);
        });
    });
});
