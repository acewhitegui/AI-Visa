DOCKER_IMAGE="registry.ap-southeast-1.aliyuncs.com/whitedit/any-converters-cms"
docker pull ${DOCKER_IMAGE}
docker service update any-converters_cms --image ${DOCKER_IMAGE} --force