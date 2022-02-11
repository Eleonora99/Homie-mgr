Homie-mgr takes his name from his functionalities: it allows its owner to manage every kind of room/environment he prefers throuth sensor and actuator use.
The owner can fecth his sensor datas and manage them, plan actuator activation and set thresholds that have to be kept.
In this repository there is a code example about temperature and lightning managment.

**2.ARCHITECTURES CONCERNS AND EMPLOYED TECHNOLOGIES**

It's possible to implement the environment automation system by different hardwares and software components, for this example has been used:

1. Temperature and Humidity sensor (DHT11)
   

![image](https://user-images.githubusercontent.com/68509977/152329449-623eecdb-87c5-4e98-9591-cf6dfaa152c3.png)


2: Lightning sensor (BH1750)

![image](https://user-images.githubusercontent.com/68509977/152329754-c49b032f-8cb5-41b7-b139-3adddfd3f238.png)


3. Raspberry Pi (in order to communicate with sensors)

4. Nginx Web Server

5. NodeJs Application Server

6. MySql relational database

7. HiveMq - MQTT for Internet of Things

8. Presentation layer has been implemented with:  HTML (+ bootstrap), CSS, Javascript (+JQuery), AJAX

9.SSL ( in order to encrytp Client-Server comunication)

10. Docker

![project](https://user-images.githubusercontent.com/68509977/153639610-43503103-236c-413c-a4bc-73de92fe5cb3.png)

**REQUIREMENT FULFILLMENT**

- More than 8 (+ 3 debug) API REST are supplied in order to provide a rich and useful presentation layer
- 2 (+1 debug) API REST are supplied in order to get datas from actuators
- As first commercial API Provider, Google Calendar with his Oauth has been chosen 
- As second commercial API Provider, WeatherMap  has been chosen 
- In order to recive and manage sensor datas it is used HiveMQ (MTTQ Protocol)


**INSTALLATION GUIDE**
The following paragraphs only provide a guide about how Homie-mgr software side works.

In order to install the project correctly on its own device [Docker](https://docs.docker.com/engine/install/) is required.
To verify that, just write and execute this command on command line

```
docker -v
```
Now, you can download the project by the following command:

```
git clone https://github.com/Eleonora99/Homie-mgr
```
Github Username and password will be asked.
From command line path log in downloaded project folder and execute:

```
docker-compose up -d
```
This will make Docker start with four images: MariaDB, API- Server (NodeJS), PHP(nginx), API_act(Python).
If necessary it will build and start a custom image automatically (es Api_act). 
Now you can easly visit the website www.homie-mgr.xyz and test provided APis.




**API DOC**

Api Documentation is avaible and working on Docker.
You can find  API-server API DOCs in api_server/apidoc,
while you can view Actuators API DOCs in attuatori/apidoc.

In order to update apidoc contents, please execute:

*ex. for api_server*
```
docker exec api_server node_modules/apidoc/bin/apidoc -i ./ -o apidoc 
```







