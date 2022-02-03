# Homie-mgr
Born as a University Project ( Computer Networks exam) , Homie -mgr is about design and development of a environment automation system based on microservice architectures.

**1. PROJECT PURPOSE**

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

/////////////IMAGE////////////

**REQUIREMENT FULFILLMENT**

- More than 10 API REST are supplied in order to provide a rich and useful presentation layer
- As first commercial API Provider, Google Calendar with his Oauth has been chosed 
- As second commercial API Provider, WeatherMap  has been chosed 
- In order to recive and manage sensor datas it is used HiveMQ (MTTQ Protocol)


**INSTALLATION GUIDE**

**API DOC**



