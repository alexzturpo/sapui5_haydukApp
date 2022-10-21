
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("apph.aplicacion.controller.Solicitar_pedido", {
		onInit: function () {
            this.getView().byId("pageSeccion").addStyleClass("bg_imagen_blur");
		},
        pressHome: function () {
			this.getRouter().getTargets().display("TargetvMain");
		},
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
	});
});