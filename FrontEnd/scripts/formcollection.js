const url = new URLSearchParams(location.search);
const dbaddress = "34.89.110.1";

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
        makeRequest("http://"+dbaddress+":9000/characters", keyValues, type="POST")
        .then(data => {
        console.log("Create character worked!" + data);
        let parsedData = JSON.parse(data);
        console.log(parsedData);

        //Refresh dropdown
        refreshDropDown(pDropDown);
        buildDropdown("http://"+dbaddress+":9000/characters", parsedData.id);

        //updateCharacterFields(playerId);
        //window.location.href = "create-edit-character.html" + "?id=" + parsedData.id;

        })
        .catch(data => {
            console.log("Create character failed!" + data);
        });
    } else {
        makeRequest("http://"+dbaddress+":9000/characters/" + pDropDown.value, keyValues, type="PUT")
        .then(data => {
        console.log("Create character worked!" + data);
        let parsedData = JSON.parse(data);
        
        console.log(parsedData);

        refreshDropDown(pDropDown);
        buildDropdown("http://"+dbaddress+":9000/characters", parsedData.id);
        //window.location.href = "create-edit-character.html" + "?id=" + parsedData.id;

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
        makeRequest("http://localhost:9000/characters/", id)
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

function updateInventoryFields(box){
    if(box.value !== "n"){
        let pId = parseInt(box.value);

        makeRequest("http://localhost:9000/inventories/playerid/", pId)
        .then((data) => {
            let parsedData = JSON.parse(data);
            console.log(parsedData);
            setInventoryFields(parsedData[0]);
        })
        .catch((data) => {

        });   
    } else {
        setInventoryFields(false)
    }
}

function refreshDropDown(dropDown, defaultDrop=["n","[Create a New Character]"] ){
    dropDown.innerHTML = "";
    let defaultOption = document.createElement("option");
    defaultOption.value=defaultDrop[0];
    defaultOption.innerText=defaultDrop[1];
    dropDown.appendChild(defaultOption);
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
    console.log("Inventory submission form!");

    //Check that the user has selected a character
    if(formData.playerId.value !== "n"){
        
        for(let element of formData.elements){
            if(element.name){
                keyValues[element.name] = element.value;
            }
        }
        console.log(keyValues);

        //Get current inventories
        makeRequest("http://localhost:9000/inventories")
        .then((data) => { 
            let parsedData = JSON.parse(data); 
            //Check if any for the given player id exist already
            let idExists = false;

            for(inventory of parsedData){
                console.log("playerId matcher: "+ inventory["playerId"])
                if(String(playerId.value) === String(inventory.playerId)) {
                    idExists = true;
                    console.log("IdMatch!");
                    break;
                }
            }

            //If the an inventory for this player id doesn't exist create one
            if(!idExists){
                makeRequest("http://localhost:9000/inventories", keyValues, type="POST")
                .then((data) => {
                    console.log("it worked!", data);
                })
                .catch((data) => {
                    console.log("it failed!", data);
                });
            } else { //If an inventory does exist then update it!
                makeRequest("http://localhost:9000/inventories/playerid/" + formData.playerId.value, keyValues, type="PUT")
                .then((data) => {
                    console.log("Update Worked!", data);
                })
                .catch((data) => {
                    console.log("it failed!", data);
                });
            }

        })
        .catch((data) => {
            return false
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

function buildDropdown(dataLink, selectedValue="n"){
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

        playerId.value=selectedValue;

    })
    .catch(data => {
        console.log("It failed!" + data);
    });
}