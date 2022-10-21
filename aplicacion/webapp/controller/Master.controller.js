
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("apph.aplicacion.controller.Master", {
		onInit: function () {

		},
        pressHome: function () {
			this.getRouter().navTo("Menu", {
				layout: sap.f.LayoutType.OneColumn
			});
		},
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
	});
});