DOCKER_IMAGE="registry.ap-southeast-1.aliyuncs.com/whitedit/ai-visa-web"
docker pull ${DOCKER_IMAGE}
docker service update ai-visa_web --image ${DOCKER_IMAGE} --force