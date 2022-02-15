<!doctype html>
<html lang="it">
    <head>
     <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>   
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">  
        <link rel ="stylesheet" href="./font-awesome-4.7.0/css/font-awesome.min.css">
        
        <link rel ="stylesheet" href="./home.css">
        <meta charset="utf-8"/>
        <title>Homie|</title>
    </head>
    <body>
        <div class="container">     
            <nav class="navbar navbar-light ">
        
     
                <?php
                 session_start();
                    $first_name = $_SESSION['first_name'];
                    if($first_name==''){
                        echo "<script> alert('Attenzione! Non sei loggato'); window.location='https://homie.mgr.xyz/';</script>";
                    }
                ?>
                <h1>Ciao <?= $first_name ?> !</h1>
               

                <div id=Autenticato>
                    <script>
                        var GoogleAuth;
                        var SCOPE = 'https://www.googleapis.com/auth/calendar';
                        
                            
                        function revokeAccess() { GoogleAuth.disconnect();}
                        
                        function setSigninStatus() {
                            var user = GoogleAuth.currentUser.get();
                            var stringa = JSON.stringify(user);
                            console.log(user);
                                
                            var isAuthorized = user.hasGrantedScopes(SCOPE);
                                if (isAuthorized) {
                        
                                    $('#sign-in-or-out-button').html('Sign out');
                                    $('#revoke-access-button').css('display', 'inline-block');
                                    $('#auth-status').html('You are currently signed in and have granted ' +
                                        'access to this app.');
                                    //         fetch()
                                    //.then(data => data.text())
                                    //.then(html => document.getElementById('Autenticato').innerHTML = html);
                                } else {
                                    $('#sign-in-or-out-button').html('Sign In/Authorize');
                                    $('#revoke-access-button').css('display', 'none');
                                    $('#auth-status').html('You have not authorized this app or you are ' +'signed out.');
                                }
                            }
                        
                        function updateSigninStatus() { setSigninStatus();}
                        function initClient() {
                            // retrieve one or more discovery documents.
                            var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
                        
                            // Initialize the gapi.client object, which app uses to make API requests.
                            // Get API key and client ID from API Console.
                            // 'scope' field specifies space-delimited list of access scopes.
                            gapi.client.init({
                                'apiKey': 'AIzaSyA-4ObZvMWAyLjsGPfuqrYtvNgr-2ZoGLA',
                                    'clientId': '275076483840-ah6ioehoa9i509fplc3v0h0qrrk2ncnb.apps.googleusercontent.com',
                                'discoveryDocs': [discoveryUrl],
                                    'scope': SCOPE
                            }).then(function () {
                                GoogleAuth = gapi.auth2.getAuthInstance();

                                GoogleAuth.isSignedIn.listen(updateSigninStatus);// Listen for sign-in state changes.
                                var user = GoogleAuth.currentUser.get();// Handle initial sign-in state. (Determine if user is already signed in.)
                                    
                                setSigninStatus();
                        
                                // Call handleAuthClick function when user clicks on
                                //      "Sign In/Authorize" button.
                                $('#sign-in-or-out-button').click(function() {handleAuthClick(); });
                                $('#revoke-access-button').click(function() { revokeAccess();});
                                });
                        }
                        // Load the API's client and auth2 modules.
                                // Call the initClient function after the modules load.
                        function handleClientLoad() {gapi.load('client:auth2', initClient);}
                        
                        function handleAuthClick() {
                            if (GoogleAuth.isSignedIn.get()) {
                                GoogleAuth.signOut();// User is authorized and has clicked "Sign out" button.
                            }  else {
                                GoogleAuth.signIn();// User is not signed in. Start Google auth flow.
                                    }
                        }

                        function move(){window.location="ffindex.php";}
                        
                    </script>
                    
                    <button id="sign-in-or-out-button"style="margin-left: 25px" onclick="move()" ></button>
                    <button id="revoke-access-button"style="display: none"onclick="move()">Revoke access</button>
                                    
                    <div id="auth-status" style="display: inline; padding-left: 25px"></div>
                                    
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
                                    
                    <script async defer src="https://apis.google.com/js/api.js" onload="this.onload=function(){};
                                    
                        handleClientLoad()"onreadystatechange="if (this.readyState == 'complete') this.onload()">
                                    
                    </script>
                </div>
                <button value = "pianifica" onclick="move_p()">Pianifica</button>   
                <button value="logout"><a href="logout.php">log out</a></button>
            </nav>  
        
         
        <div class="weather">
            <h5> Attualmente la temperatura esterna rilevata a Massafra da weathermap è:</h5>
            <h2 id="temperatura"></h2>
        </div>
        <!-- chiamate API esterne -->
        
        <script type="text/javascript">

            const url_1 = 'https://api.openweathermap.org/data/2.5/weather?id=6537564&appid=e6590883f962a7dc310bd3ffd324ce35&lang=it&units=metric'
            //   r = requests.get(url)
            //   weather = json.loads(r.content.decode())       
            //   ext_temp=weather['main']['temp']
            //   ext_humidity=weather['main']['humidity']
            //   return ext_temp,ext_humidity  
            fetch(url_1).then((response) => {
                if (response.ok) {
                return response.json();
                }
            }).then((data) => {
                var temp=data["main"]["temp"];
                    document.getElementById("temperatura").innerHTML = temp;
            //        document.body.innerHTML = temp;
            }).catch(error => console.log("Si e verificato un errore!"))
                
            function move_p(){
                window.location="scheduling.html";
            }

        </script>

      

            
            





        <div class="graph">
            <div class ="row">

                <h3>Visualizza misurazioni su un intervallo di date </h3>
                <div class="col-3">
                    <label >data iniziale</label> <input id='start' type='datetime-local' placeholder="yyyy-mm-ddT--:--"/>
                </div>
                <div class ="col-3">
                    <label >data finale</lable><input id='end' type='datetime-local' placeholder="yyyy-mm-ddT--:--" />
                </div>
                
                <div class ="col-3"><label >tipo misurazione</label>
                    <select id="misurazione-1" value =''>
                            <option value=""></option> 
                            <option value="illuminazione">illuminazione</option>
                            <option value="temperatura_esterna">temperatura esterna</option>
                            <option value="temperatura_interna">temperatura interna</option>
                            <option value="umidità_esterna">umidità esterna</option>
                            <option value="umidità_interna">umidità interna</option>
                    </select>
                </div> 
                
                <div class="col-3">
                    <button type="button" id ="submit-1"><i class="fa fa-arrow-right"></i></button>
                </div>
                <canvas id="myChart" style="width:0%; max-width:60%"></canvas>
                    
                <script>

                    $('#submit-1').click(function(){
                        var date1 =$("#start").val() +':00';
                        var date2=$("#end").val()+':00';
                        var name= $("#misurazione-1").val();
                        console.log(date1,date2,name);
                        $.ajax({
                            url: 'https://homie-mgr.xyz:8080/search',
                            method: 'POST',
                            data: {
                                "date1":date1, 
                                "date2":date2, 
                                "name":name
                            },
                            success: function(data) { console.log(data);
                                var misurazioni = data.result;                                
                                var xValues=[];
                                var data1=[];
                                var data2=[];
                                var data3=[];
                                var data4=[];
                                var data5=[];
                                var i=0;
                                for(i=0;i<misurazioni.length;i++){
                                        
                                    xValues.push(misurazioni[i].dt);
                                    if(misurazioni[i].sensor_name=="prj_RDC/sensor/temp")
                                        {data1.push(misurazioni[i].sensor_value);}
                                    
                                    else if (misurazioni[i].sensor_name=="prj_RDC/sensor/humidity")
                                        {data2.push(misurazioni[i].sensor_value);}
                                    
                                    else if (misurazioni[i].sensor_name=="prj_RDC/sensor/ext_temp")
                                        {data3.push(misurazioni[i].sensor_value);}
                                    
                                    else if (misurazioni[i].sensor_name=="prj_RDC/sensor/ext_humidity")
                                        {data4.push(misurazioni[i].sensor_value);}
                                        
                                    else {data5.push(misurazioni[i].sensor_value);}
                                
                                }console.log(xValues);

                                new Chart("myChart", {
                                    type: "line",
                                    data: {
                                        labels: xValues,
                                        datasets: [{ 
                                        data:data1,
                                        borderColor: "red",
                                        fill: false
                                        }, { 
                                        data: data2,
                                        borderColor: "green",
                                        fill: false
                                        },{ 
                                        data: data3,
                                        borderColor: "purple",
                                        fill: false
                                        }, { 
                                        data: data4,
                                        borderColor: "orange",
                                        fill: false
                                        }, { 
                                        data: data5,
                                        borderColor: "cyan",
                                        fill: false
                                        }]
                                    },
                                    options: {
                                        legend: {display: false}
                                    }
                                });
                            }
                        });
                    });
                </script> 
            </div>
        </div>


        <div class ="row">
            <div class="col-6">
                <div clas="list-wrap">
                    <h3>Visualizza tutte le misurazioni qui </h3>

                    <button type="button" id ="get"><i class="fa fa-arrow-down"></i></button>
                    <div class="elenco" id="list">
                        <div class="swiper-1"></div>
                    </div>
                </div>
            </div>
               
            <script>
                var lenght;
                var misurazioni;
                var json;

                $('#get').click(function(){

                    $.ajax({
                        url: 'https://homie-mgr.xyz:8080/all',
                        method: 'GET',
                        success: function(data) { json=data;console.log(data);}
                    })
                    console.log(json);
                    misurazioni = json.risultato;
                    length = misurazioni.length;
                    var i =0;
                    var items=  [];
                    var name;
                    var date;
                    var value;
                    while(i<misurazioni.length){
                        if(misurazioni[i].sensor_name=='prj_RDC/sensor/temp') {name = 'temperatura interna';}
                        else if(misurazioni[i].sensor_name=='prj_RDC/sensor/ext_temp'){name = 'temperatura esterna';}
                        else if(misurazioni[i].sensor_name=='prj_RDC/sensor/ext_humidity'){name = 'umidità interna';}
                        else if(misurazioni[i].sensor_name=='prj_RDC/sensor/humidity'){name = 'umidità esterna';}
                                
                        else {name = "luminosità";}
                        date =misurazioni[i].dt.split('.')[0];
                        value = misurazioni[i].sensor_value;
                        item = '<h5>'+date+' '+ name +' '+ misurazioni[i].sensor_value +' '+'</h5>'+'<button id="delete"  value="'+date+'&'+misurazioni[i].sensor_name+'&'+value+'" ><i class="fa fa-trash"></i></button>';
                        items.push(item);
                        i++;
                    }

                    $('.swiper-1').append(items.join('\n'));
                });

            </script>

            <script>

                $(document).on('click',"#delete",function() {
                    var val = ($(this).val()).split("&");
                                
                    var date_time = val[0];
                    var name = val[1];
                    var value= val[2];
                    console.log(date_time,name,value);
                    var path='https://homie-mgr.xyz:8080/delete';

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", path);

                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

                    xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        console.log(xhr.status);
                        console.log(xhr.responseText);
                        }
                     };

                    var data = "date="+date_time+"&name="+name+"&value="+value;

                    xhr.send(data);
                });

            </script>
             
                    
            <div class="col-6">
                <div class="update-wrap">
                    <h3>Inserisci misurazioni manulmente o modificale </h3>
                    <div class="row">
                        <label >misurazione</label>
                        <select id="misurazione2" value =''>
                            <option value=""></option> 
                            <option value="illuminazione">illuminazione</option>
                            <option value="temperatura esterna">temperatura esterna</option>
                            <option value="temperatura interna">temperatura interna</option>
                            <option value="umidità esterna">umidità esterna</option>
                            <option value="umidità interna">umidità interna</option>
                    </select>
                    </div>
                    
                    <div class="row">
                        <label >valore </lable><input id='value' name ="value" type='text' placeholder="##.#°" required name ="value"/>
                    </div>
                    
                    <div class="row"><h5>se modifica:</h5>
                        <label >data e ora </label> <input id='date' type='text' placeholder="yyyy-mm-ddT--:--"/>
                        <button type="button" id ="submit-2"><i class="fa fa-arrow-right"></i></button>
                    </div>
                    
                    <div class="elenco" id="list">
                        <div class="swiper-3"></div>
                    </div>
           
                
                    <script>

                        $('#submit-2').click(function(){
                            var name= $("#misurazione2").val();
                            
                            var item;
                            if(name=="temperatura esterna") { name ="prj_RDC/sensor/ext_temp";}
                            else if(name=="temperatura interna") { name ="prj_RDC/sensor/temp";}
                            else if(name =="umidità esterna") { name == "prj_RDC/sensor/ext_humidity";}
                            else if(name =="umidità interna"){ name == "prj_RDC/sensor/humidity";}
                            else  if(name =="illuminazione"){ name == "prj_RDC/sensor/lux";}
                            else{alert("Prego, selezionare tipo misurazione");}
                            var value=$("#value").val();
                            var date_time =$("#date").val();
                            console.log(name);
                         
                            
                                $.ajax({
                                url: 'https://homie-mgr.xyz:8080/sensor_data/put',
                                method: 'POST',
                                data: {
                                        "name":name, 
                                        "value":value,
                                        "date_time":date_time
                                    },
                                success: function(data)  {console.log(data); }
                                })
                                
                                item="<p>Misurazione registrata con successo!</p>";
                                $('.swiper-3').append(item);
                            
                                 
                        });
                    </script>
                </div>
            </div>
        </div>
    </body>
</html>

