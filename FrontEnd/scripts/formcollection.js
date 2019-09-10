const url = new URLSearchParams(location.search);

function submitCharacterForm(formData){
    let keyValues = {};

    for(let element of formData.elements){
        if(element.name){
            keyValues[element.name] = element.value;
        }

    }
    console.log(keyValues);

    makeRequest("http://localhost:9000/characters", keyValues, type="POST")
    .then(data => {
        console.log("Create character worked!" + data)
        let parsedData = JSON.parse(data);
        // let playerId = document.getElementById("playerId")
        // playerId.innerHTML = "";

        // let defaultDrop = document.createElement("option");
        // defaultDrop.innerText = "[Create a New Character]"
        // defaultDrop.value="n";
        // playerId.appendChild(defaultDrop);
        

        // buildDropdown("http://localhost:9000/characters");
        window.location.href = "create-edit-character.html" + "?id=" + parsedData.id

    })
    .catch(data => {
        console.log("Create character failed!" + data);
    })

    return false;
}

function submitInventoryForm(formData){
    let keyValues = {};

    for(let element of formData.elements){
        if(element.name){
            keyValues[element.name] = element.value;
        }
    }
    console.log(keyValues);

    return false;
}

function checkV(box, resting){
    if(parseInt(box.value) < parseInt(box.min)){
        box.value = parseInt(resting);
    } else if(parseInt(box.value) > parseInt(box.max)) {
        box.value = parseInt(resting);
    }
}

function buildDropdown(dataLink){
    let playerId = document.getElementById("playerId");
    
    makeRequest(dataLink)
    .then(data => {
        console.log("it worked!" + data);

        let parsedData = JSON.parse(data)
        for(key of parsedData){
            // Create option
            let dropDResult = document.createElement("option");
            // Add name for option
            dropDResult.innerText = key["name"];
            dropDResult.value = key["id"];


            paramId = url.get('id');
            if(String(key["id"]) === String(paramId)){
                dropDResult.selected="selected";
            }

            //Add to the existing dropdown
            playerId.appendChild(dropDResult);

        }

    })
    .catch(data => {
        console.log("It failed!" + data);
    })
}