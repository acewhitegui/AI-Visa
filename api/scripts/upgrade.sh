IMAGE_NAME="registry.ap-southeast-1.aliyuncs.com/whitedit/any-converters-api"
docker pull ${IMAGE_NAME}
docker service update any-converters_api --image ${IMAGE_NAME} --force