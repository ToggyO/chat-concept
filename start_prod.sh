#/bin/bash
export $(cat .env | xargs)
docker-compose down
docker rmi $(docker images "chat-concept*" -q)
docker rmi $(docker images -f "dangling=true" -q)
docker-compose up --build
export $(cat clean.env | xargs)

#export $(cat .env | xargs) && docker-compose -f ./docker-compose.local.yml up --build
#while read line; do export "$line";
#done < .env
#echo "done"
