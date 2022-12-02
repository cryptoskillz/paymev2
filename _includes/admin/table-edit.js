 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }

 let lookUpData = [];

 whenDocumentReady(isReady = () => {
     let getTableDone = (res) => {
         //parse the repsonse
         res = JSON.parse(res)
         //set the form html
         let formHtml = "";
         //loop through the scema
         for (var i = 0; i < res.schema.length; ++i) {
             //pass in the field name and the values
             //note: at the moment we pass in all the values, we could make this neater by adding the schema info into the 
             //      main data result but this would break standard sqlite api return formats so may not go ahead and do that.
             formHtml = formHtml + buildFormElement(res.schema[i], res.data[0]);
         }
         //set table name
         document.getElementById('formTableName').value = theTable;
         //set the form
         document.getElementById('formInputs').innerHTML = formHtml;
         //show the body div
         document.getElementById('showBody').classList.remove('d-none');
     }
     //get the id
     let id = getUrlParamater('id');

     //set the tmpName
     let tmpName = theTable.replace("_", " ");
     document.getElementById('data-header').innerHTML = `edit ${tmpName}`

     //get the table results for this level.
     let getTableData = () => {
         //call the data
         url = adminUrl + `database/table?tablename=${theTable}&fields=${theFields}&getOnlyTableSchema=0&id=${id}`
         xhrcall(1, url, "", "json", "", getTableDone, token);
     }

     let getLookUpDone = (res) => {
         res = JSON.parse(res);
         lookUpData = res;
         getTableData();
     }

     if (lookUps != "") {
         lookUps = JSON.stringify(lookUps);
         //call the data
         url = adminUrl + `database/lookUp?theData=${lookUps}&id=${window.localStorage.currentDataItemId}`
         xhrcall(1, url, "", "json", "", getLookUpDone, token);
     } else {
         getTableData();
     }

 });