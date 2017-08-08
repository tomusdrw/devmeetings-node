# Instalujemy pm2 globalnie
$ npm i -g pm2

$ pm2 list
$ pm2 start -i 5 ./index.js
$ pm2 save
$ pm2 resurrect
$ pm2 monit
$ pm2 show 0
$ pm2 logs 0
$ pm2 startup ubuntu
$ pm2 pull 0
