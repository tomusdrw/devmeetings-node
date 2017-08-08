$ dd if=/dev/zero of=file count=10 bs=1048576
$ dd if=/dev/zero of=file count=128 bs=1024
$ wrk -d10s -t8 -c 100 http://localhost:3000/sync --latency
$ npm i blocked

# 2/ Odpalamy node z opcją --inspect i otwieramy chrome
$ node --inspect index.js
$ open chrome://inspect

