# wakey

## Running on Raspberry Pi 3:

Edit power save mode: `xset dpms 0 0 7200; xset s 0 0`

Install Chromium: `sudo apt-get install chromium-browser`

Install xautomation: `sudo apt-get install xautomation`

Configure crontab to run on/off scripts


`screenon.sh`

```bash
#!/bin/sh

vcgencmd display_power 1
sleep 10
DISPLAY=:0 chromium-browser wakey.herokuapp.com &
sleep 10
xte 'key F11' -x:0
```

`screenoff.sh`

```bash
#!/bin/sh

vcgencmd display_power 0
pkill -HUP chromium
```
