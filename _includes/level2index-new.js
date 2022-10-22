/*

to do 

do not allow duplicate names

*/



//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //build the elements
    document.getElementById('formInputs').innerHTML = buildForm();
    //show the form
    document.getElementById('showBody').classList.remove('d-none')
    //create button click
    document.getElementById('btn-create').addEventListener('click', function() {
        //api call done
        let xhrDone = (res) => {
            addDataItem(2,res, 0);
            res = JSON.parse(res)
            showAlert(res.message, 1, 0);
            document.getElementById('data-header').innerHTML = "";
            document.getElementById('formdiv').classList.add("d-none");
            document.getElementById('btn-create').classList.add("d-none");

        }
        //get the form data
        let bodyJson = getFormData()
        let user = getUser()
        bodyJson = JSON.parse(bodyJson);
        bodyJson.level1id = window.localStorage.level1selectedid;
        bodyJson = JSON.stringify(bodyJson);
        console.log('body json')
        console.log(bodyJson);
        //check there is data to submit
        if (bodyJson != false) {
            //call it
            xhrcall(0, `api/${level2name}/`, bodyJson, "json", "", xhrDone, token)
        }
    })




})