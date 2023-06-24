#!/usr/bin/env node
/* eslint-disable no-undef */

import { __getType__ , ClassFactory, logger, New, Component, Effect, InheritClass, Package, global, GLOBAL } from "qcobjects";
type _GLOBAL = GLOBAL & {
  __definition:never;
}


describe("QCObjects Main Test", function () {

  it("Class Declaration Test Spec", function () {
    class Main extends InheritClass {
    }
    Package("main", [
      Main
    ]);

    expect(Main).toEqual(ClassFactory("Main"));
    logger.debug("Class Declaration Test Spec... OK");
  });

  it("Main intance Test Spec", function () {
    class Main extends InheritClass {
    }
    const __main__ = New(Main, {});
    expect(typeof __main__.__instanceID).toEqual("number");
    expect(__getType__(__main__)).toEqual("Main");
    logger.debug("Main intance Test Spec... OK");
  });

  it("Existence of Component Class", function () {
    expect(Component).toEqual(ClassFactory("Component"));
    logger.debug("Existence of Component Class... OK");
  });

  it("Existence of Effect Class", function () {
    expect(Effect).toEqual(ClassFactory("Effect"));
    logger.debug("Existence of Effect Class... OK");
  });

  it("global as QCObjects global", function () {
    expect(typeof (global as _GLOBAL).__definition).toEqual("object");
    logger.debug("global as QCObjects global... OK");
  });

  it("Existence of QCObjects SDK", function () {
    expect(Object.hasOwnProperty.call(global, "_sdk_")).toEqual(true);
    logger.debug("Existence of QCObjects SDK... OK");
  });
});
