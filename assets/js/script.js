const API_KEY = "VT2A3MHzI3OTeHxBnFHDuZhY5uQ"
const API_URL = "https://ci-jshint.herokuapp.com/api"
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e))

// display error with modal
function displayException(data){
    let heading = "An Exception Occurred"
    let results = `The API returned status code <span>${data.status_code}</span>`
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`
    results += `<div>Error text: <strong>${data.error}</strong></div>` 

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show()
}

// Check that values are right as required by API

function processData(form){
    let optArray = [];

    // Check through the form using the entries()
    for (let entry of form.entries()){
        if (entry[0] === "options"){
            optArray.push(entry[1])
        }
    }

    // form data method of delete
    form.delete("options"); // delete all occurence of option
    form.append("options", optArray.join())

    return form
}

// Post request
async function postForm(e){
    const form = processData(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form,
                        });
    const data = await response.json();
    if (response.ok){
        displayError(data)
    }else{
        displayException(data)
        throw new Error(data.error);
    }
}

// Display error function
function displayError(data) {
    let heading =  `JS hint Results for ${data.file}`;
    if (data.total_errors === 0){
        results = `<div class="no-errors">No errors to report!</div>`
    } else {
        results =  `<div>Total Errors: <span class="error-count">${data.total_errors}</span>`;
        for (let error of data.error_list){
            results += `<div>At line <span class="line">${error.line}</span>,`
            results += `column <span class="column">${error.col}<\span>`;
            results += `<div class="error">${error.error}</div>`
        }
        document.getElementById("resultsModalTitle").innerText = heading;
        document.getElementById("results-content").innerHTML = results;
        resultsModal.show()
    }
}

// Get request
async function getStatus(e){
    const querystring = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(querystring)
    const data = await response.json();

    if (response.ok){
        displayData(data)
    } else{
        displayException(data)
        throw new Error(data.error)
    }
}
function displayData(data){
    console.log(data.expiry)
    let heading = "API KEY STATUS"
    let results = `<div>Your key is valid until </div>`
    results +=  `<div class="key-status">${data.expiry}</div>`;
    
    document.getElementById("resultsModalTitle").innerText = heading; 
    document.getElementById("results-content").innerHTML = results
    resultsModal.show()
}