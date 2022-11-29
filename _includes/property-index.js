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
        for (var i = 0; i < res.data.length; ++i) {
            let theData = res.data[i];
            //build the button
            let propertybutton = `<a href="/property/view?id=${theData.id}" id="ep-${theData.name}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> View</a>`

            var rowNode = table
                .row.add([theData.id, theData.name, theData.published_at, `${propertybutton}`])
                .draw()
                .node().id = theData.id;

        }
        table.columns.adjust();
    }

    //build the json
    url = adminUrl + "database/table?tablename=property&fields=id,name,published_at&getOnlyTableSchema=0"
    xhrcall(1, url, "", "json", "", getTableDone, token)
})