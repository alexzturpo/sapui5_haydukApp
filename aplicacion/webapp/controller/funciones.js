sap.ui.define([
	'sap/m/MessageBox',
	'sap/m/library',
	"sap/m/DialogType"
], function (MessageBox, library, DialogType) {
	"use strict";

	var ButtonType = library.ButtonType,
		PlacementType = library.PlacementType;
	var iTimeoutId;
	var oMessageTemplate = new sap.m.MessagePopoverItem({
		type: '{type}',
		title: '{title}',
		// description: '{description}',
		subtitle: '{subtitle}',
		counter: '{counter}',
		groupName: '{group}'
			// link: oLink
	});

	var Formato = {

		oDialogError: function (that) {
			var oModel = that.getView().getModel("oModel");
			var oMessageTemplate = new sap.m.MessageItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}',
				markupDescription: '{markupDescription}'
			});
			that.oMessageView = new sap.m.MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "/LISTA_ERRORES",
					template: oMessageTemplate
				}
			});
			var oBackButton = new sap.m.Button({
				icon: sap.ui.core.IconPool.getIconURI("nav-back"),
				visible: false,
				press: function () {
					that.oMessageView.navigateBack();
					this.setVisible(false);
				}
			});
			that.oMessageView.setModel(oModel);
			that.oDialog = new sap.m.Dialog({
				resizable: true,
				content: that.oMessageView,
				state: 'Error',
				beginButton: new sap.m.Button({
					press: function () {
						this.getParent().close();
					},
					text: "Cerrar"
				}),
				customHeader: new sap.m.Bar({
					contentMiddle: [
						new sap.m.Text({
							text: "Error"
						})
					],
					contentLeft: [oBackButton]
				}),
				contentHeight: "50%",
				contentWidth: "50%",
				verticalScrolling: false
			});
			that.getView().addDependent(that.oDialog);
		},
		fnGetRegion: function () {
			//console.log("HIiiii");
			var oModel = this.getView().getModel("oModel");
		},
		fnValidDate: function (date) {
			var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
			if (!date.match(reg) && new Date(date) == 'Invalid Date') {
				return false;
			} else {
				return true;
			}
		},
		isNormalInteger: function (str) {
			str = str.trim();
			if (!str) {
				return false;
			}
			str = str.replace(/^0+/, "") || "0";
			var n = Math.floor(Number(str));
			return n !== Infinity && String(n) === str && n >= 0;
		},
		isFloat: function (str) {
			str = str.trim();
			if (!str) {
				return false;
			}
			str = str.replace(/^0+/, "") || "0";
			var decimal = /^[+]?[0-9]+\.[0-9]+$/;
			if (str.match(decimal)) {
				return true;
			}else{
				return false;
			}
		},
		onMenuDerecha: function (that, oEvent) {
			var oModel = that.getView().getModel("oModel");
			var visible = false;
			// //console.log(oModel.getProperty("/DATOS_USUARIO/PERFIL"));
			if (oModel.getProperty("/DATOS_USUARIO/PERFIL") == 'PF1') {
				visible = true;
			}
			var vthis = this;
			var oPopover = new sap.m.Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new sap.m.Button({
						visible: visible,
						text: 'Administrador',
						type: ButtonType.Transparent,
						icon: 'sap-icon://key-user-settings',
						press: function () {
							vthis.fnNavAdministrador(that);
						}
					}),
					new sap.m.Button({
						text: 'Información',
						type: ButtonType.Transparent,
						icon: 'sap-icon://information',
						press: function () {
							vthis.fnInformacion(that);
						}
					}),
					new sap.m.Button({
						text: 'Persona de contacto',
						type: ButtonType.Transparent,
						icon: 'sap-icon://add-contact',
						press: function () {
							vthis.fnPersonaContacto(that);
						}
					}),
					new sap.m.Button({
						text: 'Cerrar sesión',
						icon: "sap-icon://log",
						press: function () {
							vthis.logUserOut(that);
						},
						type: ButtonType.Transparent
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover clsPopOver');

			oPopover.openBy(oEvent.getSource());
		},
		logUserOut: function (that) {
			var oModel = that.getView().getModel("oModel");
			var empty = [];
			oModel.setProperty("/", empty);
			that.getRouter().navTo("Login", {
				layout: sap.f.LayoutType.OneColumn
			});
		},
		fnNavAdministrador: function (that) {
			that.getRouter().navTo("Conf_administrador", {
				layout: sap.f.LayoutType.OneColumn
			});
		},
		fnValidatOFecha: function (d) {
			if (Object.prototype.toString.call(d) === "[object Date]") {
				// it is a date
				if (isNaN(d.getTime())) {
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},
		fnValidarFecha: function (date) {
			var m = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
			return (m) ? new Date(m[3], m[2] - 1, m[1]) : null;
		},
		simulateServerRequest: function (vthis) {
			// simulate a longer running operation
			iTimeoutId = setTimeout(function () {
				// this._pBusyDialog.then(function(oBusyDialog) {
				oBusyDialog.close();
				// });
			}.bind(vthis), 3000);
		},
		fnGetNameUser: function (vthis, user) {
			var oModel = vthis.getView().getModel("oModel");
			var perfil;
			var urlT_TBL = vthis.oModel_DB2.getProperty("/T_USUARIOS");
			var texto = "/BD_CF/mydb" + urlT_TBL + "(USR_LOGIN='" + user + "')";
			var oUsuario = {};
			var aUsuario = [];
			var oEmpty = {};
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					// console.log(response);
					// oUsuario = response.d;
					oUsuario = response;
				},
				error: function (error) {}
			});
			if (oUsuario !== oEmpty) {
				perfil = oUsuario.PERFIL;
			}
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var AMBIENTE = vthis.oModel_DB.getProperty("/AMBIENTE");
			var texto = "/" + AMBIENTE + "/sap/bc/zws_portal_cli/INFOR/" + user + "/" + perfil + "/P03/P04/P05/P06/P07";
			var resultado = [];
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					// console.log(response);
					resultado = response.ITAB;
				},
				error: function (response) {
				}
			});
			var vName = '';
			if(resultado.length > 0){
				vName = resultado[0].NAME1;
			}
			return vName;
		},
		fnGetRegionUser: function (vthis, user) {
			var oModel = vthis.getView().getModel("oModel");
			var perfil;
			var urlT_TBL = vthis.oModel_DB2.getProperty("/T_USUARIOS");
			var texto = "/BD_CF/mydb" + urlT_TBL + "(USR_LOGIN='" + user + "')";
			var oUsuario = {};
			var aUsuario = [];
			var oEmpty = {};
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					// console.log(response);
					//oUsuario = response.d;
					oUsuario = response;
				},
				error: function (error) {}
			});
			if (oUsuario !== oEmpty) {
				perfil = oUsuario.PERFIL;
			}
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var AMBIENTE = vthis.oModel_DB.getProperty("/AMBIENTE");
			var texto = "/" + AMBIENTE + "/sap/bc/zws_portal_cli/INFOR/" + user + "/" + perfil + "/P03/P04/P05/P06/P07";
			var resultado = [];
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					// console.log(response);
					resultado = response.ITAB;
				},
				error: function (response) {
				}
			});
			return resultado[0].BLAND;
		},
		fnGetNameUser2: function (vthis, user) {
			// var othis = this;
			var oModel = vthis.getView().getModel("oModel");
			// var user = oModel.getProperty("/DATOS_USUARIO/USR_LOGIN");
			var perfil;

			// var DMUsuario = oModel.getProperty("/LIST_USER_AUX");
			// var not_found = '';
			// if (DMUsuario.length > 0) {
			// 	var resultDatosUser = DMUsuario.filter(DMUsuario => DMUsuario.USR_LOGIN == user);
			// 	if (resultDatosUser.length > 0) {
			// 		// oObject.USER_NAME = resultDatosUser[0].NOMBRE;
			// 		// return resultDatosUser[0].NOMBRE1;
			// 		perfil = resultDatosUser[0].PERFIL;
			// 	} else {
			// 		not_found = 'X';
			// 	}
			// } else {
			// 	not_found = 'X';
			// }
			// if (not_found == 'X') {
			var urlT_TBL = vthis.oModel_DB2.getProperty("/T_USUARIOS");
			var texto = "/BD_CF/mydb" + urlT_TBL + "(USR_LOGIN='" + user + "')";
			var oUsuario = {};
			var aUsuario = [];
			var oEmpty = {};
			// //console.log(texto);
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					// //console.log(response);
					//oUsuario = response.d;
					oUsuario = response;
				},
				error: function (error) {}
			});
			if (oUsuario !== oEmpty) {
				// oObject.USER_NAME = aUsuario[0].NOMBRE1;
				perfil = oUsuario.PERFIL;
				// DMUsuario.push(oUsuario);
				// oModel.setProperty("/LIST_USER_AUX", DMUsuario);
				// //console.log(oUsuario.NOMBRE1);
				// return oUsuario.NOMBRE1;
			}
			// }

			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var AMBIENTE = vthis.oModel_DB.getProperty("/AMBIENTE");
			var texto = "/" + AMBIENTE + "/sap/bc/zws_portal_cli/INFOR/" + user + "/" + perfil + "/P03/P04/P05/P06/P07";
			// //console.log(texto);
			var resultado = [];
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					// //console.log(response);
					resultado = response.ITAB;
				},
				error: function (response) {
					//console.log(response);
				}
			});
			var vName = resultado[0].NAME1 +' - '+  resultado[0].BU_SORT2;
			return vName;
		},
		fnInformacion: function (vthis) {
			var othis = this;
			var oModel = vthis.getView().getModel("oModel");
			var user = oModel.getProperty("/DATOS_USUARIO/USR_LOGIN");
			var perfil = oModel.getProperty("/DATOS_USUARIO/PERFIL");
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var AMBIENTE = vthis.oModel_DB.getProperty("/AMBIENTE");
			var texto = "/" + AMBIENTE + "/sap/bc/zws_portal_cli/INFOR/" + user + "/" + perfil + "/P03/P04/P05/P06/P07";
			//console.log(texto);
			var resultado = [];
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					resultado = response.ITAB;
				},
				error: function (response) {
					//console.log(response);
					// var DialogError = sap.m.BusyDialog({
					// 	title: "Loading Data",
					// 	text: response.responseText,
					// 	showCancelButton: true,
					// 	close: function(oEvent){
					// 		clearTimeout(iTimeoutId);
					// 	},
					// 	afterClose: function () {
					// 		DialogError.destroy();
					// 		location.reload();
					// 	}
					// })
					// vthis.getView().addDependent(DialogError);
					// DialogError.open();
					// othis.simulateServerRequest(vthis);

					if (response.responseJSON.ITAB) {
						var aError = response.responseJSON.ITAB;
						var aError_T = [];
						var oObject = {};
						var oObject2 = {};
						for (var i = 0; i < aError.length; i++) {
							oObject = aError[i];
							oObject2.type = 'Error';
							oObject2.title = oObject.MESSAGE;
							aError_T.push(oObject2);
						}
						oModel.setProperty("/LISTA_ERRORES", aError_T);
						// return false;
						othis.handleDialogPress(vthis);
					}
					return;
				}
			});
			oModel.setProperty("/PERSONA_INFORMACION", resultado[0]);
			if (perfil == "PF2")
				oModel.setProperty("/PERSONA_INFORMACION/NOMBRE", resultado[0].NAME1 + ' | ' + resultado[0].BU_SORT2);
			else
				oModel.setProperty("/PERSONA_INFORMACION/NOMBRE", resultado[0].NAME1);

			if (!vthis.oDefaultMessageDialog_Inf) {
				vthis.oDefaultMessageDialog_Inf = new sap.m.Dialog({
					type: DialogType.Message,
					title: "Información de usuario",
					content: new sap.ui.layout.Grid({
						defaultSpan: 'XL12 L12 M12 S12',
						content: [
							new sap.m.VBox({
								width: '100%',
								items: [
									new sap.ui.layout.Grid({
										defaultSpan: 'XL4 L4 M4 S4',
										content: [new sap.m.Label({
												design: 'Bold',
												text: 'ID usuario'
											}),
											new sap.m.Label({
												wrapping: true,
												text: '{oModel>/PERSONA_INFORMACION/KUNNR}',
												layoutData: [new sap.ui.layout.GridData({
													span: 'XL8 L8 M8 S8'
												})]
											})
										]
									}),
									new sap.ui.layout.Grid({
										defaultSpan: 'XL4 L4 M4 S4',
										content: [new sap.m.Label({
												design: 'Bold',
												text: 'Nombre'
											}),
											new sap.m.Label({
												wrapping: true,
												text: '{oModel>/PERSONA_INFORMACION/NOMBRE}',
												layoutData: [new sap.ui.layout.GridData({
													span: 'XL8 L8 M8 S8'
												})]
											})
										]
									}),
									new sap.ui.layout.Grid({
										defaultSpan: 'XL4 L4 M4 S4',
										content: [new sap.m.Label({
												design: 'Bold',
												text: 'Email'
											}),
											new sap.m.Label({
												wrapping: true,
												text: '{oModel>/PERSONA_INFORMACION/EMAIL}',
												layoutData: [new sap.ui.layout.GridData({
													span: 'XL8 L8 M8 S8'
												})]
											})
										]
									})
								]
							}),
						]
					}),
					beginButton: new sap.m.Button({
						type: ButtonType.Emphasized,
						text: "Cerrar",
						press: function () {
							vthis.oDefaultMessageDialog_Inf.close();
						}.bind(vthis)
					})
				});
				vthis.getView().addDependent(vthis.oDefaultMessageDialog_Inf);
				vthis.oDefaultMessageDialog_Inf.addStyleClass("clsDialogInformacion");
			}
			vthis.oDefaultMessageDialog_Inf.open();
		},
		fnPersonaContacto: function (vthis) {
			// var vthis = this;
			var oModel = vthis.getView().getModel("oModel");
			var user = oModel.getProperty("/DATOS_USUARIO/USR_LOGIN");
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var AMBIENTE = vthis.oModel_DB.getProperty("/AMBIENTE");
			var texto = "/" + AMBIENTE + "/sap/bc/zws_portal_cli/PECON/" + user + "/P02/P03/P04/P05/P06/P07";
			var resultado = [];
			//console.log(texto);
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					resultado = response.ITAB;
					//console.log(response);
				},
				error: function (response) {
					//console.log(response);
				}
			});
			oModel.setProperty("/PERSONA_CONTACTO", resultado[0]);
			// this = vthis;
			if (!vthis.oDefaultMessageDialog) {
				vthis.oDefaultMessageDialog = new sap.m.Dialog({
					type: DialogType.Message,
					title: "Persona de contacto",
					content: new sap.ui.layout.Grid({
						defaultSpan: 'XL12 L12 M12 S12',
						content: [
							new sap.m.VBox({
								width: '100%',
								items: [
									new sap.ui.layout.Grid({
										defaultSpan: 'XL4 L4 M4 S4',
										content: [
											new sap.m.Label({
												design: 'Bold',
												wrapping: true,
												text: 'DNI'
											}),
											new sap.m.Label({
												wrapping: true,
												text: '{oModel>/PERSONA_CONTACTO/DNI}',
												layoutData: [new sap.ui.layout.GridData({
													span: 'XL8 L8 M8 S8'
												})]
											})
										]
									}),
									new sap.ui.layout.Grid({
										defaultSpan: 'XL4 L4 M4 S4',
										content: [new sap.m.Label({
												design: 'Bold',
												wrapping: true,
												text: 'Nombre'
											}),
											new sap.m.Label({
												wrapping: true,
												text: '{oModel>/PERSONA_CONTACTO/NOMBRE}',
												layoutData: [new sap.ui.layout.GridData({
													span: 'XL8 L8 M8 S8'
												})]
											})
										]
									}),
									new sap.ui.layout.Grid({
										defaultSpan: 'XL4 L4 M4 S4',
										content: [new sap.m.Label({
												design: 'Bold',
												wrapping: true,
												text: 'Teléfono'
											}),
											new sap.m.Label({
												wrapping: true,
												text: '{oModel>/PERSONA_CONTACTO/TELEFONO}',
												layoutData: [new sap.ui.layout.GridData({
													span: 'XL8 L8 M8 S8'
												})]
											})
										]
									}),
									new sap.ui.layout.Grid({
										defaultSpan: 'XL4 L4 M4 S4',
										content: [new sap.m.Label({
												design: 'Bold',
												wrapping: true,
												text: 'Email'
											}),
											new sap.m.Label({
												wrapping: true,
												text: '{oModel>/PERSONA_CONTACTO/EMAIL}',
												layoutData: [new sap.ui.layout.GridData({
													span: 'XL8 L8 M8 S8'
												})]
											})
										]
									})
								]
							}),
						]
					}),
					beginButton: new sap.m.Button({
						type: ButtonType.Emphasized,
						text: "Cerrar",
						press: function () {
							vthis.oDefaultMessageDialog.close();
						}.bind(vthis)
					})
				});
				vthis.getView().addDependent(vthis.oDefaultMessageDialog);
				vthis.oDefaultMessageDialog.addStyleClass("clsDialogInformacion");
			}
			vthis.oDefaultMessageDialog.open();
		},
		handleDialogPress: function (vthis) {
			vthis.oMessageView.navigateBack();
			vthis.oDialog.open();
		},
		fnGetDestinatarios: function (vthis) {
			var oModel = vthis.getView().getModel("oModel");
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var user = oModel.getProperty("/USUARIO_PRINCIPAL");
			var AMBIENTE = vthis.oModel_DB.getProperty("/AMBIENTE");
			var texto = "/" + AMBIENTE + "/sap/bc/zws_portal_cli/LTDES/" + user + "/P02/P03/P04/P05/P06/P07";
			//console.log(texto);
			var resultado = [];
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					resultado = response.ITAB;
					//console.log(response);
				},
				error: function (response) {
					//console.log(response);
				}
			});
			oModel.setProperty("/DM_CLIENTES", resultado);
		},

		/*CARGA DE DATOS*/
		fnCargarDatos_DB: function (that) {
			var oModel = that.getView().getModel("oModel");
			var aModulo = [];
			var aEstado = [];
			var urlT_ESTADO = vthis.oModel_DB2.getProperty("/T_ESTADO");
			var texto = "/BD_CF/mydb" + urlT_ESTADO;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//aModulo = response.d.results;
					aModulo = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_ESTADO", aModulo);
		},

		fnCargarEstado_DB: function (that) {
			var vthis = that;
			var oModel = that.getView().getModel("oModel");
			var aModulo = [];
			var aEstado = [];
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var urlT_ESTADO = vthis.oModel_DB2.getProperty("/T_ESTADO");
			var texto = "/BD_CF/mydb" + urlT_ESTADO;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					// //console.log(response);
					//aEstado = response.d.results;
					aEstado = response.value;
				},
				error: function (response) {}
			});
			var aObject = [];
			var oObject = {};
			oObject.ESTADO = 'T';
			oObject.DESCRIPCION = 'Todos';
			aObject.push(oObject);
			for (var i = 0; i < aEstado.length; i++) {
				if(aEstado[i].ESTADO == 'R'){
					continue;
				}
				oObject = aEstado[i];
				aObject.push(oObject);
			}
			oModel.setProperty("/DM_ESTADO", aObject);
		},
		fnCargarConfig_DB: function (that) {
			var vthis = that;
			var oModel = that.getView().getModel("oModel");
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var aResult = [];
			var aEstado = [];
			var urlT_PERFIL = vthis.oModel_DB2.getProperty("/T_PERFIL");
			var texto = "/BD_CF/mydb" + urlT_PERFIL;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_PERFIL", aResult);

			var urlT_EJEC_VENTA = vthis.oModel_DB2.getProperty("/T_EJEC_VENTA");
			texto = "/BD_CF/mydb" + urlT_EJEC_VENTA;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_EJEC_VENTA", aResult);

			var urlT_MENSAJES = vthis.oModel_DB2.getProperty("/T_MENSAJES");
			texto = "/BD_CF/mydb" + urlT_MENSAJES;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_MENSAJES", aResult);
			var urlT_PARAMETROS = vthis.oModel_DB2.getProperty("/T_PARAMETROS");
			texto = "/BD_CF/mydb" + urlT_PARAMETROS;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_PARAMETROS", aResult);
			var urlT_RECLAMOS = vthis.oModel_DB2.getProperty("/T_RECLAMOS");
			texto = "/BD_CF/mydb" + urlT_RECLAMOS;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_RECLAMOS", aResult);
			var urlT_REGIONES = vthis.oModel_DB2.getProperty("/T_REGIONES");
			texto = "/BD_CF/mydb" + urlT_REGIONES;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_REGIONES", aResult);
			var urlT_TIPO_RECLAMO = vthis.oModel_DB2.getProperty("/T_TIPO_RECLAMO");
			texto = "/BD_CF/mydb" + urlT_TIPO_RECLAMO;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_TIPO_RECLAMO", aResult);
			var urlT_USUARIOS = vthis.oModel_DB2.getProperty("/T_USUARIOS");
			texto = "/BD_CF/mydb" + urlT_USUARIOS;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			// oModel.setProperty("/DM_USUARIOS", aResult);
			var empty = [];
			var oObject = {};
			var resultado2 = [];
			var aPerfil = oModel.getProperty("/DM_PERFIL");
			// var aDias = oModel.getProperty("/DM_DIAS");
			if (aResult.length > 0) {
				for (var i = 0; i < aResult.length; i++) {
					oObject = aResult[i];
					var resultPerfil = aPerfil.filter(aPerfil => aPerfil.PERFIL == oObject.PERFIL);
					if (resultPerfil.length > 0)
						oObject.PERFIL_T = resultPerfil[0].DESCRIPCION;
					resultado2.push(oObject);
				}
				aResult = resultado2;
			}
			oModel.setProperty("/DM_USUARIOS", aResult);
			var urlT_HORARIOS = vthis.oModel_DB2.getProperty("/T_HORARIOS");
			texto = "/BD_CF/mydb" + urlT_HORARIOS;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//console.log(response);
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			empty = [];
			oObject = {};
			resultado2 = [];
			var aRegion = oModel.getProperty("/DM_REGIONES");
			var aDias = oModel.getProperty("/DM_DIAS");
			if (aResult.length > 0) {
				for (var i = 0; i < aResult.length; i++) {
					oObject = aResult[i];
					var resultRegion = aRegion.filter(aRegion => aRegion.ID_REGION == oObject.ID_REGION);
					if (resultRegion.length > 0)
						oObject.ID_REGION_T = resultRegion[0].DESCRIPCION;
					var resultDia_sem = aDias.filter(aDias => aDias.ID == oObject.DIA_SEMANA);
					if (resultDia_sem.length > 0)
						oObject.DIA_SEMANA_T = resultDia_sem[0].DIA;
					var resultDia_aten = aDias.filter(aDias => aDias.ID == oObject.DIA_ATENCION);
					if (resultDia_aten.length > 0)
						oObject.DIA_ATENCION_T = resultDia_aten[0].DIA;
					if (oObject.HORA_MAX.length > 0)
						oObject.HORA_MAX_T = this.fnConvertirStringtoString5(oObject.HORA_MAX);
					resultado2.push(oObject);
				}
				aResult = resultado2;
			}
			oModel.setProperty("/DM_HORARIOS", aResult);
		},
		fnCargarUsuario_DB: function (that) {
			var vthis = that;
			var oModel = that.getView().getModel("oModel");
			var aDatos = [];
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var urlT_TABLA = vthis.oModel_DB2.getProperty("/T_USUARIOS");
			var texto = "/BD_CF/mydb" + urlT_TABLA;
			//console.log(texto);
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//aDatos = response.d.results;
					aDatos = response.value;
				},
				error: function (response) {}
			});
			//console.log(aDatos);
			oModel.setProperty("/DM_USUARIOS", aDatos);
		},
		fnCargarParametros_DB: function (that) {
			var vthis = that;
			var oModel = that.getView().getModel("oModel");
			var aModulo = [];
			var aEstado = [];
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var urlT_PARAMETROS = vthis.oModel_DB2.getProperty("/T_PARAMETROS");
			var texto = "/BD_CF/mydb" + urlT_PARAMETROS;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//aModulo = response.d.results;
					aModulo = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_PARAMETROS", aModulo);
		},
		fnCargarTipoReclamo_DB: function (that) {
			var vthis = that;
			var oModel = that.getView().getModel("oModel");
			var aResult = [];
			var aEstado = [];
			vthis.oModel_DB = vthis.getView().getModel("oModel_DB");
			var urlT_PARAMETROS = vthis.oModel_DB2.getProperty("/T_TIPO_RECLAMO");
			var texto = "/BD_CF/mydb" + urlT_PARAMETROS;
			$.ajax(texto, {
				type: 'GET',
				dataType: "json",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {},
				success: function (response) {
					//aResult = response.d.results;
					aResult = response.value;
				},
				error: function (response) {}
			});
			oModel.setProperty("/DM_TIPO_RECLAMO", aResult);
		},
		/*FUNCIONES API*/
		fnFechaCompleta: function (date, c) {
			var fecha, options = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};
			switch (c) {
			case 1:
				/*OBJETO	-	OBJETO*/
				fecha = this.fnConvertirFecha(date);
				fecha = this.fnConvertirStringtoDate(fecha);
				break;
			case 2:
				/*dd/mm/aaaa	-	OBJETO*/
				fecha = this.fnConvertirStringtoDate(date);
				break;
			case 3:
				/*dd/mm/aaaa	-	OBJETO*/
				fecha = parseInt(date.substring(6, date.length - 2));
				fecha = this.fnConvertirFechaBase(fecha);
				break;
			case 4:
				/*Fecha actual OBJETO*/
				fecha = this.fnCalcularFechaActual();
				fecha = this.fnConvertirStringtoDate(fecha);
				return fecha;
				break;
			}
			fecha = fecha.toLocaleDateString('es-ES', options);
			fecha = fecha.substring(0, 1).toUpperCase() + fecha.substring(1, fecha.length);
			return fecha;
		},
		fnConvertirFechaBase: function (sFecha) { //entero
			var fecha = this.fnConvertirFecha(sFecha);
			return this.fnConvertirStringtoDate(fecha);
		},
		fnCalSinD: function (periodo, ejercicio) {
			var oDate = new Date(ejercicio, periodo, 0);
			var ultimo_dia = parseInt(oDate.getUTCDate());
			var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var dayName;
			var cont = 0;
			for (var i = 0; i < ultimo_dia; i++) {
				oDate = new Date(ejercicio, periodo - 1, i + 1);
				dayName = days[oDate.getDay()];
				if (dayName != "Sunday") {
					cont++;
				}
			}
			return cont;
		},
		// fnFechaDiferencia: function (fecha,dias) {
		// 	var fechac = new Date();
		// 	fechac.setDate(fechac.getDate() - dias);
		// },
		fnConvertirStringtoDate: function (sFecha) {
			var from = sFecha.split("/");
			var f = new Date(from[2], from[1] - 1, from[0]);
			return f;
		},
		fnConvertirStringtoDate2: function (sFecha) {
			var from = sFecha.split(".");
			var f = new Date(from[2], from[1] - 1, from[0]);
			return f;
		},
		fnConvertirStringtoDate3: function (sFecha) {
			var from = sFecha.split("-");
			var f = new Date(from[0], from[1] - 1, from[2]);
			return f;
		},
		fnConvertirStringtoDate4: function (sFecha) {
			var from = sFecha.split("-");
			var f = new Date(from[0], from[1] - 1, from[2]);
			return f;
		},
		fnConvertirStringtoString: function (sFecha) {
			var from = sFecha.split(".");
			var f = from[0] + "/" + from[1] + "/" + from[2];
			return f;
		},
		fnConvertirStringtoString2: function (sFecha) {
			var from = sFecha.split("/");
			var f = from[0] + "." + from[1] + "." + from[2];
			return f;
		},
		fnConvertirStringtoString3: function (sFecha) {
			var from = sFecha.split("-");
			var f = from[2] + "/" + from[1] + "/" + from[0];
			return f;
		},
		fnConvertirStringtoString4: function (sFecha) {
			var from = sFecha.split("/");
			var f = from[0] + from[1] + from[2];
			return f;
		},
		fnConvertirStringtoString5: function (sFecha) { /*HORA*/
			var f = sFecha.substring(0, 2) + ":" + sFecha.substring(2, 4) + ":" + sFecha.substring(4, 6);
			return f;
		},
		fnConvertirStringtoString6: function (sFecha) { /*FECHA*/
			var f = new Date(sFecha.substring(0, 4), sFecha.substring(4, 6) - 1, sFecha.substring(6, 8));
			return f;
		},
		fnCtoS: function (fecha) {
			var vfecha = fecha.substring(6, fecha.length - 2);
			return parseInt(vfecha);
		},
		fnDiferenciaFecha: function (fechai, fechaf) {
			var mes = fechai.getUTCMonth() + 1;
			var an = fechai.getUTCFullYear();
			// var diff = Math.abs(fechai.getTime() - fechaf.getTime());
			// var diffD = Math.ceil(diff / (1000 * 60 * 60 * 24));
			var diffD = this.fnCalSinD(mes, an);
			return diffD;
		},
		fnFechaActualAbap: function () {
			var fechac = new Date();
			var dia = fechac.getUTCDate();
			var mes = fechac.getUTCMonth() + 1;
			var an = fechac.getUTCFullYear();
			dia = ("0" + dia).slice(-2);
			mes = ("0" + mes).slice(-2);
			// var fecha = dia + '' + mes + '' + an;
			var fecha = an + '' + mes + '' + dia;
			return fecha;
		},
		fnFechaActualAbap_dias: function (dias) {
			var fechac = new Date();
			fechac.setDate(fechac.getDate() - dias);
			// var fechac = new Date() - dias;
			var dia = fechac.getUTCDate();
			var mes = fechac.getUTCMonth() + 1;
			var an = fechac.getUTCFullYear();
			dia = ("0" + dia).slice(-2);
			mes = ("0" + mes).slice(-2);
			// var fecha = dia + '' + mes + '' + an;
			var fecha = an + '' + mes + '' + dia;
			return fecha;
		},
		fnConvertirFecha: function (vfecha) {
			var fechac = new Date(vfecha);
			var dia = fechac.getUTCDate();
			var mes = fechac.getUTCMonth() + 1;
			var an = fechac.getUTCFullYear();
			dia = ("0" + dia).slice(-2);
			mes = ("0" + mes).slice(-2);
			var fechar = dia + '/' + mes + '/' + an;
			return fechar;
		},
		fnConvertirFecha2: function (vfecha) {
			vfecha = this.fnCtoS(vfecha);
			var fechac = new Date(vfecha);
			var dia = fechac.getUTCDate();
			var mes = fechac.getUTCMonth() + 1;
			var an = fechac.getUTCFullYear();
			dia = ("0" + dia).slice(-2);
			mes = ("0" + mes).slice(-2);
			var fechar = dia + '/' + mes + '/' + an;
			return fechar;
		},
		fnConvertirFecha3: function (fechac) {
			// vfecha = this.fnCtoS(vfecha);
			// var fechac = new Date(vfecha);
			var dia = fechac.getUTCDate();
			var mes = fechac.getUTCMonth() + 1;
			var an = fechac.getUTCFullYear();
			dia = ("0" + dia).slice(-2);
			mes = ("0" + mes).slice(-2);
			var fechar = dia + '/' + mes + '/' + an;
			return fechar;
		},
		fnConvertirFecha4: function (fechac) {
			// vfecha = this.fnCtoS(vfecha);
			// var fechac = new Date(vfecha);
			var dia = fechac.getUTCDate();
			var mes = fechac.getUTCMonth() + 1;
			var an = fechac.getUTCFullYear();
			dia = ("0" + dia).slice(-2);
			mes = ("0" + mes).slice(-2);
			var fechar = dia + '/' + mes + '/' + an;
			return fechar;
		},

		filtrar_peso: function (peso_guia, peso_recepcion) {
			var oModelmyParam = this.getModel("myParam");
			var TIPO_PESO = oModelmyParam.getProperty("/TIPO_NOTIFICACION");
			switch (TIPO_PESO) {
			case "G":
				return peso_guia;
			case "B":
				return peso_recepcion;
			}
		},
		checkTime: function (i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		},
		fnCalcularHHMMSS: function () {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			h = this.checkTime(h);
			m = this.checkTime(m);
			s = this.checkTime(s);
			return h + ":" + m + ":" + s;
		},
		fnCalcularHHMMSSAbap: function () {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			h = this.checkTime(h);
			m = this.checkTime(m);
			s = this.checkTime(s);
			return h + '' + m + '' + s;
		},
		fnNombreMes: function (mes) {
			const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
				"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
			];
			return monthNames[parseInt(mes) - 1];
		},
		fnCalcularFechaActual: function () {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			dd = (dd < 10 ? '0' : '') + dd;
			mm = (mm < 10 ? '0' : '') + mm;
			var FECHA = dd + "/" + mm + "/" + yyyy;
			return FECHA;
		},
		fnCalcularFechaHora: function (oDate) {
			// var today = new Date();
			var dd = oDate.getDate();
			var mm = oDate.getMonth() + 1;
			var yyyy = oDate.getFullYear();
			dd = (dd < 10 ? '0' : '') + dd;
			mm = (mm < 10 ? '0' : '') + mm;
			var h = oDate.getHours();
			var m = oDate.getMinutes();
			var s = oDate.getSeconds();
			h = this.checkTime(h);
			m = this.checkTime(m);
			s = this.checkTime(s);
			// return h + ":" + m + ":" + s;
			var FECHA = '';
			if(parseInt(h) == 1)
				FECHA = dd + "/" + mm + "/" + yyyy + " a la " + h + ":" + m + ":" + s;
			else
				FECHA = dd + "/" + mm + "/" + yyyy + " a las " + h + ":" + m + ":" + s;
			return FECHA;
		},
		fnCalcularFechaActualObj: function () {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			dd = (dd < 10 ? '0' : '') + dd;
			mm = (mm < 10 ? '0' : '') + mm;
			var oFecha = new Date(yyyy, mm - 1, dd);
			return oFecha;
		},
		fnFechaObject2String: function (date) {
			var dd = date.getDate();
			var mm = date.getMonth() + 1;
			var yyyy = date.getFullYear();
			dd = (dd < 10 ? '0' : '') + dd;
			mm = (mm < 10 ? '0' : '') + mm;
			// var fecha = dd + "/" + mm + "/" + yyyy;
			var fecha = yyyy + "" + mm + "" + dd;
			return fecha;
		},
		fnCalcularJuliano: function (FECHA) {
			var sMes = parseInt(FECHA.substring(5, 7)) - 1;
			var lv_date = new Date(FECHA.substring(0, 4), sMes, FECHA.substring(8, 10));
			var lv_date_ini = new Date(lv_date.getFullYear(), '00', '01');
			const diffTime = Math.abs(lv_date.getTime() - lv_date_ini.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			var v_i = diffDays + 1;
			var v_julian = String(lv_date.getFullYear()).substring(3, 4) + '' + v_i;
			return v_julian;
		},
		fnTransformarFecha: function (FECHA, sTipo) {
			var fecha;
			if (FECHA != "" && FECHA != undefined) {
				switch (sTipo) {
				case 0: //	FECHA	2019-07-26		->	dd/mm/aaaa
					fecha = FECHA.substring(8, 10) + "/" + FECHA.substring(5, 7) + "/" + FECHA.substring(0, 4);
					break;
				case 1: //	FECHA	2019-07-26		->	aaaammdd
					fecha = FECHA.substring(0, 4) + FECHA.substring(5, 7) + FECHA.substring(8, 10);
					break;
				case 2: //	FECHA	dd/mm/aaaa		->	aaaammdd
					fecha = FECHA.substring(6, 10) + FECHA.substring(3, 5) + FECHA.substring(0, 2);
					break;
				case 3: //	FECHA	aaaammdd		->	dd/mm/aaaa
					fecha = FECHA.substring(6, 8) + '/' + FECHA.substring(4, 6) + '/' + FECHA.substring(0, 4);
					break;
				}
			}
			return fecha;
		},
		fnTransformarHora: function (param, sTipo) {
			var sTime;
			if (param != "" && param != undefined) {
				switch (sTipo) {
				case 0: //	HORA	hhmmss		->	hh:mm:ss
					sTime = param.substring(0, 2) + ":" + param.substring(2, 4) + ":" + param.substring(4, 6);
					break;
				// case 1: //	FECHA	2019-07-26		->	aaaammdd
				// 	fecha = FECHA.substring(0, 4) + FECHA.substring(5, 7) + FECHA.substring(8, 10);
				// 	break;
				// case 2: //	FECHA	dd/mm/aaaa		->	aaaammdd
				// 	fecha = FECHA.substring(6, 10) + FECHA.substring(3, 5) + FECHA.substring(0, 2);
				// 	break;
				// case 3: //	FECHA	aaaammdd		->	dd/mm/aaaa
				// 	fecha = FECHA.substring(6, 8) + '/' + FECHA.substring(4, 6) + '/' + FECHA.substring(0, 4);
				// 	break;
				}
			}
			return sTime;
		},
		fnAjaxPOST: function (that, T_CARGA, ID, F1, F2, F3, F4) {
			var result;
			var oModel = that.getView().getModel("myParam");
			var texto = "/PRD/sap/bc/ZPPGW_PLAN/Guia/" + ID + "/" + F1 + "/" + F2 + "/" + F3 + "/" + F4;
			$.ajax(texto, {
				type: 'GET',
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {
					var token = xhr.getResponseHeader("X-CSRF-Token");
					$.ajax(texto, {
						type: 'POST',
						data: T_CARGA,
						async: false,
						beforeSend: function (xhr) {
							xhr.setRequestHeader('X-CSRF-Token', token);
						},
						success: function (response) {
							oModel.setProperty("/RESPONSE", response);
							result = "PS";
						},
						error: function (response) {
							oModel.setProperty("/ERROR_RESPONSE", response.responseJSON.ITAB);
							result = "PE";
						}
					});
				},
				success: function (response) {},
				error: function (response) {
					oModel.setProperty("/ERROR_RESPONSE", response.responseText);
					result = "GE";
				}
			});
			return result;
		},

		fnMessageBoxInfo: function (that, StringMessage, StringCabecera) {
			var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.information(
				StringMessage, {
					title: StringCabecera,
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},
		fnMessageBoxSuccess: function (that, StringMessage, StringCabecera) {
			var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.success(
				StringMessage, {
					title: StringCabecera,
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				}
			);
		},
		fnError: function (that) {
			// var vthis = that;
			var oModelp = that.getView().getModel("myParam");
			var errormsg = {};
			var objetoA = [];
			var nerror = oModelp.getProperty("/ERROR_RESPONSE/length");

			oModelp.setProperty("/mockdata", objetoA);
			var verror;
			for (var i = 0; i < nerror; i++) {
				errormsg = {};
				if (oModelp.getProperty("/ERROR_RESPONSE/" + i + "/TYPE") == "E") {
					verror = "Error";
				} else {
					verror = "Warning";
				}
				errormsg.type = verror;
				errormsg.title = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/ID") + " - NUMBER: " + oModelp.getProperty("/ERROR_RESPONSE/" + i +
					"/NUMBER");
				errormsg.subtitle = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				errormsg.description = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				errormsg.group = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/TYPE");
				objetoA.push(errormsg);
			}
			oModelp.setProperty("/mockdata", objetoA);
			this.fnDialogMessage(that);
		},
		fnErrorMsjSimple: function (that) {
			// var vthis = that;
			var oModelp = that.getView().getModel("myParam");
			var errormsg = {};
			var objetoA = [];
			var nerror = oModelp.getProperty("/ERROR_RESPONSE/length");
			var sMensaje = "";
			oModelp.setProperty("/mockdata", objetoA);
			var verror;
			for (var i = 0; i < nerror; i++) {
				errormsg = {};
				if (oModelp.getProperty("/ERROR_RESPONSE/" + i + "/TYPE") == "E") {
					verror = "Error";
				} else {
					verror = "Warning";
				}
				errormsg.type = verror;
				errormsg.title = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/ID") + " - NUMBER: " + oModelp.getProperty("/ERROR_RESPONSE/" + i +
					"/NUMBER");
				errormsg.subtitle = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				sMensaje = sMensaje + oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				errormsg.description = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/MESSAGE");
				errormsg.group = oModelp.getProperty("/ERROR_RESPONSE/" + i + "/TYPE");
				objetoA.push(errormsg);
			}
			return sMensaje;
		},
		fnDialogMessage: function (that) {
			// var that = this;
			// this.oMessageView.navigateBack();
			// this.oDialog.open();
			var oModel = that.getView().getModel("myParam");

			var oBackButton = new sap.m.Button({
				icon: sap.ui.core.IconPool.getIconURI("nav-back"),
				visible: false,
				press: function () {
					that.oMessageView.navigateBack();
					that.setVisible(false);
				}
			});
			//PROBAR
			that.oMessageView = new sap.m.MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: '/mockdata',
					template: oMessageTemplate
				},
				groupItems: true
			});

			that.oMessageView.setModel(oModel);

			that.oDialog = new sap.m.Dialog({
				content: that.oMessageView,
				contentHeight: "440px",
				contentWidth: "640px",
				endButton: new sap.m.Button({
					text: "Close",
					press: function () {
						that.oDialog.close();
					}.bind(that)
				}),
				customHeader: new sap.m.Bar({
					contentMiddle: [
						new sap.m.Text({
							text: "Error en Guardar Nuevo Lote Proceso"
						})
					],
					contentLeft: [oBackButton]
				}),
				verticalScrolling: false
			});

			that.oDialog.open();
		}
	};

	return Formato;

}, /* bExport= */ true);