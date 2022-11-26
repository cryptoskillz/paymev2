 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }


 whenDocumentReady(isReady = () => {
    
     let listUsersDone = (response) => {
         document.getElementById('showBody').classList.remove('d-none');
     }
     url = adminUrl + "admin/users?id=1"
     xhrcall(1, url, "", "json", "", listUsersDone,token)
 })