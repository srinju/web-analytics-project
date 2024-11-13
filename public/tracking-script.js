

//get the location that is wher the user is doing events in thier website  bascially the website of their
//get the document of the user to monitor any click events or any kind of events


(function () {
    ("use strict")
    var location = window.location; //contains information about the current url
    var document = window.document; //current window document that is the DOM
    var scriptElement = document.currentScript; //grabs the script tag that is currently running
    var dataDomain = scriptElement.getAttribute('data-domain'); //take the attribute in the script called data-domain which contains a domain string used for tracking 
    var endpoint = "http://localhost:3000/api/track";

    function generateSessionId () { //generating a random session id
        return "session-" + Math.random().toString(36).substr(2,9);
    }

    function initialiseSession() { //check for existing session then generate session
        var sessionId = localStorage.getItem("session_id");
        var expirationTimestamp = localStorage.getItem("session_expiration_timestamp");
        if(!sessionId || !expirationTimestamp) {
            sessionId = generateSessionId();
            //set expiration timestamp>
            expirationTimestamp = Date.now() + 10 * 60 * 1000; // 10 mins
            localStorage.setItem("session_id" , sessionId);
            localStorage.setItem("session_expiration_timestamp" , expirationTimestamp);
        }
        return {
            sessionId : sessionId,
            expirationTimestamp : parseInt(expirationTimestamp) //parse the string and return an integer
        }
    }

    function isSessionExpired(expirationTimestamp) {
        return Date.now() >= expirationTimestamp; //if the session is expired then the current date is greater than the expired timestamp
    }

    //check session function is called when the user is landed on the website so I called the function outside in the iie func
    function checkSessionStatus() { //if the session of the user is expired then remove the sesison info and create new ones
        var session = initialiseSession();
        if(isSessionExpired(session.expirationTimestamp)) {
            //remove the expired sesison information
            localStorage.removeItem("session_id");
            localStorage.removeItem("session_expiration_timestamp");
            //create new session information
            initialiseSession();
        }
    }
    checkSessionStatus(); //function should be executed when the website is on 

    //send tracking data to the server via a post request
    function sendRequest(payload , options) {
        var request = new XMLHttpRequest()
        request.open("POST" , endpoint , true);
        request.setRequestHeader("content-type" , "application/json");
        request.onreadystatechange = function () {
            if(request.readyState == 4) { //once req reach the server that is done (4) then call the call back function for any subsequent req going to the server , this reqs are handled by the callback fucntion
                options && options.callback && options.callback()
            }
        }
    }

    //send tracking data to the server
    function trigger(eventName , options) {
        var payload = {
            event : eventName,
            url : location.href,
            domain : dataDomain
        }
        sendRequest(payload,options);
    }
})