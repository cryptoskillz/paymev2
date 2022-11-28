 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }


 whenDocumentReady(isReady = () => {
     let getTableDone = (res) => {
         res = JSON.parse(res)
         console.log(res)
         for (var i = 0; i < res.length; ++i) {
             console.log(res[i].name)
         }
         //show the body div
         document.getElementById('showBody').classList.remove('d-none');
     }
     url = adminUrl + "database/table?tablename=user&fields=id,isBlocked,isAdmin&getTableSchema=1"
     xhrcall(1, url, "", "json", "", getTableDone, token)
 });