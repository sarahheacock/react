export default function () {
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  // if browser doesn't support WebSocket, just show
  // some notification and exit
  if (!window.WebSocket) {
    console.log('Sorry, but your browser doesn\'t support WebSocket.');
    return;
  }
  // open connection
  // Create WebSocket connection.
  let socket = new WebSocket(window.location.href.replace('http', 'ws'));
  socket.reload = false;

  // Connection opened
  socket.addEventListener('open', function (event) {
      socket.send('Web socket connected...');
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
      console.log('Message from server: ', event.data);
      //send message from server in order to prevent window from reloading
      if(event.data === "kill"){
        socket.reload = false;
        socket.close();
      }
      if(event.data === "reload"){
        socket.reload = true;
      }
  });

  // This checks for connection and reloads the page if it does not find Connection
  // If server sends message "kill" (user enter ctrl C), the page does not reload
  // This signifies the server process is disconnected and avoids an infinite loop

  function check(){
    setTimeout(function() {
      if(socket.readyState !== 1) {
        console.log(socket.readyState, 'Unable to communicate with the WebSocket server.');
        if(socket.readyState === 3){
          window.location.reload(socket.reload);
        }
      }

      if(socket.reload){
        check();
      }
    }, 3000);
  }

  check();
};
