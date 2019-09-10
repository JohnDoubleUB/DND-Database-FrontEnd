//http=Address to make request, param=either url params or json params if using post!
function makeRequest(http, param, type="GET", rqstHdrStr="Content-Type", rqstHdrVal="application/json"){
    // Create a promise to test whether the connection was a success
    return new Promise((resolve, reject) => {
        
        const xhr = new XMLHttpRequest(); // Create xh request!

        xhr.onload = (data) => {

            // If POST then 201 is the indicator of success!
            if(xhr.status === 200 || xhr.status === 201){
                resolve(xhr.response); // Success!
            } else {
                reject(xhr.status); // Failure
            }

        };

    //Changing how we deal with it based on if it is or isn't a post request!
    if(type.toUpperCase() === "POST" || type.toUpperCase() === "PUT"){ // If post or put request!
        xhr.open(type.toUpperCase(), http);
        
        xhr.setRequestHeader(rqstHdrStr, rqstHdrVal);//This is important!

        xhr.send(JSON.stringify(param)); // Send data via json
    } else { //If not a post request!
        
        if(param == null){ // If no params given
            xhr.open(type.toUpperCase(), http);
        } else {
            xhr.open(type.toUpperCase(), http + param);
        }
    
        xhr.send(); // Send request!
    }
    });
}