/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')
    let getTableDone = (res) => {
        //parse json
        res = JSON.parse(res)
        //get the datatable
        table = $('#dataTable').DataTable();
        let tmpTableName = "property";
        for (var i = 0; i < res.data.length; ++i) {
            let theData = res.data[i];
            let deleteButton = "";
            let editButton = "";
            let propertySelect = "";
            if (user.isAdmin == 1) {

                editButton = `<a href="/${tmpTableName}/edit?id=${theData.id}" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-edit fa-sm text-white-50"></i> Edit</a>`
                deleteButton = `<a href="javascript:deleteTableItem(${theData.id},'api/database/table/','${tmpTableName}')" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
                propertySelect = `<select onchange="propertySelectChange()" class="form-select" aria-label="Default select example" name="propertySelect" id="propertySelect">
                <option value="0">Please select</option>
  <option value="1">Add Cost</option>
  <option value="2">Add Payment</option>
  <option value="3">Owners</option>
  <option value="4">Token</option>
  <option value="5">Rental agreements</option>
  <option value="audi">Audi</option>
</select>`
            }
            //build the button
            let propertybutton = `<a href="/property/view?id=${theData.id}" id="ep-${theData.name}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> View</a>`

            var rowNode = table
                .row.add([theData.id, theData.name, theData.createdAt, `${propertybutton} ${editButton} ${deleteButton} ${propertySelect}`])
                .draw()
                .node().id = theData.id;

        }
        table.columns.adjust();
    }

    //build the json
    url = adminUrl + "database/table?tablename=property&fields=id,name,createdAt&getOnlyTableSchema=0"
    xhrcall(1, url, "", "json", "", getTableDone, token)
})