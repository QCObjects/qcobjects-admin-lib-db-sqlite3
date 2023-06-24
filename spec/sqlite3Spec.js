/* eslint-disable no-undef */
const path = require("path");
const { SQLite3Gateway } = require("../api/com.qcobjects.admin.db.sqlite3.gateway");
const absolutePath = path.resolve(__dirname, "./");

describe("SQLite3 DB Main Test", function () {
  var originalTimeout;

  beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  });

  const gateway = new SQLite3Gateway();

  const testConfig = require(absolutePath+"/sqlite3TestData.js");

  const databaseId = testConfig.database.id;

  /**
   * Cleanup the database and collection on completion
   */
  async function cleanup() {
    const gateway = new SQLite3Gateway();
    await gateway.database(databaseId).delete();
  }

  async function close() {
    gateway.getClient().close("databseTest");
  }


  /**
   * Exit the app with a prompt
   * @param {string} message - The message to display
   */
  function exit(message) {
    console.log(message);
    console.log("Press any key to exit");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", process.exit.bind(process, 0));
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

  const createFamilyItem = async (item) => {
    const gateway = new SQLite3Gateway();
    logger.info("[createFamilyItem]");
    return await gateway.createFamilyItem("databaseTest", "tabletest", item);
  };

  const updateFamilyItem = async (item) => {
    const gateway = new SQLite3Gateway();
    logger.info("[createFamilyItem]");
    return await gateway.createFamilyItem("databaseTest", "tabletest", item);
  };


  const getFamilyItem = async (item) => {
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


  const deleteFamilyItem = async (item) => {
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

