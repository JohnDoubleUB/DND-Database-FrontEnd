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


function loadTableData(head, body, dataLink, buttonFunction){
    makeRequest(dataLink)
    .then((data) => {
        console.log("It worked!" + data);
        
        //Parse data
        let parsedData = JSON.parse(data);
        
        //Create arrays
        let headers = [];
        let tableData = [];

        //Fill tableDataArray with all customerd data
        for(let record of parsedData) {
            let recordSet = getItemValues(record);
            tableData.push(recordSet);
        }
        
        //Get headers for the table
        headers = getItemNames(parsedData[0]);
        
        //Add option if there is any table entires
        if(headers.length > 0) { headers.push("Option"); }

        //Build Table head
        buildTable(head, headers, true);
        
        //Build table body
        for(let dData of tableData){
            buildTable(body, dData, false, buttonFunction);
        }

    })
    .catch((data) => {
        console.log("It failed!" + data);
    });
}


function deleteCharacterId(id){
    makeRequest("http://localhost:9000/characters/", id, type="DELETE")
    .then((data) => {
        parsedData = JSON.parse(data);
        makeRequest("http://localhost:9000/inventories/playerid/",parsedData.id, type="DELETE");
        window.location.href = window.location.href;
    })
    .catch((data) => {
        console.log("It failed!" + data);
    })
}



function deleteInventoryId(id){
    makeRequest("http://localhost:9000/inventories/", id, type="DELETE")
    .then((data) => {
        window.location.href = window.location.href;
    })
    .catch((data) => {
        console.log("It failed!" + data);
    });
}



function buildTable(tableSection, tableData, body=false, buttonFunction){
    let container = document.createElement("tr");
    tableSection.appendChild(container);

    if(body){
        buildTableBody(container, tableData);
    } else {   
        buildTableHead(container, tableData);
        
        // Create delete buttons!
        let contInner = document.createElement("td");
        contInner.innerHTML = makeButton(buttonFunction, tableData[0],"Delete" ,"btn btn-light p-3");
        container.appendChild(contInner);  
    }
}



//Builds body based on array to container
function buildTableBody(container, dataArray){
    for(let data of dataArray){
        contInner = document.createElement("th")
        contInner.scope = "col";
        contInner.innerText = data;
        container.appendChild(contInner);
    }
}



//Builds head based on array to container
function buildTableHead(container, tableData){
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