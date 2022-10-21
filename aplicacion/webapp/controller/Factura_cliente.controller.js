
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("apph.aplicacion.controller.Factura_cliente", {
		onInit: function () {

		},
        pressHome: function () {
			this.getRouter().getTargets().display("TargetvMain");
		},
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
	});
});