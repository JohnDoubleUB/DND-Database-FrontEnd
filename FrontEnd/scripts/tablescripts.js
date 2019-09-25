const tabHead = document.getElementById("tableHead");
const tabBod = document.getElementById("tableBody");


function makeButton(functionName, functionArgument, buttonText, classStyling){
    return "<button class=\"" + classStyling + "\" onclick=\""+functionName+"('"+functionArgument+"')\""+">" + buttonText + "</button>";
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



function buildCharacterTable(){

    let cTableHeaders = ["#", "Character Name", "Race", "Class", "Alignment", "Background", "Level", "Base Stats", "HP", "Proficiency", "Option"];
    
    tabHead.innerHTML = "";
    tabBod.innerHTML = "";

    buildTable(tabHead, cTableHeaders, true);

    makeRequest("http://"+DB_ADDRESS+":9000/characters").then((data) => {
        let parsedData = JSON.parse(data);
        //let baseStatNames = [str];
        let cTableBody = [];
        let idCounter = 0;

        for(let record of parsedData){

            idCounter++;

            cBaseStats = "Str: " + record.baseStr + "\n";
            cBaseStats += "Int: " + record.baseInt + "\n";
            cBaseStats += "Wis: " + record.baseWis + "\n";
            cBaseStats += "Cha: " + record.baseCha + "\n";
            cBaseStats += "Dex: " + record.baseDex + "\n";
            cBaseStats += "Con: " + record.baseCon + "\n";

            cTableBody = [record.id, record.name, record.race, record.playerClass, record.alignment, record.background, record.level, cBaseStats, record.baseHP, record.baseProficiency];

            buildTable(tabBod, cTableBody, head=false, "deleteCharacterId", idCounter);
        }
    });
}


function buildInventoryTable(){
    
    let iTableHeaders = ["#", "Owning Character", "CP", "SP", "GP", "PP", "Equipment", "Option"];

    tabHead.innerHTML = "";
    tabBod.innerHTML = "";

    buildTable(tabHead, iTableHeaders, true);

    makeRequest("http://"+DB_ADDRESS+":9000/characters").then((characterData) => {
        makeRequest("http://"+DB_ADDRESS+":9000/inventories").then((inventoryData) => {
            let parsedCharData = JSON.parse(characterData);
            let parsedInvData = JSON.parse(inventoryData);

            let iTableBody = [];
            let playerIdNames = {};

            console.log(parsedCharData);
            console.log(parsedInvData);

            for(let record of parsedCharData){
                playerIdNames[record.id] = record.name;
            }

            let idCounter = 0;

            for(let record of parsedInvData){
                idCounter++;
                iTableBody = [record.id, playerIdNames[record.playerId], record.copperPiece, record.silverPiece, record.goldPiece, record.platinumPiece, record.equipment];
                buildTable(tabBod, iTableBody, head=false, "deleteInventoryId", idCounter);
            }
        });
    });
}


function deleteCharacterId(id){
    makeRequest("http://"+DB_ADDRESS+":9000/characters/", id, type="DELETE")
    .then((data) => {
        parsedData = JSON.parse(data);
        makeRequest("http://"+DB_ADDRESS+":9000/inventories/playerid/",parsedData.id, type="DELETE");
        buildCharacterTable();
    });
}



function deleteInventoryId(id){
    makeRequest("http://"+DB_ADDRESS+":9000/inventories/", id, type="DELETE")
    .then((data) => {
        buildInventoryTable();
    });
}