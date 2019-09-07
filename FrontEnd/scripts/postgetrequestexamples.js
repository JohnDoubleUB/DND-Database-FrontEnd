


//Effectively a submission form of its own!/ Page specific, wont work on its own!
function delUser(){
    let uName = document.getElementById("username").innerText;
    let pWord = document.getElementById("password").innerText;

    uName = uName.replace("username: ","");
    pWord = pWord.replace("password: ", "");

    let completeParam="?"+"username="+uName+"&password="+pWord;

    makeRequest("https://us-central1-qac-sandbox-c347f.cloudfunctions.net/deleteUser", completeParam, type="DELETE")
    .then((data)=>{
        console.log("it Worked!" + data);
        location.href = "login.html";
    })
    .catch((data)=>{
        console.log("It failed!" + data);
    })

}


//Helper Function
function makeParams(form){
    let result = "?"
    for(let element of form.elements){
        if(element.name){
            result += element.name + "=" + element.value + "&";
        }
    }

    return result.substring(0, result.length - 1);
}

//submission form!
function loginRequest(form){

    let result = makeParams(form);

    console.log(form[0].name + form[0].value);

    makeRequest("https://us-central1-qac-sandbox-c347f.cloudfunctions.net/login", result)
    .then((data)=>{
        console.log("It worked!" + JSON.parse(data));
        
        location.href = "user.html?"+form[0].name +"="+ form[0].value;

    })
    .catch((data)=>{
        console.log("It failed!" + data);
    })

    return false;
}

//submission form!
function newAccountSubmit(form){
    let resultObject = {}

    for(let element of form.elements){
        if(element.name){
            resultObject[element.name] = element.value;
        }
    }
    
    console.log(JSON.stringify(resultObject));

    makeRequest("https://us-central1-qac-sandbox-c347f.cloudfunctions.net/setUser", resultObject, "POST")
    .then(()=>{
        console.log("It worked!");
    })
    .catch((data)=>{
        console.log("It failed!" + data);
    })

    return false;
}