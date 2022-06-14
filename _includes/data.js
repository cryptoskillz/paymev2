/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let checkPayment = (secret, id) => {
    //debug
    //console.log(secret);
    //console.log(id)
    let checkDone = (res) => {
        res = JSON.parse(res)
        //check for the  payment response
        //we could just use the first element as the return is always going to be 1 item
        for (var i = 0; i < res.length; ++i) {
            //check if it is 0
            if (res[i].paid == "0") {
                //not paid
                showAlert(`${res[i].id} has not been yet.  You can view it on memspace by clicking <a  href="https://mempool.space/address/${res[i].paymentAddress}" target="_blank">here</a>`, 2,0)
            }
            else
            {
                //paid
                let theItem = getData(res[i].id);
                //update the paid object
                theItem.paid = res[i].paid;
                //update the data
                updateData(theItem,0);
                //show the payment has been made
                //table.row( '#'+res[i].id ).data( theItem ).draw();
                document.getElementById(`payid-${res[i].id}`).innerHTML = res[i].paid;
                //table.row('#' + res[i].id).remove().draw()
                showAlert(`${res[i].id} has been paid.  You can view it on memspace by clicking <a  href="https://mempool.space/address/${res[i].paymentAddress}" target="_blank">here</a>`, 1,0)

            }
        }
    }
    xhrcall(1, `api/payment?s=${secret}&l=1&i=${id}`, "", "json", "", checkDone, token);

}

let loadURL = (theUrl, theId, blank = 0) => {

    //store the current item so we can use it later.
    let theData = getData(theId)
    if (blank == 1)
        window.open(theUrl, "_blank")
    else
        window.location.href = theUrl;
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')
    let xhrDone = (res, local = 0) => {
        //store it in local storage
        if (local == 0) {
            storeData(res);
            res = JSON.parse(res)
        }
        //get the datatable
        table = $('#dataTable').DataTable();
        //loop through the data
        let user = getUser(1);
        for (var i = 0; i < res.data.length; ++i) {
            let tmpName = res.data[i].name.replace(" ", "-");
            //note you may only want one level of items, if so delete this method
            //disabled the code still has to  be written\`<a  href="${paymentWorkerUrl}?s=${theItem.secret}" target="_blank">${paymentWorkerUrl}?s=${theItem.secret}</a>`
            let checkbutton = "";
            if (res.data[i].paid == "0")
                checkbutton = `<a href="javascript:checkPayment('${user.secret}','${res.data[i].id}')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"> <i class="fas fa-globe fa-sm text-white-50"></i> Check</a>`
            else
                checkbutton = `<a href="https://mempool.space/address/${res.data[i].paymentAddress}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" target="_blank"> <i class="fas fa-globe fa-sm text-white-50"></i> View</a>`
 

            let itemsbutton = `<a href="${paymentWorkerUrl}?s=${user.secret}&i=${res.data[i].id}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" target="_blank">
    <i class="fas fa-globe fa-sm text-white-50"></i> Link</a>`
            let editbutton = `<a href="javascript:loadURL('/${dataMainMethod}/edit/','${res.data[i].id}')" id="ep-${tmpName}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            let deletebutton = `<a href="javascript:deleteTableItem('${res.data[i].id}','${res.data[i].id}','api/${dataMainMethod}/')" id="dp-${tmpName}-${i}" class=" d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
            //add the record
            var rowNode = table
                .row.add([res.data[i].id, res.data[i].name, res.data[i].paymentAddress, res.data[i].amount, `<span id="payid-${res.data[i].id}">${res.data[i].paid}</span>`, res.data[i].createdAt, `${editbutton} ${deletebutton} ${itemsbutton} ${checkbutton}`])
                .draw()
                .node().id = res.data[i].id;
        }
        table.columns.adjust();
    }
    theData = getData();
    if (theData != false) {
        xhrDone(theData, 1);
    } else {
        //build the json
        let bodyobj = {
            email: user.email,
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(1, "api/" + dataMainMethod + "/", bodyobjectjson, "json", "", xhrDone, token)

    }

})