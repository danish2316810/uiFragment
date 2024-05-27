/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"danui5stand/ui5project/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
