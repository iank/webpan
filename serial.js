const { execSync } = require('child_process');

// Function to send a command to the Maestro controller
function sendCommand(channel, position) {
  // Construct the command to send to the Pololu Maestro servo controller
  const command = `UscCmd --servo ${channel},${position}`;

  try {
    // Execute the command and capture the output
    const output = execSync(command).toString();

    // Check the output for errors
    if (output.includes('Error response') || output.includes('Failed to set target')) {
      throw new Error(`Failed to set servo position: ${output}`);
    }

    console.log(`Set servo position: channel=${channel}, position=${position}`);
  } catch (err) {
    console.error(`Error setting servo position: ${err}`);
  }
}

const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  fs.readFile('html/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading index');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({server});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected.');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    try {
      // Parse the incoming message as JSON
      const command = JSON.parse(message);

      // Extract the servo number and target position from the command
      const servoNumber = command.servoNumber;
      const targetPosition = Math.min(Math.max(command.targetPosition, 4000), 8000);

      // Send the set target command to the Maestro servo controller
      sendCommand(servoNumber, targetPosition);
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected.');
  });

  // Handle websocket connection errors
  ws.on('error', (error) => {
    console.log('Error: ' + error);
  });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
