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
  socket.exit = false;

  // Connection opened
  socket.addEventListener('open', function (event) {
      socket.send('Hello Server!');
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
      console.log('Message from server: ', event.data);
      //send message from server in order to prevent window from reloading
      if(event.data === "exit"){
        socket.exit = true;
        socket.send("close");
      }
  });

  /**
   * This method is optional. If the server wasn't able to
   * respond to the in 3 seconds then show some error message
   * to notify the user that something is wrong.
   */
  setInterval(function() {
    if (socket.readyState !== 1) {
      console.log(socket.readyState, 'Unable to communicate with the WebSocket server.', socket.exit);
      if(socket.readyState === 3){
        window.location.reload(!socket.exit);
      }
    }
  }, 1000);

};
