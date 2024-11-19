

//the user will send custom events request to our api endpoint with their own unique api key
//the request will be like name , domain , description
//we take the name , domain and the description from the body of the payload
//get the api key from the auth header 
//check the api key is present in the database or not 
//if the api key is there then fetch then create/insert entries of events in the database 