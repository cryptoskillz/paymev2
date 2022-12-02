/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}



whenDocumentReady(isReady = () => {

    let getTableDone = (res) => {
        //parse json
        res = JSON.parse(res)
        //get the datatable
        table = $('#dataTable').DataTable();
        //process the results
        for (var i = 0; i < res.data.length; ++i) {
            //set the data r
            let theData = res.data[i];
            //build the buttons
            let deleteButton = "";
            let editButton = "";
            //check if its an admin
            if (user.isAdmin == 1) {

                editButton = `<a href="/property/rental-agreements/edit?id=${theData.id}" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-edit fa-sm text-white-50"></i> Edit</a>`
                deleteButton = `<a href="javascript:deleteTableItem(${theData.id},'api/database/table/','${theTable}')" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

            }
            let famount = formatCurencyBaht(theData.amount);
            //add the table rows
            var rowNode = table
                .row.add([theData.id, theData.name, famount, theData.active, theData.createdAt, `${editButton} ${deleteButton}`])
                .draw()
                .node().id = theData.id;

        }
        table.columns.adjust();
    }

    //get the table results for this level.
    let getTableData = () => {
        //build the json
        url = adminUrl + `database/table?tablename=${theTable}&fields=${theFields}&getOnlyTableSchema=${getOnlyTableSchema}&id=${window.localStorage.currentDataItemId}&foreignId=propertyId`
        xhrcall(1, url, "", "json", "", getTableDone, token);
    }

    //process the data item.
    let getMainTableDone = (res) => {
        //store it
        res = JSON.parse(res);
        //console.log(res.data)
        window.localStorage.currentDataItem = JSON.stringify(res.data[0]);
        getTableData();
    }

    //check if we have a current data item 
    if (window.localStorage.currentDataItem == "") {
        //build the json to get the main record from the main table so we can get the foreign ids.
        url = adminUrl + `database/table?tablename=${window.localStorage.mainTable}&fields=&getOnlyTableSchema=${getOnlyTableSchema}&id=${window.localStorage.currentDataItemId}&foreignId=`
        xhrcall(1, url, "", "json", "", getMainTableDone, token)
    } else {
        //build the json
        getTableData();
    }

    //show the body
    document.getElementById('showBody').classList.remove('d-none');


})