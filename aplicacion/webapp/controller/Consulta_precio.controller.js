sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("apph.aplicacion.controller.Consulta_precio", {
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        }, 
		onInit: function () {

		},
        pressHome: function () {
            console.log("pressHome");
            this.getRouter().getTargets().display("TargetvMain");
		}, 
        
	});
});