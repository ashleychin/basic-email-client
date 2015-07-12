function registerFunction() {
    var pwOne = document.getElementById("pw1").value; // Takes the values entered in registerForm
    var pwTwo = document.getElementById("pw2").value;
    var personName=document.getElementById("personName").value;
    var personSurname=document.getElementById("personSurname").value;
    var personID=document.getElementById("personID").value;
    var personpassword=document.getElementById("pw1").value;

    if (pwOne!=pwTwo){ // Checks password fields match
        
        	var para = document.createElement("p");							//Appends passwords not matched message to form
        	var registerform = document.getElementsByName("registerForm")[0];
        	var message = document.createTextNode("Passwords don't match");
        	registerform.appendChild(para);
        	para.appendChild(message);
        
        return false;
        }
        else { // Request only sent to server if passwords match
       var request = new XMLHttpRequest();
  	request.open("POST", "PHP/RegisterNewUser.php?Name="+personName+"&Surname="+personSurname+"&userID="+personID+"&passWD="+personpassword, false);
  	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  	request.send(null);
  	
  		var para = document.createElement("p");								//Appends registration successful message
  		var registerform = document.getElementsByName("registerForm")[0];
  		var message = document.createTextNode(request.responseText);
  		registerform.appendChild(para);
  		para.appendChild(message);
    
    if (request.responseText == "registered") { // If response from PHP script shows registration is successful...
    sessionStorage.rememberUser = personID; // Stores the userID until logoutFunction is invoked
  	window.location.href="inbox.html"; // Redirect to inbox page
  	return false;
  	}
  	  	}
}

function loginFunction() {
var personID = document.getElementById("useId").value; // Takes values entered into loginForm
var paswd = document.getElementById("paswd").value;
var request = new XMLHttpRequest();
  	request.open("POST", "PHP/checkuser.php?userID="+personID+"&passWD="+paswd, false); // Sends values to server via PHP script
  	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  	request.send(null);
  	if (request.responseText == "registered") {
  	sessionStorage.rememberUser = personID; // If login is successful, userID is stored
  	window.location.href="inbox.html";
  	return false;
  	} else {
  	    var para = document.createElement("p");								//Appends not registered message
  		var loginform = document.getElementsByName("loginForm")[0];
  		var message = document.createTextNode(request.responseText);
  		loginform.appendChild(para);
  		para.appendChild(message);
  		return false;
  	}
}

function loadInbox() {
    var personID = sessionStorage.rememberUser; // Value is stored userID
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "PHP/checkmail1.php?userID=" + personID, false); // Request for mail based on userID
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
    var response = xhr.responseXML;
    for (var i=0; i<response.getElementsByTagName("mail").length; i++) { //For each mail element
         var inboxTable = document.getElementById("inboxTable");
         var mailItem = inboxTable.insertRow(1); //Insert row to the top of the table so latest shows first
         var mailSender = document.createElement("td"); //Create td
         var mailSubject = document.createElement("td");
         var mailDate = document.createElement("td");
                 
                 mailSender.innerHTML = response.getElementsByTagName("sender")[i].firstChild.nodeValue; //Put the values from XML into td elements
                 mailSubject.innerHTML = response.getElementsByTagName("subject")[i].firstChild.nodeValue;
                 mailDate.innerHTML = response.getElementsByTagName("date")[i].firstChild.nodeValue;
                 mailItem.id = response.getElementsByTagName("mailid")[i].firstChild.nodeValue;
                 mailItem.setAttribute("onclick", "readMessage(this.id, this);"); //Adds function to tr
                 
                 mailItem.appendChild(mailSender); //Adds td elements to the tr
                 mailItem.appendChild(mailSubject);
                 mailItem.appendChild(mailDate);
                 
                 var status = response.getElementsByTagName("status")[i].firstChild.nodeValue;
                 if (status == "unread") {
                 mailItem.style.fontWeight = "bold"; //Shows unread messages in bold
                 }
	 }}

function readMessage(uniqueMailID, rowNumber) { //Function that shows and updates messages when read
var xhr = new XMLHttpRequest();
    xhr.open("POST", "PHP/update.php?mailID=" + uniqueMailID, false); //Request that updates message to read
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
    var response = xhr.responseXML;
    var mailContent = response.getElementsByTagName("message")[0].firstChild.nodeValue; //Retrieves message content
    var table = document.getElementById("inboxTable");
    var messageRow = table.insertRow((rowNumber.rowIndex) + 1); //Adds row underneath the one clicked on
    var messageData = document.createElement("td");
    messageData.setAttribute("colspan", "3"); //Row spans width of table
    messageData.innerHTML = mailContent;
    messageRow.appendChild(messageData);
    var messageHeaderRow = document.getElementById(uniqueMailID);
    messageHeaderRow.setAttribute("onclick", "hideMessage(this.id, this);"); //Changes function from readMessage to hideMessage
    
    var status = response.getElementsByTagName("status")[0].firstChild.nodeValue;
                 if (status == "read") {
                 messageHeaderRow.style.fontWeight = "normal"; //Changes message to 'read'
                 }
}

function hideMessage(uniqueMailID, rowNumber) { //Function to delete table row that holds message content
document.getElementById("inboxTable").deleteRow((rowNumber.rowIndex) + 1);
var messageHeaderRow = document.getElementById(uniqueMailID);
    messageHeaderRow.setAttribute("onclick", "readMessage(this.id, this);"); //Changes function back to readMessage
}

function logoutFunction() {
    sessionStorage.removeItem("rememberUser"); //Deletes userID from memory
    window.location.href="Email.html"; //Redirect to homepage
    return false;
}

function newMailFunction(){
var sendForm = document.getElementById("sendForm");
var formClass = sendForm.getAttributeNode("class");
    if (formClass.value=="hidden"){
        var personID = sessionStorage.rememberUser;
        var fromElement = document.getElementById("fromID");
        fromElement.setAttribute("value", personID); //Adds userID as 'from' value
        formClass.value = "show"; //Shows sendForm at top of page
    }
    else {
        formClass.value = "hidden"; //Hides sendForm
    }
}

function sendEmail(){ //Function that takes values from sendForm and sends them to server
var sender = document.getElementById("fromID").value;
var personID = document.getElementById("toID").value;
var subj = document.getElementById("messageSubject").value;
var msg = document.getElementById("messageBody").value;
var dat = new Date();
var xhr = new XMLHttpRequest();
    xhr.open("POST", "PHP/insert.php?id=" + personID + "&sender=" + sender + "&subject=" + subj + "&message=" + msg + "&date=" + dat, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);

		var alertBox = document.getElementById("alertBox");				//Appends sent message alert to form
		alertBox.innerHTML = xhr.responseText;
		
		newMailFunction();
return false;
}