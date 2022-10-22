let currentJsonElement;
let currentJsonBoolean = 0;

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


whenDocumentReady(isReady = () => {

	//this function shows the correct edit element
let setEditorElement = (theElement = "") => {
	//get the elements
   	const theElements = document.querySelectorAll('.editorElement');
   	//hide them all, today
	for (const el of theElements) {
	  el.classList.add('d-none');
	}
	//check if an editable element was clicked
    if (theElement != "")
    {
    	//show the text editor
	    if (theElement.classList.contains('jsoneditor-string')) {
	        document.getElementById('editorText').classList.remove('d-none');
	        quill.setText(theElement.innerHTML)
        	currentJsonElement = theElement;
	        return;
	    }
	    //show the number editor
	    if (theElement.classList.contains('jsoneditor-number')) {
	        document.getElementById('editorNumber').classList.remove('d-none');
	        document.getElementById('editor-number').value = theElement.innerHTML;
	        return;
	    }
	    //show the boolean editor
	    if (theElement.classList.contains('jsoneditor-boolean')) {
	        document.getElementById('editorBoolean').classList.remove('d-none')
	        return;
	    }
	}

}


	/*
	*	START OF JSON EDITOR CODE
	*/


    // create the editor
    const container = document.getElementById("jsoneditor")
    const options = {}
    const editor = new JSONEditor(container, options)

    // set json
    const initialJson = {
        "Array": [1, 2, 3],
        "Boolean": true,
        "Null": null,
        "Number": 123,
        "Object": { "a": "b", "c": "d" },
        "String": "Hello,friend",
        "String2": "2Hello,friend"
    }
    editor.set(initialJson);



    // get json
    const updatedJson = editor.get();

	/*
	*	END OF JSON EDITOR CODE
	*/

	/*
	*	START OF QUILL CODE
	*/

    //init quill
    var quill = new Quill('#editor-container', {
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
            ]
        },
        placeholder: 'Compose an epic...',
        theme: 'snow' // or 'bubble'


    })

    //text changes
    quill.on('text-change', function(delta, source) {

        if (currentJsonBoolean == 1) {
            //console.log(delta)
            //console.log(source)
            let tmp = quill.getContents();
            console.log(tmp.ops[0])
            //console.log(tmp.ops[0].insert)
            currentJsonElement.innerHTML = tmp.ops[0].insert;
        } else {
            currentJsonBoolean = 1;
        }

    });

   	/*
	*	END OF QUILL CODE
	*/


	/*
	*	START OF EVENT LISTENERS 
	*/


    //click function 
    let jsonValueClick = function() {
        currentJsonBoolean = 0;
        setEditorElement(this)
    };

    //store the JSON values
    let jsonValues = document.getElementsByClassName("jsoneditor-value");

    //add the event listener to the click. 
    for (var i = 0; i < jsonValues.length; i++) {
        //note : we may only want to make certain fields editable or not. I don't care. 
        jsonValues[i].addEventListener('click', jsonValueClick, false);

    }


    //click function 
    let jsonFieldClick = () => {
    	//hide the editor elements.
        setEditorElement();
    }

    //store the JSON fields
    let jsonFields = document.getElementsByClassName("jsoneditor-field");

    //add the event listener to the click. 
    for (var i = 0; i < jsonFields.length; i++) {
        jsonFields[i].addEventListener('click', jsonFieldClick, false);
    }

	/*
	*	END OF EVENT LISTENERS 
	*/

})