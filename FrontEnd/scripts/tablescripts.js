const tabHead = document.getElementById("tableHead");
const tabBod = document.getElementById("tableBody");

let dummyHeaders = ["Id", "Name", "Class", "Alignment", "Base Str", "Base Dex", "Base End", "Base Con", "Base Cha", "Base Wis", "Base Health", "Option1", "Option2"];
let dummyData = [
    ["1", "bob", "Fighter", "Chaotic Neutral", "10", "12", "14","17","12", "12", "5"],
    ["2", "jeff", "Monk", "Chaotic Evil", "9", "12", "20","17","12", "12", "10"]
];


function getItemValues(record){
    let data = [];
    
    for(let item in record){
        if(record.hasOwnProperty(item)){
            data.push(record[item])
        }
    }

    return data;
}

function getItemNames(record){
    let data = [];

    for(let item in record){
        if(record.hasOwnProperty(item)){
            data.push(item);
        }
    }

    return data;
}


function loadTableData(head, body, dataLink, buttonFunction, identifier="", excludeIdentifier=false){
    makeRequest(dataLink)
    .then((data) => {
        console.log("It worked!" + data);
        
        //Parse data
        let parsedData = JSON.parse(data);
        
        //Create arrays
        let headers = [];
        let tableData = [];
        let recIds = [];


        //Fill tableDataArray with all customerd data
        for(let record of parsedData) {
            let recordSet = getItemValues(record, identifier, excludeIdentifier); //Add an exclude argument to function as well as here!
            
            recIds.push(record[identifier]);
            tableData.push(recordSet);
        }
        
        //Get headers for the table
        headers = getItemNames(parsedData[0], identifier, excludeIdentifier); //Add an exclude argument to function as well as here!
        
        //Add option if there is any table entires
        if(headers.length > 0) { headers.push("Option"); }

        //Empty table head
        head.innerHTML = "";

        //Empty table body
        body.innerHTML = "";

        //Build Table head
        buildTable(head, headers, true);
        
        
        //Replace with iterative for loop
        for(let i = 0; i < tableData.length; i++){
            let dData = tableData[i];
            let recId = i; //recIds[i]; //This way they are uniquely numbered but nicely!
            buildTable(body, dData, false, buttonFunction, recId);            
        }

    })
    .catch((data) => {
        console.log("It failed!" + data);
    });
}


function deleteCharacterId(id){
    makeRequest("http://"+DB_ADDRESS+":9000/characters/", id, type="DELETE")
    .then((data) => {
        parsedData = JSON.parse(data);
        makeRequest("http://"+DB_ADDRESS+":9000/inventories/playerid/",parsedData.id, type="DELETE");
        loadTableData(tabHead, tabBod, "http://"+DB_ADDRESS+":9000/characters", "deleteCharacterId");
    })
    .catch((data) => {
        console.log("It failed!" + data);
    })
}



function deleteInventoryId(id){
    makeRequest("http://"+DB_ADDRESS+":9000/inventories/", id, type="DELETE")
    .then((data) => {
        loadTableData(tabHead, tabBod, "http://"+DB_ADDRESS+":9000/inventories", "deleteCharacterId");
    })
    .catch((data) => {
        console.log("It failed!" + data);
    });
}



function buildTable(tableSection, tableData, head=false, buttonFunction, recId){
    let container = document.createElement("tr");
    tableSection.appendChild(container);

    if(head){
        buildTableHead(container, tableData);
    } else {   
        //Define container id/name here!
        container.id="trd-id"+recId;
        buildTableBody(container, tableData);
        
        // Create delete buttons!
        let contInner = document.createElement("td");
        contInner.innerHTML = makeButton(buttonFunction, tableData[0],"Delete" ,"btn btn-light p-3");
        container.appendChild(contInner);  
    }
}



//Builds body based on array to container
function buildTableHead(container, dataArray){ //To head
    for(let data of dataArray){
        contInner = document.createElement("th")
        contInner.scope = "col";
        contInner.innerText = data;
        container.appendChild(contInner);
    }
}



//Builds head based on array to container
function buildTableBody(container, tableData){ // To body
    let firstRun = true;
    
    for(let data of tableData){
        contInner = document.createElement("td");
    
        if(firstRun){
            contInner.scope ="row"
            firstRun = false;
        }

        contInner.innerText = data;
        container.appendChild(contInner);
    }
}

function makeButton(functionName, functionArgument, buttonText, classStyling){
    return "<button class=\"" + classStyling + "\" onclick=\""+functionName+"('"+functionArgument+"')\""+">" + buttonText + "</button>";
}