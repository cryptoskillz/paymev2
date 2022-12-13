let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let propertydetails = "";
let propertycontracts = ""; //get owner info
let propertyrentals = "";
let propertyowners = "";
let propId = 1;
let url = "";

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')




    //get the main property details
    let propertyDone = (res) => {
        res = JSON.parse(res);
        //debug
        //console.log(res);
        //console.log(res.agreements.length);
        formatCurencyUSD

        //main property details
        let table = `<table class="table">`
        table = addTableRow("Name", res.property.name, table);
        table = addTableRow("Cost", formatCurencyUSD(res.property.internationalCost), table);
        table = addTableRow("Taxes", formatCurencyUSD(res.property.internationalTaxesCost), table);
        table = addTableRow("Currency",res.property.internationalCurrency, table);
        table = addTableRow("Contract", `<a href="${res.token.blockExplorerUrl}" target="_blank">${res.token.contractAddress}</a>`, table);
        table = table + "</table>";
        table = table + "</table>";
        //console.log(table)
        let theTable = document.getElementById("property-table");
        theTable.innerHTML = table;

        //rental aggrements
        table = $('#rental-aggrement-table').DataTable();
        for (var i = 0; i < res.agreements.length; ++i) {
            let tmp = res.agreements[i];
            //set the active state
            let isActive = "Yes"
            if (tmp.active == 0)
                isActive = "No"
            //add a table
            var rowNode = table
                .row.add([tmp.id, tmp.name, tmp.amount,tmp.deposit,tmp.startDate,tmp.endDate,isActive])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();

        //owners
        table = $('#ownerstable').DataTable();
        for (var i = 0; i < res.owners.length; ++i) {
            //get the owner
            let owner = res.owners[i];
            //set the percentage
            let per = owner.tokenAmount / res.token.totalSupply;
            per = per *100
            per = Math.round(per);
            //build the address
            let address = `<a href="${owner.address}" target="_blank">view</a>`
            //format the currency 
            let famount = owner.tokenAmount;
            //set the amount
            let amount = `${famount} (${per}%)`
            //add the table row
            var rowNode = table
                .row.add([owner.id, owner.name, owner.email,address,amount])
                .draw()
                .node().id = owner.id;
        }
        table.columns.adjust();

        //payments
        table = $('#paidintable').DataTable();
        let total = 0;
        let nettotal = 0;
        for (var i = 0; i < res.payments.length; ++i) {
            let tmp = res.payments[i];
            total = total + tmp.amountInternational;
            let famount = formatCurencyUSD(tmp.amountInternational);
            var rowNode = table
                .row.add([tmp.id, tmp.type, tmp.name,famount,tmp.datePaid])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();
        //update the total
        document.getElementById("paidintotal").innerHTML = formatCurencyUSD(total);
        //reset the total
        nettotal = total;
        total = 0;
        //costs
        table = $('#paidouttable').DataTable();
        for (var i = 0; i < res.costs.length; ++i) {
            let tmp = res.costs[i];
            total = total + tmp.amountInternational;
            let famount = formatCurencyUSD(tmp.amountInternational);
            var rowNode = table
                .row.add([tmp.id, tmp.type, tmp.name,famount,tmp.datePaid])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();
        //update the total
        document.getElementById("paidouttotal").innerHTML = formatCurencyUSD(total);
        nettotal = nettotal-total;
        total = 0;

        //distribution

        //reset the total
        total = 0;
        //costs
        table = $('#disttable').DataTable();
        for (var i = 0; i < res.distributions.length; ++i) {
            let tmp = res.distributions[i];
            total = total + tmp.amountInternational;
            let famount = formatCurencyUSD(tmp.amountInternational);
            var rowNode = table
                .row.add([tmp.id, tmp.name, tmp.description,famount,tmp.datePaid])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();
        //update the total
        document.getElementById("totaldist").innerHTML = formatCurencyUSD(total);
        nettotal = nettotal - total;
        document.getElementById("totalleft").innerHTML = formatCurencyUSD(nettotal);
        //show it
        document.getElementById("propertydiv").classList.remove("d-none");

    }
    url = adminUrl + "properties/report?id=1"
    xhrcall(1, url, "", "json", "", propertyDone, "")



})