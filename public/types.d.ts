#!/usr/bin/env node
/// <reference types="qcobjects" />
declare module "js/config" { }
declare module "js/packages/com.qcobjects.admin.lib.db.sqlite3" {
    import { InheritClass } from "qcobjects";
    class SQLite3Container {
        pipe: any;
        id: string;
        items: any[];
        containerFields: string | null | undefined;
        constructor({ pipe, id, containerFields }: {
            pipe: any;
            id: string;
            containerFields: string | null | undefined;
        });
        setItems(items: Item[]): void;
        item(item: Item): Item;
        query(sqlQuery: string, prepareValues: any): Promise<unknown>;
        delete(itemParams: any): Promise<unknown>;
    }
    class Item {
        __metadata: {
            id: string;
            rowId?: string;
            fields: any[];
            prepareValues: any;
            container: SQLite3Container;
        };
        constructor(container: SQLite3Container, item: any);
        buildObject(item: any): this;
        castValue(key: string, value: any): any;
        get(): Promise<unknown>;
        delete(): Promise<unknown>;
        create(): Promise<unknown>;
        update(): Promise<unknown>;
    }
    class SQLite3Client {
        _db_: any;
        databases: any;
        constructor();
        database(id: string): any;
        dbSerialize(databaseId: string, sqlquery: string, prepareValues?: any | null | undefined): Promise<unknown>;
        close(): void;
    }
    class SQLite3Gateway extends InheritClass {
        static __client: SQLite3Client;
        close(): void;
        getClient(): SQLite3Client;
        static getClient(): SQLite3Client;
        createDatabase(databaseId: string): Promise<unknown>;
        createContainer(databaseId: string, containerId: string, containerFields?: string | null): Promise<unknown>;
        readContainer(databaseId: string, containerId: string, containerFields?: string | null): Promise<unknown>;
        createFamilyItem(databaseId: string, containerId: string, item: Item | any): Promise<unknown>;
        updateFamilyItem(databaseId: string, containerId: string, item: Item | any): Promise<unknown>;
        getFamilyItem(databaseId: string, containerId: string, item: Item | any): Promise<unknown>;
        queryContainer(databaseId: string, containerId: string, sqlQuery: string, prepareValues: any): Promise<unknown>;
        deleteFamilyItem(databaseId: string, containerId: string, item: Item | any): Promise<unknown>;
    }
    export default SQLite3Gateway;
}
declare module "js/package" { }
declare module "js/index" {
    import "js/config";
    import SQLite3Gateway from "js/packages/com.qcobjects.admin.lib.db.sqlite3";
    import "js/package";
    const _default: {
        SQLite3Gateway: typeof SQLite3Gateway;
    };
    export default _default;
}
declare module "spec/sqlite3Spec.spec" { }
declare module "spec/testsSpec.spec" { }
