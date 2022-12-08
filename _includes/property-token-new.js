
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
            //show the body div
        document.getElementById('showBody').classList.remove('d-none');

   //console.log(window.localStorage.currentDataItem)
   let dataItem = JSON.parse(window.localStorage.currentDataItem);
   let name= dataItem.name.replace(" ","");
   let symbol = name.substring(0,3);
   document.getElementById('inp-name').value = name+'Token';
   document.getElementById('inp-totalSupply').value = dataItem.localCost;
   document.getElementById('inp-contractSymbol').value = symbol;
   document.getElementById('inp-propertyId').value = dataItem.id;
   console.log(theEl)


});