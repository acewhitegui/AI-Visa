DOCKER_IMAGE="registry.ap-southeast-1.aliyuncs.com/whitedit/ai-visa-cms"
docker pull ${DOCKER_IMAGE}
docker service update ai-visa_cms --image ${DOCKER_IMAGE} --force