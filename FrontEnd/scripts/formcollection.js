const url = new URLSearchParams(location.search);

//player selection dropdown
const pDropDown = document.getElementById("playerId");

function refreshDropDown(dropDown, defaultDrop=["n","[Create a New Character]"] ){
    dropDown.innerHTML = "";
    let defaultOption = document.createElement("option");
    defaultOption.value=defaultDrop[0];
    defaultOption.innerText=defaultDrop[1];
    dropDown.appendChild(defaultOption);
}

function buildDropdown(dataLink, selectedValue="n"){
    let playerId = document.getElementById("playerId");
    
    makeRequest(dataLink)
    .then((data) => {
        console.log("it worked!" + data);

        let parsedData = JSON.parse(data);
        for(let key of parsedData){
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

        playerId.value=selectedValue;
    });
}


function setCharacterFields(newData){
    let cFieldsArray = ["name", "race", "playerClass", "alignment", "background", "baseCha", 
    "baseCon", "baseDex","baseHP", "baseInt", "baseProficiency", "baseStr", "baseWis", "level"];
    
    let cDefaultsArray = ["", "", "", "", "", 10, 10, 10, 10, 10, 1, 10, 10, 1];

    if(newData){
        for(let field of cFieldsArray){
            document.getElementById(field).value = newData[field];
        }
    } else {
        for(let i = 0; i < cFieldsArray.length; i++){
            
            document.getElementById(cFieldsArray[i]).value=cDefaultsArray[i];
        }
    }
}

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
        makeRequest("http://"+DB_ADDRESS+":9000/characters", keyValues, type="POST")
        .then(data => {
        console.log("Create character worked!" + data);
        let parsedData = JSON.parse(data);
        console.log(parsedData);

        //Refresh dropdown
        refreshDropDown(pDropDown);
        buildDropdown("http://"+DB_ADDRESS+":9000/characters", parsedData.id);

        //updateCharacterFields(playerId);
        //window.location.href = "create-edit-character.html" + "?id=" + parsedData.id;

        });
    } else {
        makeRequest("http://"+DB_ADDRESS+":9000/characters/" + pDropDown.value, keyValues, type="PUT")
        .then(data => {
        console.log("Create character worked!" + data);
        let parsedData = JSON.parse(data);
        
        console.log(parsedData);

        refreshDropDown(pDropDown);
        buildDropdown("http://"+DB_ADDRESS+":9000/characters", parsedData.id);
        });
    }
    return false;
}


function updateCharacterFields(box){
    if(box.value !== "n"){
        
        let id = parseInt(box.value, 10);
        makeRequest("http://"+DB_ADDRESS+":9000/characters/", id)
        .then((data) => {
            let parsedData = JSON.parse(data);
            console.log(parsedData);
            setCharacterFields(parsedData);

        });
    } else {
        setCharacterFields(false);
    }

}

function setInventoryFields(newData){
    let iFieldsArray = ["copperPiece", "goldPiece", "silverPiece", "platinumPiece", "equipment"];
    let iDefaultsArray = [0, 0, 0, 0, ""];

    if(newData){
        for(field of iFieldsArray){
            document.getElementById(field).value = newData[field];
        }
    } else {
        for(let i = 0; i < iFieldsArray.length; i++){
            document.getElementById(iFieldsArray[i]).value=iDefaultsArray[i];
        }
    }
}

function updateInventoryFields(box){
    if(box.value !== "n"){
        let pId = parseInt(box.value, 10);

        makeRequest("http://"+DB_ADDRESS+":9000/inventories/playerid/", pId)
        .then((data) => {
            let parsedData = JSON.parse(data);
            console.log(parsedData);
            setInventoryFields(parsedData[0]);
        });

    } else {
        setInventoryFields(false);
    }
}

function submitInventoryForm(formData){
    let keyValues = {};

    //Check that the user has selected a character
    if(formData.playerId.value !== "n"){
        
        for(let element of formData.elements){
            if(element.name){
                keyValues[element.name] = element.value;
            }
        }
        console.log(keyValues);

        //Get current inventories
        makeRequest("http://"+DB_ADDRESS+":9000/inventories")
        .then((data) => { 
            let parsedData = JSON.parse(data); 
            //Check if any for the given player id exist already
            let idExists = false;

            for(let inventory of parsedData){
                console.log("playerId matcher: "+ inventory["playerId"])
                if(String(playerId.value) === String(inventory.playerId)) {
                    idExists = true;
                    break;
                }
            }

            //If the an inventory for this player id doesn't exist create one
            if(!idExists){
                makeRequest("http://"+DB_ADDRESS+":9000/inventories", keyValues, type="POST");
            } else { //If an inventory does exist then update it!
                makeRequest("http://"+DB_ADDRESS+":9000/inventories/playerid/" + formData.playerId.value, keyValues, type="PUT");   
            }
        });
    }
    return false;
}


function checkV(box, resting){
    if(parseInt(box.value) < parseInt(box.min)){
        box.value = parseInt(resting);
    } else if(parseInt(box.value) > parseInt(box.max)) {
        box.value = parseInt(resting);
    }
}