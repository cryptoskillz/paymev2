 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }


 whenDocumentReady(isReady = () => {
     let getTableDone = (res) => {
         res = JSON.parse(res);
         //debug
         //console.log(res)
         let formHtml="";
         for (var i = 0; i < res.schema.length; ++i) {
             //console.log(res[i].name)
             formHtml = formHtml + buildFormElement(res.schema[i]);
         }
         //set table name
         document.getElementById('formTableName').value = "user";
         document.getElementById('formInputs').innerHTML = formHtml;
         //show the body div
         document.getElementById('showBody').classList.remove('d-none');
     }
     
     url = adminUrl + "database/table?tablename=user&fields=email,username,password,phone&getOnlyTableSchema=1"
     xhrcall(1, url, "", "json", "", getTableDone, token)
 });