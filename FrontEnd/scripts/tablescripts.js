let tabHead = document.getElementById("tableHead");
let tabBod = document.getElementById("tableBody");

let dummyHeaders = ["Id", "Name", "Class", "Alignment", "Base Str", "Base Dex", "Base End", "Base Con", "Base Cha", "Base Wis", "Base Health", "Option1", "Option2"];
let dummyData = [
    ["1", "bob", "Fighter", "Chaotic Neutral", "10", "12", "14","17","12", "12", "5"],
    ["2", "jeff", "Monk", "Chaotic Evil", "9", "12", "20","17","12", "12", "10"]
];


function loadTableData(head, body, dataLink, buttonFunction){
    makeRequest(dataLink)
    .then((data)=>{
        console.log("It worked!" + data);
        let parsedData = JSON.parse(data);
        let firstTime = true;
        let headers = [];
        let tableData = [];

        for(let record of parsedData){
            let recordSet = [];
            for(let item in record){
                if(record.hasOwnProperty(item)){
                    if(firstTime){ headers.push(item); }
                    recordSet.push(record[item])
                    //console.log(item + "=" + record[item])
                }
            }
            tableData.push(recordSet);
            firstTime = false;
        }
        if(headers.length > 0){
            headers.push("Option");
        }

        buildTable(head, headers, true);
        
        for(let dData of tableData){
            buildTable(body, dData, false, buttonFunction);
        }

    })
    .catch((data)=>{
        console.log("It failed!" + data);
    })
}

function deleteCharacterId(id){
    makeRequest("http://localhost:9000/characters/", id, type="DELETE")
    .then((data)=>{
        window.location.href = window.location.href;
    })
    .catch((data)=>{
        console.log("It failed!" + data);
    })
}

function deleteInventoryId(id){
    makeRequest("http://localhost:9000/inventories/", id, type="DELETE")
    .then((data)=>{
        window.location.href = window.location.href;
    })
    .catch((data)=>{
        console.log("It failed!" + data);
    })
}

function buildTable(tableSection, tableData, body=false, buttonFunction){
    let container;
    let contInner;

    container = document.createElement("tr");
    tableSection.appendChild(container);

    if(body){
        for(let data of tableData){
            contInner = document.createElement("th")
            contInner.scope = "col";
            contInner.innerText = data;
            container.appendChild(contInner);
        }
    } else {
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
        contInner = document.createElement("td");

        //Where the information needs to go

        //The link plus id!
        //let idLink ="<button onclick=\"location.href='"+link+tableData[0]+"'\""+">"+buttonName+"</button>";
        
        //The link plus id as param

        //let idLinkParam = "<button onclick=\"location.href='"+link+"?id="+tableData[0]+"'\""+">Pet Info</button>";
        let idLinkParam = "<button class=\"btn btn-light p-3\" onclick=\""+buttonFunction+"('"+tableData[0]+"')\""+">Delete</button>";

        console.log(idLinkParam);

        contInner.innerHTML = idLinkParam;
        
        container.appendChild(contInner);

        
        
    }
}