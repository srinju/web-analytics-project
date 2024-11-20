

//get the location that is wher the user is doing events in thier website  bascially the website of their
//get the document of the user to monitor any click events or any kind of events


(function () {
    ("use strict")
    var location = window.location; //contains information about the current url
    var document = window.document; //current window document that is the DOM
    var scriptElement = document.currentScript; //grabs the script tag that is currently running
    var dataDomain = scriptElement.getAttribute('data-domain'); //take the attribute in the script called data-domain which contains a domain string used for tracking 

    let queryString = location.search;
    const params = new URLSearchParams(queryString);
    var source = params.get("utm");

    var endpoint = "https://webwise-psi.vercel.app/api/track";

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
            trackSessionStart(); //tracking of the session begin and it sends data to the api endpoint that a new session was started 
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
            trackSessionEnd(); //ending of the new session and after that beginning of the new session below
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
        request.send(JSON.stringify(payload));
    }

    //send tracking data to the server
    function trigger(eventName , options) {
        var payload = {
            event : eventName,
            url : location.href,
            domain : dataDomain,
            source: source
        }
        sendRequest(payload,options);
    }

    //if any requests are queued before any new req then we have to send then send the queue reqs and then send the new reqs
    var queue = (window.your_tracking && window.your_tracking.q) || []; //retreiving the existing queue ,  checks that if there is any queue then it access the queue in the your_tracking.q and if it is not there then it is intialised into an empty array
    window.your_tracking = trigger;
    for(var i = 0 ; i <  queue.length ; i++) { //itearate over each req in the q and send the queeued req by calling the trigger function
        trigger.apply(this,queue[i]);
    }

    //track page view>>
    function trackPageView(){
        trigger("pageview");
    }

    function trackSessionStart() {
        trigger("session_start");
    }

    function trackSessionEnd() {
        trigger("session_end");
    }
    trackPageView(); //execute the function when the script is being run 

    //when user clicks on back anld forth navigation in the browser then it will be a new page visit>>
    window.addEventListener("popstate" , trackPageView);

    //some websites has frequent # changes which can be acess_token and many other things ,  that should also be considerd as a new page view
    window.addEventListener("hashchange" , trackPageView);

    //in react as there is no SSR that is why when suppose a dashboard like applciation , when we are changing pages only that url/home , url/transfer , url/asd and so on then the tracking scripyt will not be mounted.
    //the tracking script will be mounted one and only when the whole page is reloaded
    //sol > 
    //add event listener to each click and if the pathname changes after a click then it will be considered as a page view
    //and if the path name dosent change for a click then it is not considered as a page view
    //this issue occurs in react application because of the userouter feature in react

    var initialPathname = window.location.pathname; //pathname wehn the script gets loaded for the first time 
    document.addEventListener("click" , function(event) {
        setTimeout(() => { //run the check for each 3 seconds , because changing of pathname takes time 
            if(window.location.pathname !== initialPathname) {
                trackPageView(); //new page view if the init pathname is not equal to the new pathname 
                initialPathname = window.location.pathname
            }
        }, 3000);
    })
})()