# QCObjects Admin Lib Db SQLite3

QCObjects Admin Lib for working with SQLite3 Database.

## Instructions

1. Install this dependency in your project using npm

```shell
npm i --save qcobjects-admin-lib-db-sqlite3
```

2. In your config.json file, create the following settings

```shell
    "backend":{
      "db_engine":{
        "name":"sqlite3",
        "databaseName":"admin.db"
      }, ...
```

1. Test the integration

```shell
npm test
```

4. Start the QCObjects HTTP2 Server

```shell
qcobjects-server
```
If you haven't installed QCObjects before, learn more about [Installing QCObjects here](https://docs.qcobjects.org/#installing)
