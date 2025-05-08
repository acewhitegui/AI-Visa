cd ..
# check files
ls

REGISTRY="registry.ap-southeast-1.aliyuncs.com/whitedit"
IMAGE_NAME="ai-visa-api"
DOCKER_VERSION="${DOKCER_VERSION:-latest}"


docker build -t ${REGISTRY}/${IMAGE_NAME}:"${DOCKER_VERSION}" . -f Dockerfile
docker push ${REGISTRY}/${IMAGE_NAME}:"${DOCKER_VERSION}"
#　清除none镜像
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker stop||true
docker ps -a | grep "Exited" | awk '{print $1 }'|xargs docker rm||true
docker images|grep none|awk '{print $3 }'|xargs docker rmi||true