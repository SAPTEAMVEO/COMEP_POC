sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/resource/ResourceModel",
    "comep/comep/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ResourceModel,  formatter) {
        "use strict";

        return Controller.extend("comep.comep.controller.DetailDemande", {
            formatter: formatter,
            onInit: function () {
                var that = this;
                var oRouter = this.getOwnerComponent().getRouter();
                this.oModel = this.getOwnerComponent().getModel("ZCOMEP_POC_SRV");

                oRouter.getRoute("DemandeDetail").attachMatched(this._onObjectMatched, this);
                that = this;
                var oDetailsModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oDetailsModel, "detailsModel");



            },
            createModel: function () {
                var sObjectPath = this.oModel.createKey("DEMANDESet", {
                    Code: this.demandeId

                });
                var oDetailsModel = this.getView().getModel("detailsModel");


                this.oModel.read("/" + sObjectPath, {
                    success: function (oData) {
                        var test = 'ok';
                        oDetailsModel.setData(oData);

                        oDetailsModel.updateBindings();
                    },
                    error: function (oError) {
                        test = 'ko';
                    }

                });


            },
            _onObjectMatched: function (oEvent) {
                this.demandeId = oEvent.getParameter("arguments").Code;
                this.createModel();
            },


            _onSupplierMatched: function (oEvent) {
                this.code = oEvent.getParameter("arguments").code || this.code || "0";

                this.getView().bindElement({
                    path: "/DEMANDESet" + this.description
                });
            },
            _onRouteMatched: function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                oView = this.getView();


                oView.bindElement({
                    path: "/DemandeDetail(" + oArgs.code + ")",
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function (oEvent) {
                            oView.setBusy(true);
                        },
                        dataReceived: function (oEvent) {
                            oView.setBusy(false);
                        }
                    }
                });
            },

            _bindView: function (sObjectPath) {
                this.getView().bindElement({
                    path: sObjectPath
                });
            },
            _onBindingChange: function (oEvent) {
                // No data for the binding
                if (this.getView().getBindingContext()) {
                    //this.getRouter().getTargets().display("notFound");
                }
            },
            onNavBack: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("RouteDemandeList", {});
            }

        });
    });
