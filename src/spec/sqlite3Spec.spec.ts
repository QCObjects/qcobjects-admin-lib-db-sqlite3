#!/usr/bin/env node
/* eslint-disable no-undef */

import path from "node:path";
import SQLite3Gateway from "../js/packages/com.qcobjects.admin.lib.db.sqlite3";
import { logger } from "qcobjects";
const absolutePath = path.resolve(__dirname, "./");

describe("SQLite3 DB Main Test", function () {

  const gateway = new SQLite3Gateway();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testConfig = require(absolutePath+"/sqlite3TestData.js");

  async function close() {
    gateway.getClient().close();
  }


  const createDatabase = async () => {
    const gateway = new SQLite3Gateway();
    logger.info("[createDatabase]");
    return await gateway.createDatabase("databaseTest");
  };

  const createContainer = async () => {
    const gateway = new SQLite3Gateway();
    logger.info("[createContainer]");
    return await gateway.createContainer("databaseTest", "tabletest", "id text primary key,partitionKey,Country,parents,children,address,isRegistered,lastName");
  };

  const readContainer = async () => {
    const gateway = new SQLite3Gateway();
    logger.info("[readContainer]");
    return await gateway.readContainer("databaseTest", "tabletest");
  };

  const createFamilyItem = async (item: any) => {
    const gateway = new SQLite3Gateway();
    logger.info("[createFamilyItem]");
    return await gateway.createFamilyItem("databaseTest", "tabletest", item);
  };

  const updateFamilyItem = async (item: any) => {
    const gateway = new SQLite3Gateway();
    logger.info("[createFamilyItem]");
    return await gateway.createFamilyItem("databaseTest", "tabletest", item);
  };


  const getFamilyItem = async (item: any) => {
    const gateway = new SQLite3Gateway();
    logger.info("[getFamilyItem]");
    return await gateway.getFamilyItem("databaseTest", "tabletest", item);
  };


  const queryContainer = async () => {
    const gateway = new SQLite3Gateway();
    logger.info("[queryContainer]");
    return await gateway.queryContainer("databaseTest", "tabletest", `
      SELECT rowId,id,partitionKey,Country,parents,children,address,isRegistered,lastName from tabletest;
    `,{});
  };

  const dbSerialize = async () => {
    const gateway = new SQLite3Gateway();
    logger.info("[queryContainer]");
    return await gateway.getClient().dbSerialize("databaseTest",
    `
      SELECT rowId,id,partitionKey,Country,parents,children,address,isRegistered,lastName from tabletest;
    `,{});
  };


  const deleteFamilyItem = async (item: any) => {
    const gateway = new SQLite3Gateway();
    logger.info("[deleteFamilyItem]");
    return await gateway.deleteFamilyItem("databaseTest", "tabletest", item);
  };


  it("SQLite3 Test Spec CreateDatabase", function (done) {

      createDatabase()
      .then((result) => {
        console.log(result);
        console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
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
      console.log ("Success");
      done();
    })
    .catch(error => {
      done();
      throw new Error(error.message);
    });
  
  });

  
});

