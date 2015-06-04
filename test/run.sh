#docker run -i -t --entrypoint=bash rdpanek/casperjs:latest

casperjs test  --web-security=no    --server=http://172.17.42.1:8080  *Test.js
