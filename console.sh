$ dd if=/dev/zero of=file count=10 bs=1048576
$ dd if=/dev/zero of=file count=128 bs=1024
$ wrk -d10s -t8 -c 100 http://localhost:3000/sync --latency

# Instalujemy blocked
npm i blocked

