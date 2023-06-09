sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/Device"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ResourceModel, Device) {
        "use strict";


        return Controller.extend("comep.comep.controller.DemandeList", {
            onInit: function () {
               
                var i18nModel = new ResourceModel({
                    bundleName: "comep.comep.i18n.i18n"
                });
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oModel = this.getOwnerComponent().getModel("ZWD_TEST_SRV");
                this.getView().setModel(i18nModel, "i18n");
                this.oTable = this.getView().byId("idTable");
                this.getView().setModel(this.oModel);
                this.oTable.setModel(this.oModel);

            },
            onDemandePress: function (oEvent) {

                var oList = oEvent.getSource(),
                    bSelected = oEvent.getParameter("selected");

                this.oTable.setSelectedItem(oEvent.getSource());
                // skip navigation when deselecting an item in multi selection mode
                if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
                    // get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
                    this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
                }
            },
            _showDetail: function (oItem) {
                var bReplace = !Device.system.phone;
                // var eventData = {
                //     showReportPopup: this.showReportPopup
                // };

                // var PatternName = this.oRouter._oRouter._prevMatchedRequest.split("/");

                // // if (this.oRouter._oRouter._prevBypassedRequest === "") {

                // if (PatternName[0] === "RouteDemandeList") {

                this.oRouter.navTo("DemandeDetail", {

                    dem_descr: oItem.getBindingContext().getProperty("dem_descr")
                }, bReplace);



                // }

            }


        });
    });
