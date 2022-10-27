let oldContent = ""

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

    /*
     *  START OF JSON EDITOR CODE
     */

    // create the editor
    const container = document.getElementById("jsoneditor")
    const options = {}
    const editor = new JSONEditor(container, options)
    // set the editor
    editor.set(dataitem.content);

    /*
     *  END OF JSON EDITOR CODE
     */

    /*
     *  START OF QUILL
     */
    var quill = new Quill('#editor-container', {
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'font': [] }],
                [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
                [{ 'align': [] }],
                [, 'code-block'],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                ['clean'] // remove formatting button
            ]
        },
        placeholder: 'Compose an epic...',
        theme: 'snow' // or 'bubble'


    });

    //this function shows the correct edit element
    let setEditorElement = (theElement = "") => {
        document.getElementById('editorText').classList.remove('d-none');
        oldContent = theElement.innerHTML;
        quill.setText(theElement.innerHTML)
    }


    //update the json editor
    quill.on('text-change', function(delta, source) {
        //get the content
        let newContent = quill.getContents();
        newContent = newContent.ops[0].insert;
        //clean it up
        newContent = newContent.trim();
        //get the json
        let jsonContent = editor.get();
        //check if we have to update (we always should but costs nothing to check)
        if (oldContent != newContent)
        {
            //turn the json into a string
            jsonContent = JSON.stringify(jsonContent);
            //replace the content
            //note if we have the same content in a node this will cause an issue, will fix it later. 
            jsonContent = jsonContent.replace(oldContent, newContent);
            //turn it back into Json
            jsonContent = JSON.parse(jsonContent);
            //update the editor
            editor.update(jsonContent);
            //replace old content
            oldContent = newContent;
        }
    });

    /*
     *  END OF QUILL
     */


    /*
     *  START OF EVENT LISTENERS 
     */


    document.getElementById('btn-save').addEventListener('click', function() {
        //get the JSON

        let content = editor.get();
        //let content2 = editor.getText()
        //console.log(content);
        //console.log(content2);
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
            updateData(2, data, 0)
            showAlert(res.message, 1)
            storeCurrentDataItem(JSON.stringify(data));

        }

        //call the put
        xhrcall(4, `api/content/`, bodyobjectjson, "json", "", xhrDone, token)
    })


    //click function 

    //find the json object. 
    window.onclick = e => {
        if (e.target.classList.contains("jsoneditor-string") == true) {
            setEditorElement(e.target)
        }
    }

    /*
     *  END OF EVENT LISTENERS 
     */

})