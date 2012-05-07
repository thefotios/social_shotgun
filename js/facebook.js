// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
}(document));

update_status = function(){
  FB.api('/me/statuses', {limit: 1}, function(response) {
    console.log(response);
  });
}

// Init the SDK upon load
window.fbAsyncInit = function() {
  FB.init({
    appId      : '235925526507001', // App ID
    channelUrl : '//'+window.location.hostname+'/channel', // Path to your Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  // listen for and handle auth.statusChange events
  FB.Event.subscribe('auth.statusChange', function(response) {
    if (response.authResponse) {
      // user has auth'd your app and is logged into Facebook
      FB.api('/me', function(me){
        if (me.name) {
          document.getElementById('auth-displayname').innerHTML = me.name;
        }
      })
      document.getElementById('auth-loggedout').style.display = 'none';
      document.getElementById('auth-loggedin').style.display = 'block';
    } else {
      // user has not auth'd your app, or is not logged into Facebook
      document.getElementById('auth-loggedout').style.display = 'block';
      document.getElementById('auth-loggedin').style.display = 'none';
    }
  });

  // respond to clicks on the login and logout links
  document.getElementById('auth-loginlink').addEventListener('click', function(){
    FB.login(function(response) {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
          console.log('Good to see you, ' + response.name + '.');
        });
        update_status;
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'user_status'});
  });

  document.getElementById('auth-logoutlink').addEventListener('click', function(){
    FB.logout();
  }); 

  FB.api('/platform/posts', { limit: 3 }, function(response) {
    for (var i=0, l=response.length; i<l; i++) {
      var post = response[i];
      if (post.message) {
        alert('Message: ' + post.message);
      } else if (post.attachment && post.attachment.name) {
        alert('Attachment: ' + post.attachment.name);
      }
    }
  });
} 
