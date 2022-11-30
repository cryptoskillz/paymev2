 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }

 whenDocumentReady(isReady = () => {
     let getTableDone = (res) => {
         res = JSON.parse(res)
         //console.log(res)
         table = $('#dataTable').DataTable();
         let tmpTableName = "user";
         for (var i = 0; i < res.data.length; ++i) {
             let theData = res.data[i];
             //console.log(theData)

             let editButton = `<a href="/admin/users/edit?id=${theData.id}" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-edit fa-sm text-white-50"></i> Edit</a>`
             let unblockButton;
             let blockButton;
             let deleteButton = `<a href="javascript:deleteTableItem(${theData.id},'api/database/table/','${tmpTableName}')" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

             let tAdmin = "No";
             tBlocked = `<span id="text-${tmpTableName}-${theData.id}">No</span>`;
             let tmpJsonBlock = `{ 'isBlocked': 1 }`;
             let tmpJsonUnBlock = `{ 'isBlocked': 0 }`;
             if (theData.isAdmin == 1)
                 tAdmin = "Yes"
             if (theData.isBlocked == 1) {

                 blockButton = `<a id="off-${tmpTableName}-${theData.id}" href="javascript:switchTableItem(${theData.id},'api/database/table/','${tmpTableName}',${tmpJsonUnBlock},1)" class="btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Unblock</a>`
                 unblockButton = `<a id="on-${tmpTableName}-${theData.id}" href="javascript:switchTableItem(${theData.id},'api/database/table/','${tmpTableName}',${tmpJsonBlock},1)" class="d-none btn btn-sm btn-primary shadow-sm" ><i class="fas fa-trash fa-sm text-white-50" ></i> Block</a>`
                 tBlocked = `<span id="text-${tmpTableName}-${theData.id}">Yes</span>`
             } else {
                 blockButton = `<a id="off-${tmpTableName}-${theData.id}" href="javascript:switchTableItem(${theData.id},'api/database/table/','${tmpTableName}',${tmpJsonUnBlock},1)" class="d-none btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Unblock</a>`
                 unblockButton = `<a id="on-${tmpTableName}-${theData.id}"href="javascript:switchTableItem(${theData.id},'api/database/table/','${tmpTableName}',${tmpJsonBlock},1)" class=" btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Block</a>`
             }


             var rowNode = table
                 .row.add([theData.id, theData.email, theData.username, theData.phone, tBlocked, tAdmin, `${editButton} ${blockButton} ${unblockButton} ${deleteButton}`])
                 .draw()
                 .node().id = theData.id;
         }
         //table.columns.adjust();
         document.getElementById('showBody').classList.remove('d-none');
     }
     url = adminUrl + "database/table?tablename=user&fields=id,email,username,phone,isBlocked,isAdmin&getOnlyTableSchema=0"
     xhrcall(1, url, "", "json", "", getTableDone, token)
 });