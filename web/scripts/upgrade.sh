DOCKER_IMAGE="registry.ap-southeast-1.aliyuncs.com/whitedit/ai-visa-web"
docker pull ${DOCKER_IMAGE}
docker service update any-converters_web --image ${DOCKER_IMAGE} --force