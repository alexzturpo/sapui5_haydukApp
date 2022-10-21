sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("apph.aplicacion.controller.vMain", {
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onInit: function () {
                // this.getView().byId("pageSeccion").addStyleClass("bg_imagen_blur");
            },
            onPress1: function () {
                this.getRouter().navTo("Consulta_precio", {
                    layout: sap.f.LayoutType.OneColumn
                });
            },
            navSolicitarPedido: function () { 
                this.getRouter().navTo("Solicitar_pedido");
            },
            onGestionFinanciera: function () { 
                this.getRouter().navTo("Solicitar_pedido");
            },
            navEstadoCuenta: function () { 
                this.getRouter().navTo("Estado_cuenta");
            },
            navFacturaCliente: function () { 
                this.getRouter().navTo("Factura_cliente");
            },
            navPresentarReclamo: function () { 
                this.getRouter().navTo("Presentar_reclamo");
            },
            navSeguimientoReclamo: function () { 
                this.getRouter().navTo("Seguimiento_reclamo");
            },
            navAtencionReclamo: function () { 
                this.getRouter().navTo("Atencion_reclamo");
            },
            navSeguimientoPedido: function () { 
                this.getRouter().navTo("Seguimiento_Pedido");
            },
        });
    });
