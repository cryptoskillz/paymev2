/*
todo 


*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

/*
This function handles the property select
*/
let propertySelectChange = (id, theElement) => {
    //clear the current element
    window.localStorage.currentDataItem = "";
    //store the ID
    window.localStorage.currentDataItemId = id;
    //store the table
    window.localStorage.mainTable = theTable;
    //find out which one we are going to.
    switch (theElement.value) {
        case "1":
            window.location.href = `/property/rental-agreements/`

            break;
        case "2":
            window.location.href = `/property/tokens/`

            break;
        case "3":
            window.location.href = `/property/owners/`
            break;
        case "4":
            window.location.href = `/property/distributions/`
            break;
        case "5":
            window.location.href = `/property/costs/`
            break;
        case "6":
            window.location.href = `/property/payments/`
            break;
    }
}


whenDocumentReady(isReady = () => {

    let getTableDone = (res) => {
        //parse json
        res = JSON.parse(res)
        if (allowOnlyOne == 1)
        {
            if (res.data.length == 0)
                document.getElementById('btn-create-cy').classList.remove('d-none');
        }
        else
        {
            document.getElementById('btn-create-cy').classList.remove('d-none');
        }
        //get the datatable
        table = $('#dataTable').DataTable();
        //process the results
        for (var i = 0; i < res.data.length; ++i) {
            //set the data r
            let theData = res.data[i];
            //build the buttons
            let deleteButton = "";
            let editButton = "";
            let propertySelect = "";
            //build the buttons
            let reportButton = "";
            if (theCrumb == "/property/") {
                reportButton = `<a href="/property/report?id=${theData.id}" id="ep-${theData.name}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> Report</a>`
            }

            //check if its an admin
            if (user.isAdmin == 1) {

                editButton = `<a href="${theCrumb}edit?id=${theData.id}" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-edit fa-sm text-white-50"></i> Edit</a>`
                deleteButton = `<a href="javascript:deleteTableItem(${theData.id},'api/database/table/','${theTable}')" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
                if (theCrumb == "/property/") {
                    propertySelect = `<select onchange="propertySelectChange(${theData.id},this)" class="form-select" aria-label="Default select example" name="propertySelect-${i}" id="propertySelect-${i}">
                <option value="0">Please select</option>
                  <option value="1">Rental agreements</option>
 <option value="2">Token</option>
  <option value="3">Owners</option>
 <option value="4">Distributions</option>
  <option value="5">Costs</option>
  <option value="6">Payments</option>


</select>`
                }
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
                if (key == "amount")
                    tmpValue = formatCurencyBaht(tmpValue);
                //add the row

                //check if its a hyperlink 
                let res = isValidHttpUrl(tmpValue);
                if (res == true)
                {
                    tmpValue = `<a href="${tmpValue}" target="_blank">${tmpValue}</a>`
                }
                tableRow.push(tmpValue);
            }
            buildColumn = 1;
            tableRow.push(`${reportButton} ${editButton} ${deleteButton} ${propertySelect}`);
            //add the table rows
            var rowNode = table
                .row.add(tableRow)
                .draw()
                .node().id = theData.id;

        }
        table.columns.adjust();
    }

    //get the table results for this level.
    let getTableData = () => {
       
        if (foreignKeys == "")
            url = adminUrl + `database/table?checkAdmin=${checkAdmin}&tablename=${theTable}&fields=${theFields}&getOnlyTableSchema=${getOnlyTableSchema}`
        else
            url = adminUrl + `database/table?checkAdmin=${checkAdmin}&tablename=${theTable}&fields=${theFields}&getOnlyTableSchema=${getOnlyTableSchema}&id=${window.localStorage.currentDataItemId}&foreignId=${foreignKeys.id}`;
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
    if (window.localStorage.currentDataItem != "") {
        if (window.location.pathname != `/${level1name}/`) {
            let tmpJson = JSON.parse(window.localStorage.currentDataItem);
            //console.log(tmpJson.name)
            document.getElementById('recordTitle').innerHTML = tmpJson.name;
        }
    }

})