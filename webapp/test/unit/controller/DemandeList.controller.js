/*global QUnit*/

sap.ui.define([
	"comep/comep/controller/DemandeList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("DemandeList Controller");

	QUnit.test("I should test the DemandeList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
