<!doctype html>
<html lang="it">
   <head>
    <meta charset="utf-8"/>
    <title>Homie | Login</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel ="stylesheet" href="login.css">
    <link rel ="stylesheet" href="./font-awesome-4.7.0/css/font-awesome.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/css-doodle/0.7.0/css-doodle.min.js"></script>
  </head>
  <body>
    <nav class="navbar navbar-expand-lg navbar-light ">

        <ul class="navbar-nav mr-auto">
          <li class="nav-item active"><a class="nav-item nav-link" href="#"><p>Terms & Conditions</p></a></li>
          <li class="nav-item"><a class="nav-item nav-link" href="#"><p>Privacy Policy</p></a></li>
          <li class="nav-item"><a class="nav-item nav-link"  href="#"><p>About</p></a></li>
        </ul>
      
    </nav>
    <div class = "container">
      <div class="row">
          <div class ="col-6">
              <div class="accesso">
                  <form class="login" action="fflogin.php" method="POST">

                      <h1 class="title">Accedi</h1>
                      <i class="fa fa-user"></i>
                      <input type="username" value="<?php if(isset($_COOKIE["username"])) { echo $_COOKIE["username"]; } ?>"placeholder="Username" size="15" required autofocus name="username"/>

                      <i class="fa fa-key"></i>
                      <input type="password" value="<?php if(isset($_COOKIE["password"])) { echo $_COOKIE["password"]; } ?>"placeholder="Password" size="15" required name="password"/>
                      
                      <p><input type="checkbox" id="checkbox" name="remember"/> Remember me</p>
                      <button class="button" type="submit"><p>Log in</p></button>

                </form>
              </div>

              <!-- LOGIN GOOGLE-->
    
              <div id=Autenticato>
                <script>
                  var GoogleAuth;
                  var SCOPE = 'https://www.googleapis.com/auth/calendar';
                  
                  function saveUserData(user){
                    $.post('ffuserData.php', { oauth_provider:'google', userData: user });
                  }
                      
                  function revokeAccess() { GoogleAuth.disconnect(); }
                  //In order to keep user datas and insert or update their values in a static db
                  // Google Api provides a set of function to manage user profile
                  // Here we take useful datas and send them by a post to a php file which 
                  // will accomplish on top descripted actions
                  function setSigninStatus() {
                    var user = GoogleAuth.currentUser.get();
                    console.log(user);
                    if(user.Ba!=null){
                      var profile = user.getBasicProfile();
                      const datas={
                            id: profile.getId(),
                            gname: profile.getGivenName(),
                            email: profile.getEmail()
                      };
                      var stringa = JSON.stringify(datas);
                      saveUserData(stringa);
                    }
                    var isAuthorized = user.hasGrantedScopes(SCOPE);
                      if (isAuthorized) {
                    
                        $('#sign-in-or-out-button').html('Sign out');
                        $('#revoke-access-button').css('display', 'inline-block');
                        $('#auth-status').html('You are currently signed in and have granted ' + 'access to this app.');
                                //         fetch()
                        window.location="ffuserData.php?oauth_provider=google&userData="+ stringa;

                                //.then(data => data.text())
                                //.then(html => document.getElementById('Autenticato').innerHTML = html);
                      } else {
                        $('#sign-in-or-out-button').html('<img src="./images/btn_google_signin_light_pressed_web.png" style="width:50%; height:12.5%; margin-right:100%">');
                        $('#revoke-access-button').css('display', 'none');
                        $('#auth-status').html('<p>You have not authorized this app or you are signed out.<p>');
                        }
                  }
                  
                  function updateSigninStatus() { setSigninStatus();}

                  function initClient() {
                      // In practice, your app can retrieve one or more discovery documents.
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
                  
                          // Listen for sign-in state changes.
                        GoogleAuth.isSignedIn.listen(updateSigninStatus);
                  
                          // Handle initial sign-in state. (Determine if user is already signed in.)
                        var user = GoogleAuth.currentUser.get();
                              
                        setSigninStatus();
                  
                        // Call handleAuthClick function when user clicks on
                        //      "Sign In/Authorize" button.
                        $('#sign-in-or-out-button').click(function() { handleAuthClick();});
                        
                        $('#revoke-access-button').click(function() { revokeAccess(); });
                      });
                  }
                  
                  function handleClientLoad() {
                          // Load the API's client and auth2 modules.
                          // Call the initClient function after the modules load.
                  gapi.load('client:auth2', initClient);}
                  
                  function handleAuthClick() {
                    if (GoogleAuth.isSignedIn.get()) {
                          
                      GoogleAuth.signOut();// User is authorized and has clicked "Sign out" button.
                    
                    }  else {
                        
                      GoogleAuth.signIn(); // User is not signed in. Start Google auth flow.
                    }
                  }
              </script>
                
                <button id="sign-in-or-out-button"style="margin-left: 25px"></button>
                <button id="revoke-access-button"style="display: none">Revoke access</button>
                              
                <div id="auth-status" style="display: inline; padding-left: 25px"></div>
                              
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
                <script async defer src="https://apis.google.com/js/api.js" onload="this.onload=function(){};
                              
                  handleClientLoad()"onreadystatechange="if (this.readyState == 'complete') this.onload()">
                              
                </script>
              </div>    
            </div>
        
          <div class="col-6">
            <div class ="iscrizione">
              <form class="signup" action="ffsignup.php" method="POST">

                <h1 class="title">Iscriviti</h1>
                <div class="field">
                  <i class="fa fa-user"></i>
                  <input type="username" placeholder="Username" size="20" required name="username"/>
                </div>

                <div class="field">
                  <i class="fa fa-user"></i>
                  <input type="first_name" placeholder="First Name" size="20" required name="first_name"/>
                </div>
                      
                <div class="field">
                  <i class = "fa fa-envelope"></i>
                  <input type="email" placeholder="Email" size="20" required name="email"/>
                </div>
                      
                <div class="field">
                  <i class="fa fa-key" id="key"></i>
                  <input type="password" placeholder="Password" size="20" required name="password"/>
                </div>
                
                <div class="field">
                  <input type="checkbox" id="check" name="test1" value="value1" required name="checkbox">
                  <smal> Accetto <a href="#">Termini&Condizioni</a></small>
                  <button class="button" type="submit"><p>Sign Up</p></button>
                </div>
            
              </form>
            </div>
          </div>
        </div>
      </div>
                    
              
            
    
    <!-- FIORI -->

        <css-doodle>
        /* about flowers */
          :doodle {
            flex: none;
            @grid: 1x24;
            @size: 100vmin;
          }
          --transform: scale(@r(.8, 1.2)) translateX(@r(-200%, 200%)) translateY(@r(-5%, 35%));
          z-index: 2;
          color: @pn(#c4cdc1, #99aead, #6d9197, #658b6f, #2f5d51, #283d31,#99e1d9 , #74a9c3);
          transform-origin: 50% 100%;
          transform: var(--transform); 
          
        /* about petals */
          ::before {
            position: absolute;
            bottom: 70vmin;
            left: -2vmin;
            content: "✿";
            font-size: 15vmin;
            -webkit-text-stroke: .4vmin;
          }
        /* about stems */
          ::after {
            position: absolute;
            bottom: 30vmin;
            left: 0;
            content: "(";
            font-size: 20vmin;
            transform: rotate(60deg) skew(60deg) scale(1.2, 1.8); 
          }
        
          @random {
            ::after {
              content: ")";
              left: 1.7vmin;
              bottom: 30vmin
            }
          }
        /* about shorter ones */
          @nth(5, 10, 15, 20, 24) {
            z-index: 1;
            color: #00b27d; 
          }
        
          /* about medium ones */
          @nth(1, 3, 9, 16, 19) {
            ::after {
              bottom: 30vmin;
              left: 0;
              content: "(";
            }
        /* animations*/ 
            animation: swingLeft @r(1.5, 3)s ease infinite alternate both;
            
            ::before {
              animation: beforeLeft @lr()s ease infinite alternate both;
            }
          }
        
          @nth(5, 7, 15, 18, 23) {
            ::after {
              content: ")";
              left: 1.7vmin;
              bottom: 30vmin;
            }
            animation: swing @r(1.5, 3)s ease infinite alternate both;
        
            ::before {
              animation: before @lr()s ease infinite alternate both;
            }
          }
        
          @keyframes swingLeft {
            0% {
              transform: var(--transform) rotate(0deg);
            }
            100% {
              transform: var(--transform) rotate(7deg);
            }
          }
        
          @keyframes beforeLeft {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(7deg);
            }
          }
        
          @keyframes swing {
            0% {
              transform: var(--transform) rotate(0deg);
            }
            100% {
              transform: var(--transform) rotate(-7deg);
            }
          }
        
          @keyframes before {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(-7deg);
            }
          }
        </css-doodle>
        <css-doodle>
          :doodle {
            flex: none;
            @grid: 1x5;
            @size: 100vmin;
            position: absolute;
          }
          position: fixed;
          top: 100%;
          left: @r(20, 80)%;
          color: @pn(#c4cdc1, #99aead, #6d9197, #658b6f, #2f575d, #28363d, #0059b2, #74a9c3);
        
        /* about flying petals */
          ::before {
            content: "✿";
            font-size: @r(5vmin, 10vmin);
            animation-direction: @p(reverse, initial);
            animation: before @p(2, 3)s linear both infinite @r(0, 6s);
          }
        
        */ flying petals animations */
          animation: move @lp()s linear both infinite @lr();
          animation-direction: @p(reverse, initial);
        
          @keyframes move {
            0% {
              transform: translateX(-@r(-150%, 600%));
            }
        
            100% {
              transform: translateX(@r(300%, 600%));
            }
          }
        
          @keyframes before {
            0% {
              transform: translateY(0%) rotate(0deg);
            }
        
            40% {
              transform: translateY(-55vmin) rotate(-800deg);
            }
        
            50% {
              transform: translateY(-60vmin) rotate(-1000deg);
            }
        
            60% {
              transform: translateY(-55vmin) rotate(-1200deg);
            }
        
            100% {
              transform: translateY(0%) rotate(-2000deg);
            }
          }
        </css-doodle>
        
      
            
            
            
            
            
            
            
            
      <script>
        document.body.style.backgroundColor = "white";
          
        
        document.addEventListener('click', function() {
          document.querySelectorAll('css-doodle').forEach(function(o){ o.update() })
        })
        document.addEventListener('touchstart', function() {
          document.querySelectorAll('css-doodle').forEach(function(o){ o.update() })
        })
      </script>
    </div>
  </body>
</html>