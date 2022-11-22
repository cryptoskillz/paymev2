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

    let formatCurencyBaht = (code) => {
        const formatter = new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 2
        })
        let currency = formatter.format(code)
        return (currency)
    }

    let addTableRow = (name, value, table) => {
        table = table + `<tr><th scope="row">${name}:</th><td>${value}</td></tr>`
        return (table)
    }

    //get the main property details
    let propertyDone = (res) => {
        res = JSON.parse(res);
        console.log(res);
        //console.log(res.agreements.length);

        //main property details
        let table = `<table class="table">`
        table = addTableRow("Name", res.property.name, table);
        table = addTableRow("Cost", res.property.local_cost, table);
        table = addTableRow("Taxes", res.property.taxes_cost, table);
        table = addTableRow("Currency", "฿", table);
        table = addTableRow("Contract", `<a href="${res.token.address}" target="_blank">
            ${res.token.address}</a>`, table);
        table = table + "</table>";
        table = table + "</table>";
        //console.log(table)
        let theTable = document.getElementById("property-table");
        theTable.innerHTML = table;

        //rental aggrements
        table = $('#rental-aggrement-table').DataTable();
        for (var i = 0; i < res.agreements.length; ++i) {
            let tmp = res.agreements[i];
            let isActive = "Yes"
            if (tmp.active == 0)
                isActive = "No"

            var rowNode = table
                .row.add([tmp.id, tmp.name, tmp.amount,tmp.deposit,tmp.start_date,tmp.end_date,isActive])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();

        //owners
        table = $('#ownerstable').DataTable();
        for (var i = 0; i < res.owners.length; ++i) {
            let tmp = res.owners[i];
            let per = tmp.amount / res.token.total_supply;
            per = per *100
            let famount = formatCurencyBaht(tmp.amount);
            let amount = `${famount} (%${per})`
            var rowNode = table
                .row.add([tmp.id, tmp.name, tmp.email,tmp.address,amount])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();

        //payments
        table = $('#paidintable').DataTable();
        let total = 0;
        let nettotal = 0;
        for (var i = 0; i < res.payments.length; ++i) {
            let tmp = res.payments[i];
            total = total + tmp.amount;
            let famount = formatCurencyBaht(tmp.amount);
            var rowNode = table
                .row.add([tmp.id, tmp.type, tmp.description,famount,tmp.date_paid])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();
        //update the total
        document.getElementById("paidintotal").innerHTML = formatCurencyBaht(total);
        //reset the total
        nettotal = total;
        total = 0;
        //costs
        table = $('#paidouttable').DataTable();
        for (var i = 0; i < res.costs.length; ++i) {
            let tmp = res.costs[i];
            total = total + tmp.amount;
            let famount = formatCurencyBaht(tmp.amount);
            var rowNode = table
                .row.add([tmp.id, tmp.type, tmp.description,famount,tmp.date_paid])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();
        //update the total
        document.getElementById("paidouttotal").innerHTML = formatCurencyBaht(total);
        nettotal = nettotal-total;
        total = 0;

        //distribution

        //reset the total
        total = 0;
        //costs
        table = $('#disttable').DataTable();
        for (var i = 0; i < res.distributions.length; ++i) {
            let tmp = res.distributions[i];
            total = total + tmp.amount;
            let famount = formatCurencyBaht(tmp.amount);
            var rowNode = table
                .row.add([tmp.id, tmp.name, tmp.description,famount,tmp.date_paid])
                .draw()
                .node().id = tmp.id;
        }
        table.columns.adjust();
        //update the total
        document.getElementById("totaldist").innerHTML = formatCurencyBaht(total);
        nettotal = nettotal - total;
        document.getElementById("totalleft").innerHTML = formatCurencyBaht(nettotal);
        //show it
        document.getElementById("propertydiv").classList.remove("d-none");

    }
    url = adminUrl + "properties/report?id=1"
    xhrcall(1, url, "", "json", "", propertyDone, "")



})