const tabHead = document.getElementById("tableHead");
const tabBod = document.getElementById("tableBody");

let dummyHeaders = ["Id", "Name", "Class", "Alignment", "Base Str", "Base Dex", "Base End", "Base Con", "Base Cha", "Base Wis", "Base Health", "Option1", "Option2"];
let dummyData = [
    ["1", "bob", "Fighter", "Chaotic Neutral", "10", "12", "14","17","12", "12", "5"],
    ["2", "jeff", "Monk", "Chaotic Evil", "9", "12", "20","17","12", "12", "10"]
];


function getItemValues(record, excludeValues=false, groupData=false, replaceWith=false){
    let data = [];
    let groupedData = "";
    let groupedDataCount = 0;
    
    let matcher = replaceWith[1];
    let keys = replaceWith[0];

    
    for(let item in record){
        
        if(replaceWith && item === matcher){
            data.push(keys[record[item]]);
            continue;
        }

        //filter out grouped data
        if(groupData && groupData[0].some(group => group === item)){
            groupedData += item + ": " + record[item] + "\n";
            groupedDataCount++;
            if(groupedDataCount === groupData[0].length){
                data.push(groupedData);
            }
            continue;
        }
        
        if(excludeValues && excludeValues.some(exclude => exclude === item)){
            continue;
        }

        if(record.hasOwnProperty(item)){
            data.push(record[item]);
        }
    }
    return data;
}

function getItemNames(record, excludeValues=false, groupData=false){
    let data = [];
    let dataGrouped = false;

    for(let item in record){
        
        //filter out grouped data
        if(groupData && groupData[0].some(group => group === item)){
            if(!dataGrouped){
                data.push(groupData[1]);
                dataGrouped = true;
            }
            continue;
        }

        if(excludeValues && excludeValues.some(exclude => exclude === item)){
            continue;
        }

        if(record.hasOwnProperty(item)){
            data.push(item);
        }
    }
    return data;
}

function loadTableData(head, body, dataLink, buttonFunction, identifier="", excludeValues=false, groupData=false, niceNames=false, enterValue=false){
    let keyValues = [];

    makeRequest(dataLink)
    .then((data) => {
        if(enterValue){
            
            makeRequest(enterValue[0]).then(data2 => {
                let parsedData = JSON.parse(data2);
                let keyValueSets = {};

                for(let dataSet of parsedData){
                    keyValueSets[dataSet[enterValue[1]]] = dataSet[enterValue[2]];
                }

                keyValues.push(keyValueSets);
                keyValues.push(enterValue[3]);

                loadTable(data, head, body, buttonFunction, identifier, excludeValues, groupData, niceNames, keyValues);
            });
        } else {
            loadTable(data, head, body, buttonFunction, identifier, excludeValues, groupData, niceNames);
        }
    });
}


function loadTable(data, head, body, buttonFunction, identifier="", excludeValues=false, groupData=false, niceNames=false, keyValues=false){
    console.log("It worked!" + data);

    //Parse data
    let parsedData = JSON.parse(data);

    //Create arrays
    let headers = [];
    let tableData = [];
    let recIds = [];


    //Fill tableDataArray with all customerd data
    for (let record of parsedData) {

        let recordSet = getItemValues(record, excludeValues, groupData, keyValues); //Add an exclude argument to function as well as here!

        recIds.push(record[identifier]);
        tableData.push(recordSet);
    }

    //if using nice names, set the headers to be those instead!
    if (niceNames) {
        headers = niceNames;
    } else {
        //Get headers for the table
        headers = getItemNames(parsedData[0], excludeValues, groupData, niceNames); //Add an exclude argument to function as well as here!
    }

    //Add option if there is any table entires
    if (headers.length > 0) { headers.push("Option"); }

    //Empty table head
    head.innerHTML = "";

    //Empty table body
    body.innerHTML = "";

    //Build Table head
    buildTable(head, headers, true);


    //Replace with iterative for loop
    for (let i = 0; i < tableData.length; i++) {
        let dData = tableData[i];
        let recId = i; //recIds[i]; //This way they are uniquely numbered but nicely!
        buildTable(body, dData, false, buttonFunction, recId);
    }
}


function deleteCharacterId(id){
    makeRequest("http://"+DB_ADDRESS+":9000/characters/", id, type="DELETE")
    .then((data) => {
        parsedData = JSON.parse(data);
        makeRequest("http://"+DB_ADDRESS+":9000/inventories/playerid/",parsedData.id, type="DELETE");
        loadTableData(tabHead, tabBod, "http://"+DB_ADDRESS+":9000/characters", "deleteCharacterId","id", false, [["baseInt", "baseDex", "baseCon", "baseWis", "baseCha", "baseStr"], "Base Stats"], ["#", "Character Name","Race", "Class", "Alignment", "Background", "Level", "Base Stats", "HP", "Proficiency"]);
    })
    .catch((data) => {
        console.log("It failed!" + data);
    })
}



function deleteInventoryId(id){
    makeRequest("http://"+DB_ADDRESS+":9000/inventories/", id, type="DELETE")
    .then((data) => {
        loadTableData(tabHead, tabBod, "http://"+DB_ADDRESS+":9000/inventories", "deleteInventoryId","playerId", false, false, ["#", "Owning Character", "CP", "SP", "GP", "PP", "Equipment"], ["http://"+DB_ADDRESS+":9000/characters", "id", "name", "playerId"]);
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
        let contInner = document.createElement("th");
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

function buildCharacterTable(){
    loadTableData(tabHead, tabBod, 
        "http://"+DB_ADDRESS+":9000/characters", 
        "deleteCharacterId","id", false, 
        [["baseInt", "baseDex", "baseCon", "baseWis", "baseCha", "baseStr"], "Base Stats"], 
        ["#", "Character Name","Race", "Class", "Alignment", "Background", "Level", "Base Stats", "HP", "Proficiency"]);
}

function buildInventoryTable(){
    loadTableData(tabHead, tabBod, 
        "http://"+DB_ADDRESS+":9000/inventories", "deleteInventoryId","playerId", 
        false, false, ["#", "Owning Character", "CP", "SP", "GP", "PP", "Equipment"], 
        ["http://"+DB_ADDRESS+":9000/characters", "id", "name", "playerId"]);
}