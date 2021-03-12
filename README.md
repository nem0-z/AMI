# AMI

First configure your manager in /etc/asterisk/manager.conf like following (sample):
```javascript
[general]
enabled = yes
bindaddr = your-host
port = your-port

[your-user]
secret = your-pw
deny = 0.0.0.0/0.0.0.0
permit = 127.0.0.1/255.255.255.255
read = all,system,call,log,verbose,command,agent,user,config
write = all,system,call,log,verbose,command,agent,user,config
```

Run the app as following: 
`sudo node server.js your-host your-port your-user your-pw`. 
Open the given html and do whatever you want, idc.


Running as sudo is needed because we will be running asterisk CLI commands to fetch some data.


