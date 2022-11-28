 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }


 whenDocumentReady(isReady = () => {
     let getTableDone = (res) => {
         res = JSON.parse(res)
         //console.log(response)
         table = $('#dataTable').DataTable();
         for (var i = 0; i < res.length; ++i) {
             console.log(res[i])

             let editButton = `<a href="javascript:editTableItem(${res[i].id}','user')" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-edit fa-sm text-white-50"></i> edit</a>`
             let unblockButton;
             let blockButton;
             let deleteButton = `<a href="javascript:deleteTableItem(${res[i].id},'api/database/table/','user')" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

             let tAdmin = "No";
             tBlocked = `<span id="text-isBlocked-${res[i].id}">No</span>`
             if (res[i].isAdmin == 1)
                 tAdmin = "Yes"
             if (res[i].isBlocked == 1) {
                 blockButton = `<a id="off-isBlocked-${res[i].id}" href="javascript:updateTableItem(${res[i].id},'api/database/table/','user','isBlocked',0,1)" class="btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Unblock</a>`
                 unblockButton = `<a id="on-isBlocked-${res[i].id}" href="javascript:updateTableItem(${res[i].id},'api/database/table/','user','isBlocked',1,1)" class="d-none btn btn-sm btn-primary shadow-sm" ><i class="fas fa-trash fa-sm text-white-50" ></i> Block</a>`
                 tBlocked = `<span id="text-isBlocked-${res[i].id}">Yes</span>`
             } else {
                 blockButton = `<a id="off-isBlocked-${res[i].id}" href="javascript:updateTableItem(${res[i].id},'api/database/table/','user','isBlocked',0,1)" class="d-none btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Unblock</a>`
                 unblockButton = `<a id="on-isBlocked-${res[i].id}"href="javascript:updateTableItem(${res[i].id},'api/database/table/','user','isBlocked',1,1)" class=" btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Block</a>`
             }


             var rowNode = table
                 .row.add([res[i].id, res[i].email, res[i].username, res[i].phone, tBlocked, tAdmin, `${editButton} ${blockButton} ${unblockButton} ${deleteButton}`])
                 .draw()
                 .node().id = res[i].id;
         }
         //table.columns.adjust();
         document.getElementById('showBody').classList.remove('d-none');
     }
     url = adminUrl + "database/table?tablename=user&fields=id,email,username,phone,isBlocked,isAdmin&getTableSchema=0"
     xhrcall(1, url, "", "json", "", getTableDone, token)
 });