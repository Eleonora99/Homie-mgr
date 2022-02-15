var https = require('https');
//const fs = require('fs');
var request = require('request');
var mysql = require('mysql');
//var express = require('express');
//const cors = require('cors');
//var app = express();




var db = mysql.createConnection({
  host: "192.168.1.105",
  database: "homiedb",
  user: "homie-usr",
  password: "H0mie-Passw0rd"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("DB Connected");
});


function inoltra_errore(res, error_desc, error_code = 1) {
    const json = {
        error_code: error_code,
        error_desc: error_desc
    };
    res.send(json);
}

////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////ENGINE/////////////////////////////////////////////////


// Actuators switch works with an ajax post call, it litterally changes actuator status

function attuatoreSwitch(azione,device_id){
    console.log("attivato switch:"+azione+ " "+device_id);
    var b ={device_id:device_id, azione: azione};
    var body = JSON.stringify(b);
    console.log(body);
    request.post({
        headers: {'content-type' : 'application/json'},
        url:     'https://homie-mgr.xyz:4786/change_status',
        body:    body
      }, function(error, response, body){
        console.log(error);
      });

 }

    // The check() fuction is thesholds automatic engine,
    // Every minute, thanks to setInterval (), it checks for each sensor its theshold value
    //and by if-then statement switchs actuators on or off .
    // In order to work, the function makes Api server calls which provides json
    // txts about DB required values

function check(){//chiama il db e considera tutti gli attuatori e le loro soglie, per ogni attuatore fa una richiesta all'api server dei sensori per confrontarne i valori e agire o meno sugli attuatori
    console.log("sono in check()");
    const q_1 = "SELECT * FROM thesholds";

    db.query(q_1, function (err, result) {
    let thesholds;
    if (err) {
        json = {
            'error_code': 1,
            'error_desc': err.message
        }
    } else {
        thesholds = result;
        console.log(thesholds);
        var type;
        var id;
        var status;
        var i;
        //for(i=0; i< thesholds.length; i++){
            var  theshold = thesholds[0];
                if(theshold.name =="illuminazione"){type="lux"; id='100123245a'; }           // in base al tipo di sensore
                else                               {type="temp"; id='100123245a';} // assegno l'id attuatuore
                console.log(id);                                                           // debug

                https.get('https://homie-mgr.xyz:4786/status/'+id, (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => {
                        data += chunk;
                      });

                    resp.on('end', () => {
                        status=JSON.parse(JSON.stringify(data));
                        console.log(status);                                          //debug
                        var warn;                                                     //inizializzo l'array warn che conterrà le misurazioni più recenti misurati dall' i-esimo sensore

                        const q_2 = "SELECT * FROM sensor_data where sensor_name='prj_RDC/sensor/"+type+"'order by dt DESC";

                        db.query(q_2, function (err, result) {
                            console.log("sono nell q_2");
                            if (err) {
                                json = {
                                    'error_code': 1,
                                    'error_desc': err.message
                                }
                            } else {

                                warn = result;
                                var primo = parseInt(warn[0].sensor_value);                // recupero i primi due valori perchè i piu recenti e perchè  visto il tempo
                                var secondo = parseInt(warn[1].sensor_value);             // di aggiornamento del db di 5 min rappresentano la situazione negli ultimi 10 min
                                console.log(primo,theshold.value, secondo,theshold.value);
                                if      (primo<=theshold.value&&secondo<=theshold.value&&status=="off") { console.log("sono qui"); attuatoreSwitch('on',id);}
                                else if (primo>theshold.value&&secondo>theshold.value&&status=="on")  {console.log("sono li"); attuatoreSwitch('off',id);}
                            }
                        });
                    });
                }).on("error", (err) => {
                console.log("Error: " + err.message)});

           // }
        }
    });
}

var start_delay;
var stop_delay;
var attivo=0;
const q_1 = "SELECT * FROM events WHERE dt_start > DATE_SUB( NOW(), INTERVAL 1 MINUTE ) order by dt_start ASC LIMIT 1";
var events;
var name='';
var id=null;
function listEvents(){
    db.query(q_1, function (err, result) {
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            events= JSON.parse(JSON.stringify(result));
            //var today_date = today.getFullYear()+'-'+'0'+(today.getMonth()+1)+'-'+today.getDate(); // salvo la data per il check
            event=events[0];
            if (event) {
                var today = new Date(); // per ogni chiamata perndo il tempo istantaneo
                var hours=today.getHours();
                var minutes=today.getMinutes();
                var now_snd = (hours * 3600) +(minutes* 60+3600);
                var name=event.name;
                var end=event.dt_end.split('T');
                var start = event.dt_start.split('T');
                var start_time = start[1].slice(0,5).split(":");   // considero separatamente ora e minuti dell'inizio evento per la riga successiva
                var start_snd= ((parseInt(start_time[0]) * 3600) + (parseInt(start_time[1]) * 60) );   // calcolo l'ora dell'evento il millisecondi
                var end_time = end[1].slice(0,5).split(":");   // considero separatamente ora e minuti dell'inizio evento per la riga successiva
                var end_snd= ((parseInt(end_time[0]) * 3600) + (parseInt(end_time[1]) * 60));   // calcolo l'ora dell'evento il millisecondi
                console.log(name,start_snd,end_snd,start_time);
                console.log("now",now_snd,hours,minutes);
                    if(name=='temp') { id='100123245a';}
                    else if (name=='lux'){id='IFTTT';}
                    else {id= null;}
                    if (id != null && start_snd<=now_snd && end_snd> now_snd && attivo==0)
                        {
                            attuatoreSwitch('on',id);
                            attivo=1;
                        }
                }
//            else if (id != null && start_snd<now_snd && end_snd<= now_snd && attivo==1) {
            else if (attivo==1) {
                attuatoreSwitch('off',id);
                attivo=0;
            }
        }
    });
}

setInterval(listEvents,5000); // chiama ogni minuto check per aggiornarla
