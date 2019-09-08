let tabHead = document.getElementById("tableHead");
let tabBod = document.getElementById("tableBody");

let dummyHeaders = ["Id", "Name", "Class", "Alignment", "Base Str", "Base Dex", "Base End", "Base Con", "Base Cha", "Base Wis", "Base Health", "Option1", "Option2"];
let dummyData = [
    ["1", "bob", "Fighter", "Chaotic Neutral", "10", "12", "14","17","12", "12", "5"],
    ["2", "jeff", "Monk", "Chaotic Evil", "9", "12", "20","17","12", "12", "10"]
];



function buildTable(tableSection, tableData, body=false){
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
        let link ="ViewPetsByOwner.html";

        //The link plus id!
        //let idLink ="<button onclick=\"location.href='"+link+tableData[0]+"'\""+">"+buttonName+"</button>";
        
        //The link plus id as param
        let idLinkParam = "<button onclick=\"location.href='"+link+"?id="+tableData[0]+"'\""+">Pet Info</button>";

        console.log(idLinkParam);

        contInner.innerHTML = idLinkParam;
        
        container.appendChild(contInner);

        //Make field for View user

        contInner = document.createElement("td");



        link ="ViewSpecificOwnersDetails.html";


        idLinkParam = "<button onclick=\"location.href='"+link+"?id="+tableData[0]+"'\""+">User Info</button>";

        contInner.innerHTML = idLinkParam;
        
        container.appendChild(contInner);
        
    }
}