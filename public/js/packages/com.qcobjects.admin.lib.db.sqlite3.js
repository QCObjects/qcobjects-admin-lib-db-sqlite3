/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * QCObjects SQLite3 Integration
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
 */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qcobjects_1 = require("qcobjects");
const node_path_1 = __importDefault(require("node:path"));
const sqlite3_1 = require("sqlite3");
class SQLite3Container {
    constructor({ pipe, id, containerFields }) {
        this.pipe = pipe;
        this.id = id;
        this.containerFields = containerFields;
        this.items = [];
    }
    setItems(items) {
        this.items = items;
    }
    item(item) {
        return new Item(this, item);
    }
    query(sqlQuery, prepareValues) {
        return new Promise((resolve, reject) => {
            try {
                this.pipe.serialize(() => {
                    this.pipe.all(sqlQuery, prepareValues, (err, rows) => {
                        if (!err) {
                            const result = rows.map((row) => this.item(row));
                            resolve(result);
                        }
                        else {
                            reject(new Error(`[sqlite3] Error: ${err}`));
                        }
                    });
                });
            }
            catch (e) {
                reject(new Error(`[sqlite3] Error querying the container: ${e}`));
            }
        });
    }
    delete(itemParams) {
        const item = new Item(this, itemParams);
        return item.delete();
    }
}
class Item {
    constructor(container, item) {
        const fields = Object.keys(item);
        this.__metadata = {
            id: item.id,
            rowId: item.rowId,
            fields,
            prepareValues: {},
            container
        };
        this.buildObject(item);
    }
    buildObject(item) {
        this.__metadata.fields.map((k) => {
            this[k] = item[k];
            this.__metadata.prepareValues[`$${k}`] = this.castValue(k, item[k]);
            return k;
        });
        return this;
    }
    castValue(key, value) {
        let _ret_;
        if (typeof value === "object") {
            _ret_ = JSON.stringify(value);
        }
        else {
            _ret_ = value;
        }
        return _ret_;
    }
    get() {
        return new Promise((resolve, reject) => {
            const container = this.__metadata.container;
            const db = container.pipe;
            const containerName = this.__metadata.container.id;
            const id = this.__metadata.id;
            const sqlStatement = `select ${this.__metadata.fields.join(",")} from ${containerName} where id=$id;`;
            try {
                db.serialize(() => {
                    db.all(sqlStatement, { $id: id }, (err, rows) => {
                        if (!err) {
                            const item = this.buildObject(rows.pop());
                            console.log(item);
                            resolve(item);
                        }
                        else {
                            reject(new Error(`Error getting item ${id} from ${containerName}: ${err} \n ${sqlStatement}`));
                        }
                    });
                });
            }
            catch (e) {
                reject(new Error(`[sqlite3] Error getting the item: ${e}`));
            }
        });
    }
    delete() {
        return new Promise((resolve, reject) => {
            const container = this.__metadata.container;
            const containerName = this.__metadata.container.id;
            const id = this.__metadata.id;
            const sqlStatement = `delete from ${containerName} WHERE id=$id`;
            try {
                container.pipe.serialize(() => {
                    container.pipe.run(sqlStatement, { $id: id }, function (err) {
                        if (!err) {
                            resolve("OK");
                        }
                        else {
                            reject(new Error(`Error deleting item ${id} from ${containerName}: ${err} \n ${sqlStatement}`));
                        }
                    });
                });
            }
            catch (e) {
                reject(new Error(`[sqlite3] Error getting the item: ${e}`));
            }
        });
    }
    create() {
        return new Promise((resolve, reject) => {
            const container = this.__metadata.container;
            const containerName = this.__metadata.container.id;
            const id = this.__metadata.id;
            const sqlStatement = `insert or ignore into ${containerName} (${this.__metadata.fields.join(",")}) VALUES (${this.__metadata.fields.map((f) => `$${f}`).join(",")})`;
            try {
                container.pipe.serialize(() => {
                    container.pipe.run(sqlStatement, this.__metadata.prepareValues, function (err) {
                        if (!err) {
                            qcobjects_1.logger.info(`[sqlite3][Item][create] OK creating item with id ${id}`);
                            resolve("OK");
                        }
                        else {
                            reject(new Error(`Error inserting item ${id} from ${containerName}: ${err} \n ${sqlStatement}`));
                        }
                    });
                });
            }
            catch (e) {
                reject(new Error(`[sqlite3] Error inserting the item: ${e}`));
            }
        });
    }
    update() {
        return new Promise((resolve, reject) => {
            const container = this.__metadata.container;
            const containerName = this.__metadata.container.id;
            const id = this.__metadata.id;
            const sqlStatement = `update ${containerName} set ${this.__metadata.fields.map(f => `${f}=$${f}`).join(",")} where id=$id;`;
            try {
                container.pipe.serialize(() => {
                    container.pipe.run(sqlStatement, this.__metadata.prepareValues, function (err) {
                        if (!err) {
                            qcobjects_1.logger.info(`[sqlite3][Item][update] OK updating item with id ${id}`);
                            resolve("OK");
                        }
                        else {
                            reject(new Error(`Error updating item ${id} from ${containerName}: ${err} \n ${sqlStatement}`));
                        }
                    });
                });
            }
            catch (e) {
                reject(new Error(`[sqlite3] Error updating the item: ${e}`));
            }
        });
    }
}
class ContainersHandler {
    constructor(database) {
        this.database = database;
        this.__containers = {};
    }
    createIfNotExists({ id, containerFields }) {
        if (containerFields === null) {
            containerFields = "id INTEGER PRIMARY KEY, data TEXT";
        }
        const sqlStatement = `create table if not exists ${id} (${containerFields});`;
        qcobjects_1.logger.info(`SQLITE3: ${sqlStatement}`);
        let container;
        this.database.pipe.run(sqlStatement, (err) => {
            if (!err) {
                container = new SQLite3Container({ pipe: this.database.pipe, id, containerFields });
                this.__containers[id] = container;
            }
            else {
                throw Error(`[sqlite3][container][createIfNotExists] Error creating the container: ${id}`);
            }
        });
        return { container };
    }
    container(id, containerFields = null) {
        if (typeof this.__containers[id] === "undefined") {
            this.createIfNotExists({ id, containerFields });
        }
        return this.__containers[id];
    }
}
class SQLite3Client {
    constructor() {
        this._db_ = null;
        qcobjects_1.logger.info("Instantiating sqlite3 db client...");
        qcobjects_1.logger.info("Instantiating sqlite3 database handler...");
        this.databases = new DatabasesHandler(this);
        qcobjects_1.logger.info("Instantiating sqlite3 database handler... DONE.");
    }
    database(id) {
        if (typeof this.databases.__databases[id] === "undefined") {
            this.databases.createIfNotExists({ id });
        }
        return this.databases.__databases[id];
    }
    dbSerialize(databaseId, sqlquery, prepareValues = null) {
        return new Promise((resolve, reject) => {
            const { pipe } = this.database(databaseId);
            const db = pipe;
            db.serialize(() => {
                db.all(sqlquery, prepareValues, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
            });
        });
    }
    close() {
        this._db_
            .close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Close the database connection.");
        });
    }
}
class DBHandler {
    constructor(client, pipe, id) {
        this.client = client;
        this.pipe = pipe;
        this.id = id;
        qcobjects_1.logger.info("Instantiating sqlite3 container handler...");
        this.containers = new ContainersHandler(this);
        qcobjects_1.logger.info("Instantiating sqlite3 container handler... DONE.");
        qcobjects_1.logger.info("Instantiating sqlite3 db client... DONE.");
    }
    container(id, containerFields = null) {
        return this.containers.container(id, containerFields);
    }
}
class DatabasesHandler {
    constructor(client) {
        this.client = client;
        this.__databases = {};
    }
    createIfNotExists(database) {
        const client = this.client;
        const { id } = database;
        qcobjects_1.logger.info(`[databases][createIfNotExists] Create ${id}`);
        return new Promise((resolve, reject) => {
            qcobjects_1.logger.info(`Creating Database: ${id}`);
            const databaseName = `${id}.sqlite`;
            qcobjects_1.logger.info(`Creating DatabaseName: ${node_path_1.default.resolve(`./${databaseName}`)}`);
            try {
                const db = new sqlite3_1.Database(node_path_1.default.resolve(`./${databaseName}`), sqlite3_1.OPEN_READWRITE, (err) => {
                    if (err) {
                        throw new Error(`[sqlite3][database][createIfNotExists] Error creating database: ${err}`);
                    }
                    qcobjects_1.logger.info("Connected to the SQlite database.");
                });
                client._db_ = db;
                this.__databases[id] = new DBHandler(client, db, id);
                qcobjects_1.logger.info(`[databases][createIfNotExists] Create ${id}... DONE.`);
            }
            catch (e) {
                reject(new Error(`[sqlite3][database] Error: ${e}`));
            }
            resolve(client);
        })
            .catch(e => {
            qcobjects_1.logger.info(`[databases][createIfNotExists] Error creating ${id}: ${e}.`);
        });
    }
}
class SQLite3Gateway extends qcobjects_1.InheritClass {
    close() {
        this.getClient().close();
    }
    getClient() {
        return SQLite3Gateway.getClient();
    }
    static getClient() {
        if (typeof SQLite3Gateway.__client === "undefined") {
            SQLite3Gateway.__client = new SQLite3Client();
        }
        return SQLite3Gateway.__client;
    }
    createDatabase(databaseId) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.getClient()
                    .database(databaseId));
            }
            catch (e) {
                reject(new Error(`[sqlite3][database] Error obtaining access to database: ${e}`));
            }
        });
    }
    createContainer(databaseId, containerId, containerFields = null) {
        return new Promise((resolve, reject) => {
            resolve(this.getClient()
                .database(databaseId)
                .container(containerId, containerFields));
        });
    }
    readContainer(databaseId, containerId, containerFields = null) {
        return new Promise((resolve, reject) => {
            resolve(this.getClient()
                .database(databaseId)
                .container(containerId, containerFields));
        });
    }
    createFamilyItem(databaseId, containerId, item) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.getClient()
                    .database(databaseId)
                    .container(containerId)
                    .item(item)
                    .create());
            }
            catch (e) {
                reject(new Error(`[sqlite3][gateway][createFamilyItem] Error creating family item: ${e}`));
            }
        });
    }
    updateFamilyItem(databaseId, containerId, item) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.getClient()
                    .database(databaseId)
                    .container(containerId)
                    .item(item)
                    .update());
            }
            catch (e) {
                reject(new Error(`[sqlite3][gateway][createFamilyItem] Error creating family item: ${e}`));
            }
        });
    }
    getFamilyItem(databaseId, containerId, item) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.getClient()
                    .database(databaseId)
                    .container(containerId)
                    .item(item)
                    .get());
            }
            catch (e) {
                reject(new Error(`[sqlite3][gateway][getFamilyItem] Error getting family item: ${e}`));
            }
        });
    }
    queryContainer(databaseId, containerId, sqlQuery, prepareValues) {
        return new Promise((resolve, reject) => {
            try {
                qcobjects_1.logger.info("[sqlite3][gateway][queryContainer]");
                resolve(this.getClient()
                    .database(databaseId)
                    .container(containerId)
                    .query(sqlQuery, prepareValues));
            }
            catch (e) {
                reject(new Error(`[sqlite3][gateway][queryContainer] ${e}`));
            }
        });
    }
    deleteFamilyItem(databaseId, containerId, item) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.getClient()
                    .database(databaseId)
                    .container(containerId)
                    .delete(item));
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.default = SQLite3Gateway;
