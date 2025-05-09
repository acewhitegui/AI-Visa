#!/bin/bash
cd ..
# check files
ls

# 定义变量
REGISTRY="registry.ap-southeast-1.aliyuncs.com/whitedit"
IMAGE_NAME="ai-visa-web"
DOCKER_VERSION="${DOKCER_VERSION:-latest}"

docker build --build-arg STRAPI_API_TOKEN="$STRAPI_API_TOKEN" --build-arg NEXT_PUBLIC_STRAPI_API_URL="$NEXT_PUBLIC_STRAPI_API_URL" --build-arg STRAPI_API_URL="$STRAPI_API_URL" -t ${REGISTRY}/${IMAGE_NAME}:"${DOCKER_VERSION}" . -f Dockerfile
docker push ${REGISTRY}/${IMAGE_NAME}:"${DOCKER_VERSION}"
#　清除none镜像
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker stop||true
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker rm||true
docker images|grep none|awk '{print $3 }'|xargs docker rmi||true