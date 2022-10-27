let oldJsonContent = ""

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



    //this function shows the correct edit element
    let setEditorElement = (theElement = "") => {
        //loop through the elements
        for (var i = 0; i < jsonValues.length; i++) {
            //check for a match
            if (theElement.innerHTML == jsonValues[i].innerHTML) {
                //why is this a -
                //console.log(jsonFields[i-1])
                oldJsonContent = `{${jsonFields[i-1].innerHTML}: '${theElement.innerHTML}'}`;

            }

        }
        //console.log(oldJsonContent)

        const theElements = document.querySelectorAll('.editorElement');
        //hide them all, today
        for (const el of theElements) {
            el.classList.add('d-none');
        }
        //check if an editable element was clicked
        if (theElement != "") {
            //show the text editor
            if (theElement.classList.contains('jsoneditor-string')) {
                document.getElementById('editorText').classList.remove('d-none');
                quill.setText(theElement.innerHTML)
                return;
            }
        }

    }





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

    //text changes
    //note : If speed is an is an issue on larger key value pairs we can speed this process up by
    //       updating the JSON directly using the index and removing the historical check, this is 
    //       very much a belts and braces approach at this moment in time.
    quill.on('text-change', function(delta, source) {
        //loop through the json element
        for (var key in jsonContent) {
            //build the old json element
            let tmpJson = `{${key}: '${jsonContent[key]}'}`;
            //check if it matches the old json we stored on the click
            if (tmpJson == oldJsonContent) {
                //get the contents of the text editor
                let newContent = quill.getContents();
                //get the copy
                let tmpNew = newContent.ops[0].insert;
                //clean it up
                tmpNew = tmpNew.trim();
                //buid the new json element
                let newJson = `{${key}: '${tmpNew}'}`;
                //check if anything has changed
                if (newJson != tmpJson) {
                    //update the value
                    jsonContent[key] = tmpNew;
                    //update the json content
                    editor.update(jsonContent);
                    //update the old content
                    oldJsonContent = newJson;
                }

            }

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
        let content2 = editor.getText()
        console.log(content);
        console.log(content2);
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
            console.log(data)
            updateData(2, data, 0)
            showAlert(res.message, 1)
            storeCurrentDataItem(JSON.stringify(data));

        }

        //call the put
        xhrcall(4, `api/content/`, bodyobjectjson, "json", "", xhrDone, token)
    })


    //click function 
    let jsonValueClick = function() {
        console.log('click')
        setEditorElement(this)
    };


    //store the JSON values
    let jsonValues = document.getElementsByClassName("jsoneditor-value");

    //add the event listener to the click. 
    for (var i = 0; i < jsonValues.length; i++) {
        //note : we may only want to make certain fields editable or not. I don't care. 
        jsonValues[i].addEventListener('click', jsonValueClick, false);

    }

    //store the JSON fields
    let jsonFields = document.getElementsByClassName("jsoneditor-field");



    /*
     *  END OF EVENT LISTENERS 
     */

})