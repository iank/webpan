# WebSocket-based Camera Panning Using a Pololu Maestro Servo Controller

Afternoon hack.

## Get Pololu UscCmd

* Get `Maestro Servo Controller Linux Software (release 220509)` from https://www.pololu.com/product/1350/resources
* Follow their README to install dependencies.

## Set up nvm/nodel

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

nvm install node
nvm use node
npm install ws

node serial.js
```

## Set up cloudflare tunnel

* Get standalone binary from https://github.com/cloudflare/cloudflared/releases
* Follow [Cloudflare's instructions](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/local/#set-up-a-tunnel-locally-cli-setup) to set up a tunnel locally (do not use web interface)
  * In step 4, the config.yml should look like:
```
tunnel: UUID
credentials-file: /home/USER/.cloudflared/UUID.json
ingress:
  - hostname: DOMAIN
    service: ws://localhost:8080
  - service: http_status:404
```
  * In step 6, use the `--config` commandline.
