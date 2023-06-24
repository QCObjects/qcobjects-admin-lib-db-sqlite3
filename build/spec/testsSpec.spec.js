#!/usr/bin/env node
"use strict";
/* eslint-disable no-undef */
Object.defineProperty(exports, "__esModule", { value: true });
const qcobjects_1 = require("qcobjects");
describe("QCObjects Main Test", function () {
    it("Class Declaration Test Spec", function () {
        class Main extends qcobjects_1.InheritClass {
        }
        (0, qcobjects_1.Package)("main", [
            Main
        ]);
        expect(Main).toEqual((0, qcobjects_1.ClassFactory)("Main"));
        qcobjects_1.logger.debug("Class Declaration Test Spec... OK");
    });
    it("Main intance Test Spec", function () {
        class Main extends qcobjects_1.InheritClass {
        }
        const __main__ = (0, qcobjects_1.New)(Main, {});
        expect(typeof __main__.__instanceID).toEqual("number");
        expect((0, qcobjects_1.__getType__)(__main__)).toEqual("Main");
        qcobjects_1.logger.debug("Main intance Test Spec... OK");
    });
    it("Existence of Component Class", function () {
        expect(qcobjects_1.Component).toEqual((0, qcobjects_1.ClassFactory)("Component"));
        qcobjects_1.logger.debug("Existence of Component Class... OK");
    });
    it("Existence of Effect Class", function () {
        expect(qcobjects_1.Effect).toEqual((0, qcobjects_1.ClassFactory)("Effect"));
        qcobjects_1.logger.debug("Existence of Effect Class... OK");
    });
    it("global as QCObjects global", function () {
        expect(typeof qcobjects_1.global.__definition).toEqual("object");
        qcobjects_1.logger.debug("global as QCObjects global... OK");
    });
    it("Existence of QCObjects SDK", function () {
        expect(Object.hasOwnProperty.call(qcobjects_1.global, "_sdk_")).toEqual(true);
        qcobjects_1.logger.debug("Existence of QCObjects SDK... OK");
    });
});
