/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')
    let xhrDone = (res) => {
        //store it in local storage

        res = JSON.parse(res)
        //get the datatable
        table = $('#dataTable').DataTable();
        for (var i = 0; i < res.length; ++i) {
            console.log(res[i])
            let propertybutton = `<a href="/property/view?id=${res[i].id}" id="ep-${res[i].Name}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> View</a>`
            var rowNode = table
                .row.add([res[i].id, res[i].Name, res[i].published_at, `${propertybutton}`])
                .draw()
                .node().id = res[i].id;
        }
        table.columns.adjust();
    }

    //build the json
    let url = adminUrl + "property-details/"
    xhrcall(1, url, "", "json", "", xhrDone, "")



})