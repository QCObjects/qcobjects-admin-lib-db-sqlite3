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
import { InheritClass, logger } from "qcobjects";
import path from "node:path";
import { Database, OPEN_READWRITE } from "sqlite3";
import { existsSync, writeFileSync } from "node:fs";

class SQLite3Container {
  pipe:any;
  id:string;
  items:any[];
  containerFields:string|null|undefined;
  
  constructor({pipe, id, containerFields}:{pipe:any, id:string, containerFields:string|null|undefined}){

    this.pipe = pipe;
    this.id = id;
    this.containerFields = containerFields;
    this.items = [];
  }

  setItems (items:Item[]){
    this.items = items;
  }

  item(item:Item){
    return new Item(this, item);
  }

  query(sqlQuery:string, prepareValues:any){
    return new Promise ((resolve, reject) => {
      try {
        this.pipe.serialize(() => {
          this.pipe.all(sqlQuery, prepareValues, (err:any, rows:any[]) => {
            if (!err){
              const result = rows.map((row)=>this.item(row));
              resolve(result);
            } else {
              reject(new Error(`[sqlite3] Error: ${err}`));
            }
          });
        });
      } catch (e){
        reject(new Error (`[sqlite3] Error querying the container: ${e}`));
      }
    });
  }

  delete (itemParams:any){
    const item = new Item (this, itemParams);
    return item.delete();
  }
  
}

class Item {
  __metadata:{id:string,rowId?:string,fields:any[],prepareValues:any, container:SQLite3Container};

  constructor(container:SQLite3Container, item:any){
    const fields = Object.keys(item);
    this.__metadata = {
      id:item.id,
      rowId:item.rowId,
      fields,
      prepareValues:{},
      container
    };
    this.buildObject(item);
  }

  buildObject(item:any) {
    this.__metadata.fields.map((k) => {
      this[k as keyof typeof this] = item[k];
      this.__metadata.prepareValues[`$${k}`] = this.castValue(k,item[k]);
      return k;
    });
    return this;
  }

  castValue(key:string,value:any){
    let _ret_;
    if (typeof value === "object"){
      _ret_ = JSON.stringify(value);
    } else {
      _ret_ = value;
    }
    return _ret_;
  }

  get (){
    return new Promise ((resolve, reject) => {
      const container = this.__metadata.container;
      const db = container.pipe;
      const containerName = this.__metadata.container.id;
      const id = this.__metadata.id;
      const sqlStatement = `select ${this.__metadata.fields.join(",")} from ${containerName} where id=$id;`;
      try {
        db.serialize(() => {
          db.all(sqlStatement, {$id:id}, (err:any, rows:any[]) => {
            if (!err){
              const item = this.buildObject(rows.pop());
              console.log(item);
              resolve(item);
            } else {
              reject(new Error (`Error getting item ${id} from ${containerName}: ${err} \n ${sqlStatement}`));
            }
          });
        });
      } catch (e){
        reject(new Error (`[sqlite3] Error getting the item: ${e}`));
      }
    });
  }

  delete (){
    return new Promise ((resolve, reject) => {
      const container = this.__metadata.container;
      const containerName = this.__metadata.container.id;
      const id = this.__metadata.id;
      const sqlStatement = `delete from ${containerName} WHERE id=$id`;
      try {
        container.pipe.serialize(() => {
          container.pipe.run(sqlStatement, {$id: id} , function(err:any) {
            if (!err){
              resolve("OK");
            } else {
              reject(new Error(`Error deleting item ${id} from ${containerName}: ${err} \n ${sqlStatement}`));
            }
          });
        });
      } catch (e){
        reject(new Error (`[sqlite3] Error getting the item: ${e}`));
      }
    });
  }

  create (){
    return new Promise ((resolve, reject) => {
      const container = this.__metadata.container;
      const containerName = this.__metadata.container.id;
      const id = this.__metadata.id;
      const sqlStatement = `insert or ignore into ${containerName} (${this.__metadata.fields.join(",")}) VALUES (${this.__metadata.fields.map((f)=> `$${f}` ).join(",")})`;
      try {
        container.pipe.serialize(() => {
          container.pipe.run(sqlStatement, this.__metadata.prepareValues, function(err:any) {
            if (!err){
              logger.info(`[sqlite3][Item][create] OK creating item with id ${id}`);
              resolve("OK");
            } else {
              reject(new Error(`Error inserting item ${id} from ${containerName}: ${err} \n ${sqlStatement}`));
            }
          });
        });
      } catch (e){
        reject(new Error(`[sqlite3] Error inserting the item: ${e}`));
      }
    });
  }

  update (){
    return new Promise ((resolve, reject) => {
      const container = this.__metadata.container;
      const containerName = this.__metadata.container.id;
      const id = this.__metadata.id;
      const sqlStatement = `update ${containerName} set ${this.__metadata.fields.map(f=>`${f}=$${f}`).join(",")} where id=$id;`;
      try {
        container.pipe.serialize(() => {
          container.pipe.run(sqlStatement, this.__metadata.prepareValues, function(err:any) {
            if (!err){
              logger.info(`[sqlite3][Item][update] OK updating item with id ${id}`);
              resolve("OK");
            } else {
              reject(new Error(`Error updating item ${id} from ${containerName}: ${err} \n ${sqlStatement}`));
            }
          });
        });
      } catch (e){
        reject(new Error(`[sqlite3] Error updating the item: ${e}`));
      }
    });
  }
  
}


class ContainersHandler {
  database:any;
  __containers:any;
  constructor (database:any){
    this.database = database;
    this.__containers = {};
  }

  createIfNotExists({id, containerFields}:{id:string,containerFields:string|null}) {
    if (containerFields === null){
      containerFields = "id INTEGER PRIMARY KEY, data TEXT";
    }

    const sqlStatement = `create table if not exists ${id} (${containerFields});`;
    logger.info(`SQLITE3: ${sqlStatement}`);
    let container;
    this.database.pipe.run(sqlStatement, (err:any) => {
      if (!err){
        container = new SQLite3Container({pipe:this.database.pipe, id, containerFields});
        this.__containers[id] = container;
      } else {
        throw Error (`[sqlite3][container][createIfNotExists] Error creating the container: ${id}`);
      }
    });

    return {container};
  }

  container(id:string, containerFields:string|null = null){
    if (typeof this.__containers[id] === "undefined"){
      this.createIfNotExists({id, containerFields});
    }
    return this.__containers[id];
  }

}

class SQLite3Client {
  _db_:any;
  databases:any;

  constructor(){
    this._db_ = null;

    logger.info("Instantiating sqlite3 db client...");

    logger.info("Instantiating sqlite3 database handler...");

    this.databases = new DatabasesHandler(this);
    logger.info("Instantiating sqlite3 database handler... DONE.");

  }

  database(id:string){
    if (typeof this.databases.__databases[id] === "undefined"){
      this.databases.createIfNotExists({id});
    }
    return this.databases.__databases[id];
  }

  dbSerialize (databaseId:string, sqlquery:string, prepareValues:any|null|undefined = null){
    return new Promise((resolve, reject)=> {
      const {pipe} = this.database(databaseId);
      const db = pipe;
      db.serialize(() => {
        db.all(sqlquery, prepareValues, (err:any, rows:any[]) => {
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
    .close((err:any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  }


}


class DBHandler {
  client:SQLite3Client;
  pipe:any;
  id:string;
  containers:ContainersHandler;

  constructor(client:SQLite3Client, pipe:any, id:string){
    this.client = client;
    this.pipe = pipe;
    this.id = id;

    logger.info("Instantiating sqlite3 container handler...");
    this.containers = new ContainersHandler(this);
    logger.info("Instantiating sqlite3 container handler... DONE.");

    logger.info("Instantiating sqlite3 db client... DONE.");

  }

  container (id:string, containerFields:string|null = null){
    return this.containers.container(id, containerFields);
  }
}

class DatabasesHandler {
  client:SQLite3Client;
  __databases:any;

  constructor (client:SQLite3Client){
    this.client = client;
    this.__databases = {};

  }

  createIfNotExists(database:any){
    
    const client = this.client;
    const {id} = database;
    logger.info(`[databases][createIfNotExists] Create ${id}`);
    return new Promise ((resolve, reject)=> {
      logger.info(`Creating Database: ${id}`);
      const databaseName = `${id}.sqlite`;
      logger.info(`Creating DatabaseName: ${path.resolve(`./${databaseName}`)}`);
      try {
        const databasePath = path.resolve(`./${databaseName}`);
        if (!existsSync(databasePath)){
          writeFileSync(databasePath, "");
        }
        const db = new Database(databasePath, OPEN_READWRITE, (err:any) => {
          if (err) {
            throw new Error(`[sqlite3][database][createIfNotExists] Error creating database: ${err}`);
          }
          logger.info("Connected to the SQlite database.");
        });
        client._db_ = db;
        this.__databases[id] = new DBHandler(client, db, id);
        logger.info(`[databases][createIfNotExists] Create ${id}... DONE.`);

      } catch (e){
        reject(new Error (`[sqlite3][database] Error: ${e}`));
      }

      resolve(client);
    })
    .catch (e=>{
      logger.info(`[databases][createIfNotExists] Error creating ${id}: ${e}.`);
    });
  }
}

class SQLite3Gateway extends InheritClass {

  static __client:SQLite3Client;

  close(){
    this.getClient().close();
  }

  getClient (){
    return SQLite3Gateway.getClient();
  }

  static getClient(){

    if (typeof SQLite3Gateway.__client === "undefined"){
      SQLite3Gateway.__client = new SQLite3Client();
    }
    return SQLite3Gateway.__client;
  }


  createDatabase(databaseId:string){
    return new Promise ((resolve, reject)=> {
      try {
        resolve(this.getClient()
        .database(databaseId));
      } catch (e) {
        reject(new Error(`[sqlite3][database] Error obtaining access to database: ${e}`));
      }
    });
  }

  createContainer (databaseId:string, containerId:string, containerFields:string|null = null){
    return new Promise ((resolve, reject)=> {
      resolve(
        this.getClient()
        .database(databaseId)
        .container(containerId, containerFields)
      );
    });
  }

  readContainer (databaseId:string, containerId:string, containerFields:string|null = null){
    return new Promise ((resolve, reject)=> {
      resolve(
        this.getClient()
        .database(databaseId)
        .container(containerId, containerFields)
      );
    });
  }

  createFamilyItem(databaseId:string, containerId:string, item:Item|any){
    return new Promise ((resolve, reject)=> {
      try {
        resolve(
          this.getClient()
          .database(databaseId)
          .container(containerId)
          .item(item)
          .create()
        );
  
      } catch (e){
        reject(new Error (`[sqlite3][gateway][createFamilyItem] Error creating family item: ${e}`));
      }
    });
  }

  updateFamilyItem(databaseId:string, containerId:string, item:Item|any){
    return new Promise ((resolve, reject)=> {
      try {
        resolve(
          this.getClient()
          .database(databaseId)
          .container(containerId)
          .item(item)
          .update()
        );
  
      } catch (e){
        reject(new Error(`[sqlite3][gateway][createFamilyItem] Error creating family item: ${e}`));
      }
    });
  }


  getFamilyItem(databaseId:string, containerId:string, item:Item|any){
    return new Promise ((resolve, reject)=> {
      try {
        resolve(
          this.getClient()
          .database(databaseId)
          .container(containerId)
          .item(item)
          .get()
        );
  
      } catch (e){
        reject(new Error(`[sqlite3][gateway][getFamilyItem] Error getting family item: ${e}`));
      }
    });
  }

  
  queryContainer(databaseId:string, containerId:string, sqlQuery:string, prepareValues:any) {
    return new Promise ((resolve, reject)=> {
      try {
        logger.info("[sqlite3][gateway][queryContainer]");
        resolve(
          this.getClient()
          .database(databaseId)
          .container(containerId)
          .query(sqlQuery, prepareValues)
        );
      } catch (e){
        reject (new Error(`[sqlite3][gateway][queryContainer] ${e}`));
      }
    });
  }

  deleteFamilyItem(databaseId:string, containerId:string, item:Item|any){
    return new Promise ((resolve, reject)=> {
      try {
        resolve(
          this.getClient()
          .database(databaseId)
          .container(containerId)
          .delete(item)
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  
}

export default SQLite3Gateway;