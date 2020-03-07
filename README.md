# traffic_notices
## GOAL
create a form for volunteer of VOH-VOV input information about status traffic </br>
in HCM City, and the radio man will populate them to people by radio on 96.5 </br>
or 91 GHz. After collecting data, it can be used for generating reports, statistic and exporting API. We can also build a </br>API for exporting traffic status which community use for traffic projects. </br>
## Members:
1. Dao Quoc Hoang
2. Duong Vong
3. Vo Truong Son
## Instructions:

We divide the system into 2 main components: front-end and back-end. front-end is written in ReactJs, it is responsible </br> for displaying the interface and receiving user interactions, connecting to the server via APIs. back-end is written in </br> Spring-Boot, it is the place for receiving requests and connecting to the database.

## To run the system follow these steps: </br>
  ### Step 1: run the VohReport_server.war file in the / back-end directory with the following command: </br>
        java -jar VohReport_server.war </br>
  ### Step 2: Go to the front-end directory and install the package:</br>
        npm install </br>
  ### Step 3: Run ReactJS: <br>
        npm start </br>
 Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
