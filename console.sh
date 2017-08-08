# Stwórzmy 10MB plik
$ dd if=/dev/zero of=file count=10 bs=1048576

# lub plik 128KB
$ dd if=/dev/zero of=file count=128 bs=1024

# Testujemy narzędziemy wrk
$ wrk -d10s -t8 -c 100 http://localhost:3000/sync --latency

