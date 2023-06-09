sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/resource/ResourceModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ResourceModel) {
        "use strict";

        return Controller.extend("comep.comep.controller.DetailDemande", {
            onInit: function () {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("DemandeDetail").attachMatched(this._onObjectMatched, this);
                // oRouter.getRoute("DemandeDetail").attachPatternMatched(this._onSupplierMatched, this);


            },
            _onObjectMatched: function (oEvent) {
                this.demandeId = oEvent.getParameter("arguments").dem_descr;
            },


            _onSupplierMatched: function (oEvent) {
                this._dem_code = oEvent.getParameter("arguments").dem_code || this._dem_code || "0";

                this.getView().bindElement({
                    path: "/demandeSet" + this._dem_descr
                });
            },
            _onRouteMatched: function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                oView = this.getView();


                oView.bindElement({
                    path: "/DemandeDetail(" + oArgs.dem_code + ")",
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
