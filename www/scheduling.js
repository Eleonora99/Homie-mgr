

  // Client ID and API key from the Developer Console
  var CLIENT_ID = '275076483840-ah6ioehoa9i509fplc3v0h0qrrk2ncnb.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyA-4ObZvMWAyLjsGPfuqrYtvNgr-2ZoGLA';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/calendar";

  var authorizeButton = document.getElementById('authorize_button');
  var signoutButton = document.getElementById('signout_button');

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function handleClientLoad() {
      gapi.load('client:auth2', initClient);
      
  }


  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
      gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
      }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
      }, function(error) {
      appendPre(JSON.stringify(error, null, 2));
      });
  }



function getEvents() {
    gapi.client.load('calendar', 'v3', getEvents);
    gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                console.log(event.summary,event.start.dateTime,event.end.dateTime);
                $.ajax({ 
                url: 'https://homie-mgr.xyz:8080/events/put',
                method: 'POST',
                data: {
                    name : event.summary,
                    start: event.start.dateTime.slice(0,19),
                    end :event.end.dateTime.slice(0,19) 
                    },
                success: function(data) { console.log(data); }
                });
            }
           
        }
    });
  }

//setInterval(getEvents,10000);
/*
function addEvent() {
    var start =$("#start").val() +':00.0z';
    var end=$("#end").val()+':00.0z';

    var choice = document.getElementById("attuatori").value;
    console.log(start,end,choice);
    
    var event = {
        summary: choice,

        start: {
            'dateTime': start,
        },
        end: {
            'dateTime': end,
        },
    };

    if(start!=':00.0z'&&end!=':00.0z'){	
        var request = gapi.client.calendar.events.insert({
            'calendarId':		'primary',	// calendar ID
            "resource":			event		// pass event details with api call
        });
                
                // handle the response from our api call
        request.execute(function(resp) {
            if(resp.status=='confirmed') {
                    document.getElementById('event-response').innerHTML = "Event created successfully. View it <a href='" + resp.htmlLink + "'>online here</a>.";
            } else {
                    document.getElementById('event-response').innerHTML = "There was a problem. Reload page and try again.";
                }
    
            console.log(resp);
        });
    }	
}





// Trigger Function, takes selected values and push them 
// in DB thesholds table through ajax call and then prit them as html paragraphs
function planEvent(){
//prende i valori e li inserisce nel db
var attuatore= $("#attuatori-1").val();
var value = $("#value-1").val();
console.log("sono qui");
$.ajax({
    url: 'https://homie-mgr.xyz:8080/thesholds/put',
    method: 'POST',
    data: {
        "name":attuatore, 
        "value":value
    },
    success: function(data) {console.log(data);
        item="<p>Soglia registrata con successo!</p>";
        $('.plannedEvents').append(item);}
    });

}
*/