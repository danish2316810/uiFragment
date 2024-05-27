sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel"
], function (Controller, Fragment, JSONModel) {
  "use strict";

  return Controller.extend("danui5stand.ui5project.controller.App", {
    onInit: function () {
      var oData = {
        "enableSiteSupportRanges": true,
        "Sites": [
          {"site": "001", "siteDesc": "Site 1"},
          {"site": "002", "siteDesc": "Site 2"},
          // Add more site data
        ]
      };
      var oModel = new JSONModel(oData);
      this.getView().setModel(oModel, "siteModel");
    },

    onStoreIdVHReq: function (oEvent, sMultiInputId) {
      // Use the passed parameter sMultiInputId
      sMultiInputId = oEvent.getParameter("id");
      if (!this.cityPopup) {
        Fragment.load({
          name: "danui5stand.ui5project.fragment.site",
          controller: this
        }).then(function (oDialog) {
          this.cityPopup = oDialog;
          this.getView().addDependent(this.cityPopup);
    
          // Set the model to the table in the dialog
          oDialog.getTable().setModel(this.getView().getModel("siteModel"), "siteModel");
    
          // Define columns for the table
          var oTable = oDialog.getTable();
          oTable.addColumn(new sap.ui.table.Column({
            label: new sap.m.Text({ text: "Site" }),
            template: new sap.m.Text({ text: "{siteModel>site}" }),
            hAlign: "Center",
            width: "100px"
          }));
    
          oTable.addColumn(new sap.ui.table.Column({
            label: new sap.m.Text({ text: "Description" }),
            template: new sap.m.Text({ text: "{siteModel>siteDesc}" }),
            hAlign: "Center",
            width: "150px"
          }));
    
          // Asynchronously retrieve the table and handle it
          oDialog.getTableAsync().then(function (oTable) {
            this._oTableVH = oTable; // Store the table reference for later use
    
            // Bind rows of the table to the model
            oTable.bindRows("siteModel>/Sites");
    
            // Handle row selection
            oTable.attachRowSelectionChange(function (oEvent) {
              var aSelectedIndices = oEvent.getSource().getSelectedIndices();
              var aSelectedItems = [];
              aSelectedIndices.forEach(function (iIndex) {
                var oContext = oTable.getContextByIndex(iIndex);
                if (oContext) {
                  var sSite = oContext.getProperty("site");
                  var sSiteDesc = oContext.getProperty("siteDesc");
                  aSelectedItems.push(sSite + " - " + sSiteDesc);
                }
              });
            
              var oMultiInput = this.byId(sMultiInputId);
              if (oMultiInput) {
                oMultiInput.setTokens(aSelectedItems.map(function (sItem) {
                  return new sap.m.Token({ key: sItem, text: sItem });
                }));
              }
            }.bind(this));
            
    
            // Open the dialog
            this.cityPopup.open();
          }.bind(this)); // Ensure the correct context with .bind(this)
        }.bind(this)); // Ensure the correct context with .bind(this)
      } else {
        this.cityPopup.open();
      }
    },
    
    

    onSiteValueHelpCancelPress: function () {
      if (this.cityPopup) {
        this.cityPopup.close();
      }
    },

    onSiteCodeValueHelpOkPress: function (oEvent,sMultiInputId) {
      var aTokens = oEvent.getParameter("tokens");
      var oMultiInput = this.byId(sMultiInputId);
      if (oMultiInput) {
        oMultiInput.setTokens(aTokens);
      } else {
        console.error("MultiInput field not found.");
      }
      this.cityPopup.close();
    },

    onStoreAfterClose: function () {
      if (this.cityPopup) {
        this.cityPopup.destroy();
        this.cityPopup = null;
      }
    }
  });
});
