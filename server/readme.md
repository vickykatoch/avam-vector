https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

docker build . -t bk/amps-pub
docker save -o ampspub.tar bk/amps-pub

docker load -i ampspub.tar

docker run -d bk/amps-pub

docker exec -it <container id> /bin/bash

https://buildvirtual.net/how-to-copy-a-docker-image/

