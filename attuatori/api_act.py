#!/usr/bin/python3

"""
  @apiDefine StatusNotFoundError

  @apiError Status requested was not found.

  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "Status Datas not found"
     }
"""

"""
  @apiDefine RootNotFoundError

  @apiError Root page requested was not found.

  @apiErrorExample Error-Response:
      HTTP/1.1 404 Not Found
      {
        "error": "Root page not found"
     }
"""


import requests
import json
from flask import Flask, jsonify, request
#from flask_sslify import SSLify
#import OpenSSL
#import ssl
#context = SSL.Context(SSL.TLSv1_METHOD)
#context.use_privatekey_file('homie-mgr_xyz.key')
#context.use_certificate_file('homie-mgr_xyz.crt')
#context.use_certificate_chain_file('intemediate.pem')
sonoffR3={"id_attuatore": "100123245a"}
ewelink={"id_attuatore": "IFTTT"}

def sonoffR3_info():
    url_sonoffR3_info = "http://192.168.1.19:8081/zeroconf/info"
    payload_info = {"deviceid": "", "data": { }}
    myResponse = requests.post(url_sonoffR3_info,data=json.dumps(payload_info))
    #print (myResponse.status_code)
    # For successful API call, response code will be 200 (OK)
    if(myResponse.ok):
        # Loading the response data into a dict variable
        # json.loads takes in only binary or string variables so using content to fetch binary content
        # Loads (Load String) takes a Json file and converts into python data structure (dict or list, depending on JSON)
        jData = json.loads(myResponse.content)
        return jData['data']['switch']
    else:
        # If response code is not ok (200), print the resulting http error code with description
        myResponse.raise_for_status()
        return (myResponse.status_code)
def sonoffR3_change(stato):
    url_sonoffR3_change = "http://192.168.1.19:8081/zeroconf/switch"
    payload_change =   {"deviceid": "100123245a","data": {"switch": stato }}
    #payload_info_off =   {"deviceid": "100123245a","data": {"switch": "off"}}
    myResponse = requests.post(url_sonoffR3_change,data=json.dumps(payload_change))
    #print (myResponse.status_code)
    # For successful API call, response code will be 200 (OK)
    if(myResponse.ok):
        # Loading the response data into a dict variable
        # json.loads takes in only binary or string variables so using content to fetch binary content
        # Loads (Load String) takes a Json file and converts into python data structure (dict or list, depending on JSON)
        jData = json.loads(myResponse.content)
        return str(jData['error'])
    else:
        # If response code is not ok (200), print the resulting http error code with description
        myResponse.raise_for_status()
        return (myResponse.status_code)

# Creating a new "app" by using the Flask constructor. Passes __name__ as a parameter.
app = Flask(__name__)

#context = ('homie-mgr_xyz.crt','intermediate.crt','homie-mgr_xyz.key')
context = ('full.crt','homie-mgr_xyz.key')
#sslify = SSLify(app)

"""
@api {get} / Root (debug purpose)
@apiName Root
@apiGroup Root


@apiSuccess {String} Actuators root string

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    "test works"


 @apiUse RootNotFoundError

"""

@app.route("/")
def index():
	return "test works"


"""
@api {get} /status/<string:device_id>
@apiName GET_STATUS
@apiGroup Status

@apiParam  {String} device_id
@apiSuccess {String} Actuator status string

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    "off"


 @apiUse StatusNotFoundError

"""

# Annotation that allows the function to be hit at the specific URL with a parameter. Indicates a GET HTTP method.
@app.route("/status/<string:device_id>", methods=["GET"])
def get_device_status(device_id):
#    for device in devices:
# Checks if the id is the same as the parameter.
    if (sonoffR3["id_attuatore"] == device_id):
        result=sonoffR3_info()
        print (result)
        return result
    elif (ewelink["id_attuatore"] == device_id):
        #result=sonoffR3_info()
        print ('off')
        return 'off'
    else:
        print ('errore id_attuatore non conosciuto')
        return 'errore id_attuatore non conosciuto'

"""
@api {post} /change_status
@apiName EDIT_STATUS
@apiGroup Status


@apiParam  {String} device_status
@apiSuccess {String} Actuator status string

@apiSuccessExample Success-Response:
    HTTP/1.1 200 OK
    "ok"


 @apiUse StatusNotFoundError

"""

@app.route("/change_status", methods=['POST'])
def set_device_status():
        print ("sono stato chiamato")
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            json_data = request.json
            id_device=json_data["device_id"]
            operazione=json_data["azione"]
            print (id_device)
#        return json
        else:
            id_device=request.form.get ("device_id")
            operazione=request.form.get ("azione")
            print (id_device)


# Checks if the id is the same as the parameter.
        if (sonoffR3["id_attuatore"] == id_device):
            if (operazione=='on'):
                result=sonoffR3_change('on')
                return result
            if (operazione=='off'):
                result=sonoffR3_change('off')
                return result
            else:
                return ' gli stati accettati sono <on> opure <off> '
        elif (ewelink["id_attuatore"] == id_device):
            if (operazione=='on'):
                #result=sonoffR3_change('on')
                return 'ko'
            if (operazione=='off'):
                #result=sonoffR3_change('off')
                return 'ko'
            else:
                return ' gli stati accettati sono <on> opure <off> '
             #result=sonoffR3_info()
        else:
             print (request.get_data())
             print (id_device)
             return 'errore id_attuatore non conosciuto'

# Checks to see if the name of the package is the run as the main package.
if __name__ == "__main__":
	# Runs the Flask application only if the main.py file is being run.
    app.run(host='0.0.0.0', port=4786, ssl_context=context)
