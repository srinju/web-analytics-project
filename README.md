web analytics tool for your web appplications. Monitor your website , user behaviour, user interaction , traffic and many more .

# STEPS IMPLEMENTED >

1. authentication
2. dashboard page 
3. header or app bar
4. website schema added and addwebsite functionality done
5. create api route to add website and then pass the fetch request to the api route to add the website(done)
6. create a getwebsites api endpoint and do error handling in the /add page such that 
the user dont add in already added websites and the https should not be there too.(done)
7. create a step2 of the add website page where after entering the domain , user can
   paste the script to their codebase , through which they can monitor their websites
8. write the tracking script in the public folder of the repo
9. Add a api endpoint where all the tracking data and goes and gets stored in the database
10. update the dashboard page and fetch the websites registered by the user from the database to the dashboard
11. Make the pageview<1 page as waiting for the first page view
12. make the w/dynamic website page where all the traffic/monitoring data of the website is rendered for that particular registered website, it is shown whenever the pageView
     is greater than 0 , if not it will show a page  as waiting for the first page view
     (client to server component handling in the dynamic website page)
13. Make the monitoring data in the page after the first page view.
14. create a api route for the get pageview and get visits
15. fetch the visits and page view
16.  Make a settings page , when the user clicks on the generate api key , it
     generates an api ket and block of code to add to their codebase so that
     they can send request to our custom events api endpoint.
17. Create a route for generating a new api key .
18. make the grouped page views functionality .
19. Make the top visit sources functionality
20. Make the top Visit sources ui
21. Make the custom event functionality->
     1.define events schema in prisma
     2. Make a api endpoint where the user with their own api key will be able
        to send request to our api endpoint which will store all the custom
        events in the database.
22. Make the custom events tab (ui)
23. Make the settings page for the custom events guide with the api key of the
     user present in the setitngs . blocks of code for sending the request to
     our cusotom events api endpoint with the api key , and with a guide.
24. Hyrdation issue in dashboard page
25. Received `true` for a non-boolean attribute `cursor-text`. in settings page
26. Deploy
27. Chnage the loacl hosts urls to deployed url after deploying

  
     
     

     
   
     
