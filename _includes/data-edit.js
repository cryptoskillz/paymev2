
//add a ready function

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //get the schema
    let dataitem = getCurrentDataItem();
     let bodyJson ;
    //build the elements
    document.getElementById('formInputs').innerHTML = buildForm(dataitem);
    //show the form
    document.getElementById('showBody').classList.remove('d-none')
    //create button click
    document.getElementById('btn-edit').addEventListener('click', function() {        //api call done
        let xhrDone = (res) => {
            res = JSON.parse(res)
            let data = JSON.parse(res.data)
            updateData(data,1)
            showAlert(res.message, 1)
            document.getElementById('data-header').innerHTML = `Edit ${data.name}`;

        }
        //get the form data
        bodyJson = getFormData()
        //check there is data to submit
        if (bodyJson != false) {
            bodyJson = JSON.parse(bodyJson);
            bodyJson.oldname = dataitem.name;
            bodyJson.id = dataitem.id;
            bodyJson = JSON.stringify(bodyJson);
            //console.log(bodyJson)
            //call it
            xhrcall(4, `api/${dataMainMethod}/`, bodyJson, "json", "", xhrDone, token)
        }
    })
})