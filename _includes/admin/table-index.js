/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let customSelectChange = (el) => {
    switch (el.selectedIndex) {
        case 1:
            window.open(el.value, '_blank');
            break;
        case 2:
            checkPayment(el.value);
            break;
    }

}


let checkPayment = (url) => {
    let checkDone = (res) => {
        console.log(res)
        res = JSON.parse(res)
        if (res.confirmed == true) {
            showAlert('Payment has been received', 1)
        } else {
            showAlert('Payment has not been received', 1)
        }
    }
    //console.log(url)
    xhrcall(1, url, "", "json", "", checkDone, token);
}


whenDocumentReady(isReady = () => {

    if (typeof lookUps === 'undefined') {
        var lookUps = "";
    } else {
        lookUps = JSON.stringify(lookUps);
    }
    //console.log(lookUps);

    let getTableDone = (res) => {

        let deleteButton = "";
        let editButton = "";

        if (typeof formatFields === 'undefined') {
            formatFields = "";
        }

        if (typeof customSelect === 'undefined') {
            customSelect = "";
        }

        if (typeof customButton === 'undefined') {
            customButton = "";
        }
        if (typeof customSelect === 'undefined') {
            customSelect = "";
        }

        if (typeof localLookUp === 'undefined') {
            localLookUp = "";
        }

        if (typeof localLookupField === 'undefined') {
            localLookupField = "";
        }

        if (typeof hideEdit === 'undefined') {
            hideEdit = "";
        }

        if (typeof hideDelete === 'undefined') {
            hideDelete = "";
        }

        // customButton = "";
        //parse json
        res = JSON.parse(res)
        if (allowOnlyOne == 1) {
            if (res.data.length == 0)
                document.getElementById('btn-create-cy').classList.remove('d-none');
        } else {
            document.getElementById('btn-create-cy').classList.remove('d-none');
        }
        //get the datatable
        table = $('#dataTable').DataTable();
        //process the results
        for (var i = 0; i < res.data.length; ++i) {
            //set the data 
            let theData = res.data[i];
            console.log(theData);
            //build the buttons
            deleteButton = "";
            editButton = "";
            //note : move these to a funtion 
            //parse the custom button
            let tmpCb = customButton
            tmpCb = tmpCb.replaceAll("[id]", theData.id);
            tmpCb = tmpCb.replaceAll("[name]", theData.name);
            tmpCb = tmpCb.replaceAll("[counter]", i);
            tmpCb = tmpCb.replaceAll("[orderid]", theData.orderId);
            //parse the custom select

            tmpCs = customSelect
            tmpCs = tmpCs.replaceAll("[id]", theData.id);
            tmpCs = customSelect.replaceAll("[name]", theData.name);
            tmpCs = tmpCs.replaceAll("[counter]", i);
            tmpCs = tmpCs.replaceAll("[orderid]", theData.orderId);
            tmpCs = tmpCs.replaceAll("[address]", theData.address);
            tmpCs = tmpCs.replaceAll("[cryptocurrency]", theData.paymentType)

            //check if its an admin
            if (user.isAdmin == 1) {
                editButton = `<a href="${theCrumb}edit?id=${theData.id}" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-edit fa-sm text-white-50"></i> Edit</a>`
                deleteButton = `<a href="javascript:deleteTableItem(${theData.id},'/database/table/','${theTable}')" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
                if (hideEdit == 1)
                    editButton = "";
                if (hideDelete == 1)
                    deleteButton = "";


            }

            //set a table row array
            let tableRow = [];
            //set the amount
            let famount = 0;
            //loop through the keys
            for (const key in theData) {
                //set the data
                let tData = theData;
                //set the value
                let tmpValue = tData[key];
                //check if we have to format it
                //note this is checking the field name we could use the scheam and check if it is real 

                //check if its a hyperlink 
                let res = isValidHttpUrl(tmpValue);
                if (res == true) {
                    tmpValue = `<a href="${tmpValue}" target="_blank">${tmpValue}</a>`
                }

                //check if it is a local look up
                if (key == localLookupField) {
                    //loop through the local url
                    for (var i2 = 0; i2 < localLookUp.length; ++i2) {
                        let tData2 = localLookUp[i2];
                        if (tData2.lookValue = tmpValue)
                            tmpValue = tData2.replaceValue
                        //console.log(tData2)
                    }
                }



                for (var i2 = 0; i2 < formatFields.length; ++i2) {
                    if (key == formatFields[i2].field) {
                        //console.log(formatFields[i2])
                        tmpValue = eval(formatFields[i2].function)
                    }
                }


                tableRow.push(tmpValue);
            }

            buildColumn = 1;
            tableRow.push(`${editButton} ${deleteButton} ${tmpCb} ${tmpCs} `);
            //add the table rows
            var rowNode = table
                .row.add(tableRow)
                .draw()
                .node().id = theData.id;

        }
        //var head_item = table.columns(1).header();
        //console.log(head_item)
        //document.getElementById(head_item).innerHTML = 'sss'
        //table.column( 0 ).header().text( 'My title' ); 

        if ((editButton == "") && (deleteButton == "") && (customButton == "") && (customSelect == "")) {
            table.column(table.columns().nodes().length - 1).visible(false)
            table.columns.adjust();
        }
    }

    //get the table results for this level.
    let getTableData = () => {


        if (foreignKeys == "")
            url = apiUrl + `database/table?checkAdmin=${checkAdmin}&tablename=${theTable}&fields=${theFields}&getOnlyTableSchema=${getOnlyTableSchema}&theData=${lookUps}`
        else
            url = apiUrl + `database/table?checkAdmin=${checkAdmin}&tablename=${theTable}&fields=${theFields}&getOnlyTableSchema=${getOnlyTableSchema}&id=${window.localStorage.currentDataItemId}&foreignId=${foreignKeys.id}&lookUps=${lookUps}`;
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
        url = apiUrl + `database/table?tablename=${window.localStorage.mainTable}&fields=&getOnlyTableSchema=${getOnlyTableSchema}&id=${window.localStorage.currentDataItemId}&foreignId=&theData=${lookUps}`
        xhrcall(1, url, "", "json", "", getMainTableDone, token)
    } else {
        //build the json
        getTableData();
    }

    //show the body
    document.getElementById('showBody').classList.remove('d-none');
    if (window.localStorage.currentDataItem != "") {
        if (window.location.pathname != `/${level1name}/`) {
            let tmpJson = JSON.parse(window.localStorage.currentDataItem);
            //console.log(tmpJson.name)
            document.getElementById('recordTitle').innerHTML = tmpJson.name;
        }
    }

})