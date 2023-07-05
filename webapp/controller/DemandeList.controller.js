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
    function (Controller, ResourceModel, Device, Filter, FilterOperator, formatter) {
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
                this._initializeComboBox();
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
                this.oRouter.navTo("DemandeDetail", {
                    Code: oItem.getBindingContext().getProperty("Code")
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
                        template: "Code"
                    }, {
                        label: this.oBundle.getText("description"),
                        template: "Description"
                    }]
                });

                var oTable = this._valueHelpDialogDemande.getTable();
                oTable.setModel(oColModel, "columns");
                var oInput = this.getView().byId("demandeInputId");
                var oModel = this.getOwnerComponent().getModel("ZCOMEP_POC_SRV");
                oModel.read("/DEMANDESet", {
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
                        filterValue = "Code";
                        break;
                        case "itBusServValueHelp":
                        inputValue = "itBusSevInputId";
                        keyValue = "ItBusService";
                        filterValue = "ItBusService";

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
                    
                    }else if (oSourceId.includes('itBusSevInputId')) {
						skey = oEvent.getParameter("removedTokens")[0].getProperty("key");
                        sName = oEvent.getParameter("removedTokens")[0].getProperty("text");
                         aTokens = this.oView.byId('itBusSevInputId').getTokens();
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
                    path: "/DEMANDESet",
                    template: oTemplate,
                    filters: this.Filters,
                });



            },
            onSearch: function () {
                // this.oTable.setBusy(true);
                this.getView().setBusy(true);


                this._getInputFilters("demandeInputId", 'Code');
                this._getInputFilters("itBusSevInputId", 'ItBusService');
                var oTemplate = this._createTemplate();
                this.oTable.bindItems({
                    path: "/DEMANDESet",
                    template: oTemplate,
                    filters: this.Filters,
                });
                this.getView().setBusy(false);
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
                            title: "{Code}"
                        }),
                        new sap.m.ObjectAttribute({
                            text: "{Description}"

                        }),
                        new sap.m.ObjectAttribute({
                            text: {
                                path: "StatuS",
                                formatter: formatter.getStatusText
                            },


                        }),
                        new sap.m.ObjectAttribute({
                            text: {
                                path: "CreationDate",
                                formatter: formatter.getDate
                            },


                        }),
                        new sap.m.ObjectAttribute({
                            text: "{Responsible}"

                        })
                    ]
                });
            },
            _initializeComboBox: function () {

                var oComboBox = this.getView().byId("combo");
                var oItem;
                var OtemArray = [{ key: 'G', Text: 'GO' },
                { key: 'N', Text: 'No Go' },
                { key: 'W', Text: 'Waiting' }];
                for (var j = 0; j < OtemArray.length; j++) {
                    oItem = new sap.ui.core.Item();
                    oItem.setText(OtemArray[j].Text);
                    oItem.setKey(OtemArray[j].key);
                    oComboBox.insertItem(oItem);
                }

            },
            onSelectStatus: function () {
                var oControl = this.getView().byId("combo");
                var sSelectedItem = oControl.getSelectedItem();

                for (var j = 0; j < this.Filters.length; j++) {
                    if (this.Filters[j].sPath === "Status") {
                        this.Filters.splice(j, 1);
                        break; oFilterItem
                    }
                }
                if (sSelectedItem !== null) {
                    var skey = oControl.getSelectedItem().getKey();

                    var oFilterItem = new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, skey);

                    this.Filters.push(oFilterItem);


                }

            },
            onItBusinessServiceValueHelp: function (oController) {

                if (this._valueHelpDialogItBusService) {

                    var aTokens = oController.getSource().getTokens();
                    var oSelectedItems = this._valueHelpDialogItBusService._oSelectedItems;
                    this._valueHelpDialogItBusService.destroy();
                }
                this._valueHelpDialogItBusService = this._createDialog("comep.comep.view.fragments.ItBusServiceDialog");

                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [{
                        label: this.oBundle.getText("ItBusService"),
                        template: "ItBusService"
                    }]
                });

                var oTable = this._valueHelpDialogItBusService.getTable();
                oTable.setModel(oColModel, "columns");
                var oInput = this.getView().byId("itBusSevInputId");
                var oModelRows = new sap.ui.model.json.JSONModel();
               // var items = this.formatter.getItBusinessService;
               var items = [{ ItBusService: 'AETOS'},
                        { ItBusService: 'ATLAS'},
                        { ItBusService: 'BOARD'},
                        { ItBusService: 'CALYPSO'},
                        { ItBusService: 'CODAC'},
                        { ItBusService: 'CODAF'},
                        { ItBusService: 'CODSI'},
                        { ItBusService: 'COLOG'},
                        { ItBusService: 'COM2MIND'},
                        { ItBusService: 'COM2WORLD'},
                        { ItBusService: 'COMARK'},
                        { ItBusService: 'COR'},
                        { ItBusService: 'CORH'},
                        { ItBusService: 'COSPS'},
                        { ItBusService: 'CRECHE'},
                        { ItBusService: 'EXPANSION'},
                        { ItBusService: 'HOTEL'},
                        { ItBusService: 'JURIDIQUE'},
                        { ItBusService: 'PIONEER'},
                        { ItBusService: 'TRAVAUX'}
                         ];
                oModelRows.setData({
                    data: items
                   
                });
                oTable.setModel(oModelRows);
                        oTable.bindRows("/data");                
                this._valueHelpDialogItBusService.open();

            }

        });
    });
