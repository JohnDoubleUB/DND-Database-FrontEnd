const url = new URLSearchParams(location.search);

//player selection dropdown
const pDropDown = document.getElementById("playerId");

function submitCharacterForm(formData){
    let keyValues = {};

    for(let element of formData.elements){
        if(element.name){
            keyValues[element.name] = element.value;
        }

    }
    console.log(keyValues);

    //If the value of the dropdown is n, then we are creating a new item!
    if(pDropDown.value === "n"){
        makeRequest("http://localhost:9000/characters", keyValues, type="POST")
        .then(data => {
        console.log("Create character worked!" + data);
        let parsedData = JSON.parse(data);
        window.location.href = "create-edit-character.html" + "?id=" + parsedData.id;

        })
        .catch(data => {
            console.log("Create character failed!" + data);
        });
    } else {
        makeRequest("http://localhost:9000/characters/" + pDropDown.value, keyValues, type="PUT")
        .then(data => {
        console.log("Create character worked!" + data);
        let parsedData = JSON.parse(data);
        window.location.href = "create-edit-character.html" + "?id=" + parsedData.id;

        })
        .catch(data => {
            console.log("Create character failed!" + data);
        }); 
    }
    return false;
}


function updateCharacterFields(box){
    if(box.value !== "n"){
        
        let id = parseInt(box.value);
        makeRequest("http://localhost:9000/characters/", box.value)
        .then((data) => {
            let parsedData = JSON.parse(data);
            console.log(parsedData);
            setCharacterFields(parsedData);

        })
        .catch((data) => {

        });
        
    } else {
        setCharacterFields(false);
    }

}


function setCharacterFields(newData){
    let cFieldsArray = ["name", "race", "playerClass", "alignment", "background", "baseCha", 
    "baseCon", "baseDex","baseHP", "baseInt", "baseProficiency", "baseStr", "baseWis", "level"];
    
    let cDefaultsArray = ["", "", "", "", "", 10, 10, 10, 10, 10, 1, 10, 10, 1];

    if(newData){
        for(field of cFieldsArray){
            document.getElementById(field).value = newData[field];
        }
    } else {
        for(let i = 0; i < cFieldsArray.length; i++){
            document.getElementById(cFieldsArray[i]).value=cDefaultsArray[i];
        }
    }
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

        let parsedData = JSON.parse(data);
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
        updateCharacterFields(playerId);

    })
    .catch(data => {
        console.log("It failed!" + data);
    })
}