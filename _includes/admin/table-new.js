//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    //process the result from the table API call.
    let getTableDone = (res) => {
        res = JSON.parse(res);
        //debug
        //console.log(res)
        let formHtml = "";
        for (var i = 0; i < res.schema.length; ++i) {
            //console.log(res[i].name)
            formHtml = formHtml + buildFormElement(res.schema[i]);
        }
        //set table name
        document.getElementById('formTableName').value = theTable;
        //set the inputs
        document.getElementById('formInputs').innerHTML = formHtml;

        //show the body div
        document.getElementById('showBody').classList.remove('d-none');
    }



    //set the tmpName
    let tmpName = theTable.replace("_", " ");
    document.getElementById('data-header').innerHTML = `add a new ${tmpName}`

    //call the data
    url = adminUrl + `database/table?tablename=${theTable}&fields=${theFields}&getOnlyTableSchema=1`
    xhrcall(1, url, "", "json", "", getTableDone, token);

});