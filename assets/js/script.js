const API_KEY = "VT2A3MHzI3OTeHxBnFHDuZhY5uQ"
const API_URL = "https://ci-jshint.herokuapp.com/api"
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e))

// Post request
async function postForm(e){
    const form = new FormData(document.getElementById("checksform"))
   
    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                        body: form,
                        })
            
}

// Get request
async function getStatus(e){
    const querystring = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(querystring)
    const data = await response.json();

    if (response.ok){
        displayData(data)
    } else{
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