# fivem-rapidtestdeployment
Javascript resource allowing Javascript testing and native research from within FiveM

Adds a /rtd chat command that allows entry of Javascript within FiveM.

Usage: /rtd [arguments]
  
  arguments : Optional parameter that is interpreted as Javascript with access to the FiveM natives bindings.
    If arguments has a return value, that value is displayed above the minimap as an alert.
  
  If no arguments are found, a multi-line text input area is displayed. After editing, use the
  Cancel or Confirm button or the Esc or Shift+Enter keys. 
  
Adds alert(string) and log(string) Javascript functions.

  alert(string) displays the string above the minimap.
  log(string) writes the string to server.log in the resources/rapidtestdeployment folder.

**Video** (Ver 1.0)
  [![Alt text](https://img.youtube.com/vi/588ePmiJUoU/0.jpg)](https://youtu.be/588ePmiJUoU)

Version 1.2

Added chat message that RTD has loaded to first playerSpawn event.

Added log() command, empty server.log file for it to target, and necessary server script for file writing.

/rtd log('Example text'); will write 'Example text' (without the quotes) to server.log.

server.log is overwritten on first player spawn for a client.

log() and server.log may exhibit unintended behavior on a multi-client server (only tested with a single client.)

Version 1.1

Added a text file viewer to the /rtd display.

Select files from the client filesystem to view as a reference.

Forward and backward case sensitive search (Some slowdown on larger than 1MB files.)

How To Install:

Install the rapidtestdeployment folder into your server's resources folder and add 'start rapidtestdeployment'
to your server.cfg.
