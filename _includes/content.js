let currentJsonElement;
let currentJsonBoolean = 0;

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


whenDocumentReady(isReady = () => {
    //remove the show body
    document.getElementById('showBody').classList.remove('d-none');
    //update the page header
    document.getElementById("content-header").innerHTML = `edit page ${window.localStorage.level2selecteditem} for site ${window.localStorage.level1selecteditem}`
    let dataitem = getCurrentDataItem();
    //console.log(dataitem);
    //set the json content
    let jsonContent = dataitem.content
    /*
     *  START OF JSON EDITOR CODE
     */


    // create the editor
    const container = document.getElementById("jsoneditor")
    const options = {}
    const editor = new JSONEditor(container, options)

    // set json
    const initialJson = jsonContent
    editor.set(initialJson);

    /*
     *  END OF JSON EDITOR CODE
     */


    document.getElementById('btn-save').addEventListener('click', function() {  
        //get the JSON
        let content = editor.get();
        let bodyJson = {}
        //add the ids
        bodyJson.content = content;
        bodyJson.level1id = window.localStorage.level1selectedid;
        bodyJson.level2id = window.localStorage.level2selectedid;
        bodyobjectjson = JSON.stringify(bodyJson);
        //console.log(bodyobjectjson);

        let xhrDone = (res) => {
            res = JSON.parse(res)
            let data = JSON.parse(res.data)
            //console.log(data)
            updateData(2,data,0)
            showAlert(res.message, 1)
            storeCurrentDataItem(theItem.data);

        }

        //call the put
        xhrcall(4, `api/content/`, bodyobjectjson, "json", "", xhrDone, token)
    })



    /*
     *  END OF EVENT LISTENERS 
     */

})