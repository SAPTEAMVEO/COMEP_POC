sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "comep/comep/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ResourceModel, Device, Filter, FilterOperator,formatter) {
        "use strict";


        return Controller.extend("comep.comep.controller.DemandeList", {
            formatter: formatter,
            onInit: function () {


                this.oRouter = this.getOwnerComponent().getRouter();
                this.oModel = this.getOwnerComponent().getModel("ZCOMEP_POC_SRV");
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.oTable = this.getView().byId("idTable");
                this.oView = this.getView();
                this.getView().setModel(this.oModel);
                this.oTable.setModel(this.oModel);
                this.Filters = [];
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

                    DemCode: oItem.getBindingContext().getProperty("DemCode")
                }, bReplace);



                // }

            },
            _createDialog: function (sDialog) {
                var oDialog = sap.ui.xmlfragment(sDialog, this);
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this._oView, oDialog);

                this.getView().addDependent(oDialog);
                return oDialog;
            },
            onDemandeValueHelp: function (oController) {

                if (this._valueHelpDialogDemande) {

                    var aTokens = oController.getSource().getTokens();
                    var oSelectedItems = this._valueHelpDialogDemande._oSelectedItems;
                    this._valueHelpDialogDemande.destroy();
                }
                this._valueHelpDialogDemande = this._createDialog("comep.comep.view.fragments.DemandeDialog");

                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [{
                        label: this.oBundle.getText("demande"),
                        template: "DemCode"
                    }, {
                        label: this.oBundle.getText("description"),
                        template: "DemDescr"
                    }]
                });

                var oTable = this._valueHelpDialogDemande.getTable();
                oTable.setModel(oColModel, "columns");
                var oInput = this.getView().byId("demandeInputId");
                var oModel = this.getOwnerComponent().getModel("ZCOMEP_POC_SRV");
                oModel.read("/DemandeSet", {
                    success: function (oData) {
                        var oModelRows = new sap.ui.model.json.JSONModel();
                        oModelRows.setData({
                            data: oData.results
                        });
                        oTable.setModel(oModelRows);
                        oTable.bindRows("/data");

                    },
                    error: function (oError) {

                    }

                });
                this._valueHelpDialogDemande.open();

            },
            onConfirm: function (oEvent) {

                var inputValue, filterValue, keyValue,
                    oInput;

                switch (oEvent.getParameter("id")) {
                    case "demandeValueHelp":
                        inputValue = "demandeInputId";
                        keyValue = "Demande";
                        filterValue = "DemCode";
                        break;

                }
                oInput = this.getView().byId(inputValue);
                var aTokens = oEvent.getParameter("tokens");
                oInput.setTokens(aTokens);
                oEvent.getSource().close();

            },
            onCancel: function (oEvent) {

                oEvent.getSource().close();
            },

            onFilterChange: function () {
                var data = 'onFilterChange';
            },
            onChange: function (oEvent) {
                var oSourceId;
                if (oEvent.getId() === 'tokenUpdate' && oEvent.getParameter("type") === 'removed') {
                    oSourceId = oEvent.getParameter("id");

                    if (oSourceId.includes('demandeInputId')) {
                        var skey = oEvent.getParameter("removedTokens")[0].getProperty("key");
                        var sName = oEvent.getParameter("removedTokens")[0].getProperty("text");
                        var aTokens = this.oView.byId('demandeInputId').getTokens();
                        for (var i = 0; i < aTokens.length; i++) {
                            if ((this.Filters[i].oValue1 === skey)) {
                                // remove filter from filters list
                                this.Filters.splice(i, 1);
                                aTokens.splice(i, 1);
                                i--;
                            }
                        }
                    }

                }
                var oTemplate = this._createTemplate();
                this.oTable.bindItems({
                    path: "/DemandeSet",
                    template: oTemplate,
                    filters: this.Filters,
                });



            },
            onSearch: function () {
                this.oTable.setBusy(true);

                this._getInputFilters("demandeInputId", 'DemCode');

                var oTemplate = this._createTemplate();
                this.oTable.bindItems({
                    path: "/DemandeSet",
                    template: oTemplate,
                    filters: this.Filters,
                });
                this.oTable.setBusy(false);
            },
            _getInputFilters: function (sInput, sFilterName) {

                var oInput = this.getView().byId(sInput);
                var aTokens = oInput.getTokens();
                if (aTokens.length !== 0) {
                    for (var j = 0; j < aTokens.length; j++) {
                        var oFilterItem = new sap.ui.model.Filter(sFilterName, sap.ui.model.FilterOperator.EQ, aTokens[j].getKey());
                        this.Filters.push(oFilterItem);
                    }

                }
            },
            _createTemplate: function () {

                return new sap.m.ColumnListItem({
                    type: "Navigation",
                    press: (this.onDemandePress).bind(this),

                    cells: [
                        new sap.m.ObjectIdentifier({
                            title: "{DemCode}"
                        }),
                        new sap.m.ObjectAttribute({
                            text: "{DemDescr}"

                        }),
                        new sap.m.ObjectAttribute({
                            text: "{DemStatut}"

                        }),
                        new sap.m.ObjectAttribute({
                            text: "{DemDateCrea}"

                        }),
                        new sap.m.ObjectAttribute({
                            text: "{DemResponsable}"

                        })
                    ]
                });
            }

        });
    });
