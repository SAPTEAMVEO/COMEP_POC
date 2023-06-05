sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("comep.comep.controller.DemandeList", {
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel("ZWD_TEST_SRV");
                //this.getView().setModel(i18nModel, "i18n");
                this.oTable = this.getView().byId("idTable");
                this.getView().setModel(this.oModel);
                this.oTable.setModel(this.oModel);

            }
        });
    });
