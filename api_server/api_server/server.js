/**
 * @apiDefine DataNotFoundError
 *
 * @apiError Sensor_Data requested was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Sensor Data not found"
 *     }
 */
 
/**
 * @apiDefine EventNotFoundError
 *
 * @apiError Events requested was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Event not found"
 *     }
 */

/**
 * @apiDefine ThesholdNotFoundError
 *
 * @apiError Thesholds requested was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Theshold not found"
 *     }
 */


var https = require('https');
const fs = require('fs');
var request = require('request');
var mysql = require('mysql');
var express = require('express');
const cors = require('cors');
var app = express();
const options = {
    key: fs.readFileSync('homie-mgr_xyz.key'),
    cert: fs.readFileSync('homie-mgr_xyz.crt'),
    ca: fs.readFileSync('intermediate.pem')
  };
var corsOptions = {
    origin: 'https://homie-mgr.xyz:8080',
    credentials: true };

app.use(cors({ corsOptions, optionsSuccessStatus: 200 }));
app.use(express.json()); // Per parsare il json in entrata sulle POST
app.use(express.urlencoded({ // Da vedere
    extended: true
}));
const port=8080;


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


const SERVER_PATH = 'https://homie-mgr.xyz:8080';

var server = https.createServer(options, app).listen(port, "0.0.0.0", function(){
    console.log("Express server listening on port " + port);
  });


function inoltra_errore(res, error_desc, error_code = 1) {
    const json = {
        error_code: error_code,
        error_desc: error_desc
    };
    res.send(json);
}

/**
 * @api {get} / Root (debug purpose)
 * @apiName Root
 * @apiGroup Sensor_Data
 *
 *
 * @apiSuccess {String} Homie root string
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    "I am (g)Root"
 *
 *
 * @apiUse DataNotFoundError
 */

app.get('/', function (req, res) {
    console.log("Application server has been activated -root on-\n");
    res.send('I am (g)Root\n');
});



var int_temp;
var int_air_quality;
var int_humidity;

// REST + CRUD 

// GET semplici misurazioni standard 
// debug APIs sensori interni

/**
 * @api {get} /all Request All records in Sensor Data table
 * @apiName All
 * @apiGroup Sensor_Data
 *
 *
 * @apiSuccess {Object[]} Sensor_Data List of data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt":"datetime","sensor_value":"value", "sensor_name":"name"}]}
 *
 *
 * @apiUse DataNotFoundError
 */


app.get('/all', function (req, res) {
    console.log("sensor data standard get");
    
    const query = "SELECT * FROM sensor_data";
    db.query(query, function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "risultato": result
            };
        }
        console.log(result);
        res.send(json);
    });
});


/**
 * @api {get} /temperatura Request All records stored of temperature (debug purpose)
 * @apiName Temperatura
 * @apiGroup Sensor_Data
 *
 *
 * @apiSuccess {Object[]} Sensor_Data List of data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt":"datetime","sensor_value":"value"}}}
 *
 *
 * @apiUse DataNotFoundError
 */

app.get('/temperatura', function (req, res) {
    console.log("sensor data standard get");
    const query = "SELECT dt, sensor_value FROM sensor_data where sensor_name='prj_RDC/sensor/temp' order by dt DESC";
    db.query(query, function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "risultato": result
            };
        }
        console.log(result);
        res.send(json);
    });
});

/**
 * @api {get} /umidita Request All records stored of humidity (debug purpose)
 * @apiName Umidit??
 * @apiGroup Sensor_Data
 *
 *
 * @apiSuccess {Object[]} Sensor_Data List of data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt":"datetime","sensor_value":"value"}}}
 *
 *
 * @apiUse DataNotFoundError
 */

app.get('/umidita', function (req, res) {
    console.log("sensor data standard get");
    const query = "SELECT dt, sensor_value FROM sensor_data where sensor_name='prj_RDC/sensor/humidity' order by dt DESC";
    db.query(query, function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "risultato": result
            };
        }
        console.log(result);
        res.send(json);
    });
});


/**
 * @api {post} /search/ extract sensor data by a date interval and optional sensor name
 * @apiName Search
 * @apiGroup Sensor_Data
 *
 * @apiParam {date} datetime_1  
 * @apiParam {date} datetime_2
 * @apiParam {String} sensor name 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt":"datetime","sensor_value":"value"}}}
 *
 * @apiUse DataNotFoundError
 */


// SEARCH DATE (Post) per qualsiasi parametro
// api search si preoccupa si restituire tutte le misurazioni rilevante in un intervallo di date
// ?? possibile recuperare qualsiasi misurazioni o misurazioni specifiche in base al sensore selezionato

app.post('/search', function(req, res, next) { 
           
    let body = req.body;
    console.log(body);

    if (body.date1&&body.date1 != "") {
        var date1 = body.date1;
    } else {
        inoltra_errore(res, 'Il campo "data iniziale" non pu?? essere vuoto');
        return;
    }


    if (body.date2&& body.date2 != "") {
        var date2 = body.date2;
    } else {
        inoltra_errore(res, 'Il campo "data_finale" non pu?? essere vuoto');
        return;
    }

    if (body.name&& body.name != "") {
        if(body.name == 'temperatura_interna') { var name = 'prj_RDC/sensor/temp'; }
        else if(body.name == 'temperatura_esterna') { var name = 'prj_RDC/sensor/ext_temp'; }

        else if (body.name == 'umidit??_interna') { var name = 'prj_RDC/sensor/humidity';}  
        else if(body.name == 'umidit??_esterna') { var name = 'prj_RDC/sensor/ext_humidity'; }
        
        else if (body.name == 'illuminazione') { var name = 'prj_RDC/sensor/lux';}  
       
        else { inoltra_errore(res, 'il sensore selezionato ?? inesistente');}
        console.log("search con nome");
        const query ='SELECT * FROM sensor_data WHERE dt>="'+date1+'" AND dt<="'+date2+'" AND sensor_name="'+  name+'"';
        db.query(query,function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "result": result
                
            };
        }
            res.send(json);
         });
    } 
    
    if(body.name == ""){
        console.log("search senza nome");
        console.log(date1,date2);
        const query ='SELECT * FROM sensor_data WHERE dt>="'+date1+'" AND dt<="'+date2+'"';
        db.query(query,function (err, result) {
            let json;
            if (err) {
                json = {
                    'error_code': 1,
                    'error_desc': err.message
                }
            } else {
                json = {
                    "error_code": 0,
                    "error_desc": 'ok',
                    "result": result
                    
                };
            }
            
            res.send(json);
        });
    }
});


/**
 * @api {post} /delete delete sensor data by a date 
 * @apiName Delete
 * @apiGroup Sensor_Data
 *
 * @apiParam {date} datetime
 * @apiParam {String} name
 * @apiParam {String} value
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt":"datetime","sensor_value":"value"}}}
 *
 * @apiUse DataNotFoundError
 */

// DELETE elimina  una misurazioni di un determinato momento
// qualisai misurazione avvenuta in un preciso date-time viene eliminata


app.post('/delete', function(req,res){ 
    console.log("sensor data standard delete");
    
    const query = 'DELETE FROM sensor_data WHERE dt="'+req.body.date+'" AND sensor_name="'+req.body.name+'" AND sensor_value="'+req.body.value+'"';
    console.log(query)
      db.query(query,  function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "result": result
            };
        }
        res.send(json);
      });
    });





/**
 * @api {post} /sensor_data/put  Insert or update a sensor data value (If insert it is requiret only sensor type and value)
 * @apiName Insert_Update
 * @apiGroup Sensor_Data
 *
 * @apiParam {date} datetime_1 
 * @apiParam {date} datetime_2
 * @apiParam {String} sensor name 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt":"datetime","sensor_name":"name","sensor_value":"value"}]}
 *
 * @apiUse DataNotFoundError
 */



// INSERT / UPDATE: aggiunta e modifica misurazioni manualmente
// l'api si occupa di aggiungere o modificare i valori di una misurazione
// se la misurazione ?? da modificare ?? necessario tra i dati della post anche 
//lo specifico date_time che la individua.
// Nella insert il date_time non ?? necessario perch?? inserito autmoaticamente da MySQL
app.post('/sensor_data/put', (req, res, next) => {
    console.log("sensor data standard put or edit");
    let body = req.body;
    console.log(body);

    if (body.name&&body.name != "") {
        var sensor_name = body.name;
    } else {
        inoltra_errore(res, 'Il campo name non pu?? essere vuoto');
        return;
    }


    if (body.value&& body.value != "") {
        var sensor_value = body.value;
    } else {
        inoltra_errore(res, 'Il campo value non pu?? essere vuoto');
        return;
    }

    if (body.date_time && body.date_time!= "") { // datetime format = yyyy-mm-dd/hh:mm:ss (not adding .000Z)
        var date_time = body.date_time;
        console.log('update');
        var query = 'UPDATE sensor_data SET  sensor_name="'+sensor_name+'", sensor_value="'+sensor_value+'" WHERE dt="'+ date_time+'"' ;

    } else {
       console.log('insert');
        var query = 'INSERT INTO sensor_data ( sensor_name, sensor_value ) VALUES ("'+sensor_name+'", '+sensor_value+')';
    }

    console.log(query);
     db.query(query,  function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "result": result
            };
        }
        res.send(json);
      });
});

/**
 * @api {get} /events/all  Estracts all records from Events table
 * @apiName Events_all
 * @apiGroup Events
 *
 *
 * @apiSuccess {Object[]} Events List of data
 *
 *  
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt_start":"datetime","dt_end":"datetime","name":"name"}]}
 *
 *
 * @apiUse EventNotFoundError
 */

//  Get standard per tutti gli 'eventi' programmati,
// ritona il nome la data di inzio e la fine dell'evento
app.get('/events/all', (req, res) => {
    //console.log("events standard get");
    const query = "SELECT * FROM events";
    db.query(query, function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "result": result
            };
        }
      //  console.log(result);
        res.send(json);
    });
});


/**
 * @api {post} /events/delete  Delete records from Events table
 * @apiName Events_delete
 * @apiGroup Events
 *
 * @apiParam {date} start_time  
 * 
 * @apiParam {String} event name 
 *  
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt_start":"datetime","dt_end":"datetime","name":"name"}]}
 *
 *
 * @apiUse EventNotFoundError
 */


app.post('/events/delete', (req, res) => {
    //console.log("events standard get");
    const query = 'DELETE FROM events WHERE dt_start="'+req.body.dt+'" AND name="'+req.body.name+'"';
    db.query(query, function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "result": result
            };
        }
      //  console.log(result); name="'+req.body.name+'" AND
        res.send(json);
    });
});

/**
 * @api {post} /events/put  Inserts new records into Events table
 * @apiName Events_insert
 * @apiGroup Events
 *
 *
 * @apiParam {date} start_time  
 * @apiParam {date} end_time
 * @apiParam {String} event name 
 *  
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"dt_start":"datetime","dt_end":"datetime","name":"name"}]}
 *
 *
 * @apiUse EventNotFoundError
 */

// Insert che si occupa dell'inserimento di nuovi eventi nel database
// assicurandosi di non creare copie
app.post('/events/put', (req, res, next) => {
    //console.log("events standard put ");
    let body = req.body;
    //console.log(body);

    if (body.name&&body.name != "") {
        var name = body.name;
    } else {
        inoltra_errore(res, 'Il campo name non pu?? essere vuoto');
        return;
    }


    if (body.start && body.start!= "") { // datetime format = yyyy-mm-dd/hh:mm:ss (not adding .000Z)
        var start = body.start;
    }else {
        inoltra_errore(res, 'Il campo name non pu?? essere vuoto');
        return;
    }
    
    if (body.end && body.end!= "") { // datetime format = yyyy-mm-dd/hh:mm:ss (not adding .000Z)
        var end = body.end;
    }else {
        inoltra_errore(res, 'Il campo name non pu?? essere vuoto');
        return;
    }
    var query = 'SELECT * FROM events WHERE name="'+name+'" AND dt_start="'+ start+'" AND dt_end="'+ end+'"';
    //console.log(query);
     db.query(query,  function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
            
        } else {
          //  console.log(result);
           // console.log(result.length);
            if(result.length==0){
                console.log('inserisco nuovo evento');
                query = 'INSERT INTO events (name ,dt_start, dt_end) VALUES ("'+name+'","'+ start+'","'+end+'")';
                db.query(query,  function (err, result) {
                
                if (err) {
                    json = {
                        'error_code': 1,
                        'error_desc': err.message
                    }
                } else {
                    json = {
                        "error_code": 0,
                        "error_desc": 'ok',
                        "result": result
                    };
                }
                res.send(json);
              });
            }
            else { json = "evento gi?? inserito"; res.send(json);}
        }
    });
});

/**
 * @api {get} /thesholds/all  Get all records from Thesholds table
 * @apiName Thesholds_all
 * @apiGroup Thesholds
 *
 * 
 * @apiSuccess {Object[]} Thesholds List of data
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"name":"name", "value":"value"}]}
 *
 * @apiUse ThesholdNotFoundError
 */
// Get che restituisce l'insieme delle soglie impostate

app.get('/thesholds/all', (req, res) => {
    console.log("thesholds standard get");
    const query = "SELECT * FROM thesholds";
    db.query(query, function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "result": result
            };
        }
        console.log(result);
        res.send(json);
    });
});


/**
 * @api {get} /thesholds/put  Insert or Update records into Thesholds table
 * @apiName Thesholds_insert
 * @apiGroup Thesholds
 *
 * 
 * @apiParam {String} sensor name 
 * @apiParam {String} value
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {"error_code":0,"error_desc":"ok",
 *     "risultato":[{"name":"name", "value":"value"}]}
 *
 * @apiUse ThesholdNotFoundError
 */

// Insert ( o update) di soglie e valori nella Tabella delle soglie 

app.post('/thesholds/put', (req, res) => {
    console.log("thesholds  put or edit");
    let body = req.body;
    //console.log(body);

    if (body.name&&body.name != "") {
        var name = body.name;
    } else {
        inoltra_errore(res, 'Il campo name non pu?? essere vuoto');
        return;
    }

    if (body.value&& body.value != "") {
        var value = body.value;
    } else {
        inoltra_errore(res, 'Il campo value non pu?? essere vuoto');
        return;
    }
    var query = 'SELECT * FROM thesholds WHERE name="'+name+'"';
    db.query(query,  function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            console.log(result);
            console.log(result.length);
            if(result.length>0){
                console.log('aggiorno  nuovo limite per sensore gi?? presente');
                query = 'UPDATE thesholds SET value="'+value+'" WHERE name ="'+ name+'"';
                db.query(query,  function (err, result) {
                    
                    if (err) {
                        json = {
                            'error_code': 1,
                            'error_desc': err.message
                        }
                    } else {
                        json = {
                            "error_code": 0,
                            "error_desc": 'ok',
                            "result": result
                        };
                    }
                    res.send(json);
                  });
            }

            else {
                console.log('inserisco nuovo limite per nuovo sensore');
                query = 'INSERT INTO thesholds (name ,value) VALUES ("'+name+'","'+ value+'")';
                db.query(query,  function (err, result) {
                
                if (err) {
                    json = {
                        'error_code': 1,
                        'error_desc': err.message
                    }
                } else {
                    json = {
                        "error_code": 0,
                        "error_desc": 'ok',
                        "result": result
                    };
                }
                res.send(json);
              });
            }


        }
    });
});


////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////ENGINE/////////////////////////////////////////////////


// Actuators switch works with an ajax post call, it litterally changes actuator status 

function attuatoreSwitch(azione,device_id){              
    console.log("attivato switch:"+azione+ device_id);
    var b ={device_id:device_id, azione: azione};
    var body = JSON.stringify(b);
    console.log(body);
    request.post({
        headers: {'content-type' : 'application/json'},
        url:     'https://homie-mgr.xyz:4786/change_status',
        body:    body
      }, function(error, response, body){
        console.log(body);
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
                        var warn;                                                     //inizializzo l'array warn che conterr?? le misurazioni pi?? recenti misurati dall' i-esimo sensore 
                        
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
                                var primo = parseInt(warn[0].sensor_value);                // recupero i primi due valori perch?? i piu recenti e perch??  visto il tempo
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
     
    
//setInterval(check,30000);


