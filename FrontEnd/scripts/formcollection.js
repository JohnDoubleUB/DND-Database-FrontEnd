function submitCharacterForm(formData){
    let keyValues = {};
    let skillprofs = {};
    let savingthrows = {};

    for(let element of formData.elements){
        //console.log(String(element.name));
        //console.log(element.type == "checkbox"); // Only type of checkbox
        if(element.name == "skillprofs"){
            skillprofs[element.value] = element.checked;

        } else if (element.name == "savingthrows") {
            savingthrows[element.value] = element.checked;
        } else if(element.name){
            keyValues[element.name] = element.value;
        }

    }
    console.log(keyValues);
    // console.log(savingthrows);
    // console.log(skillprofs);

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