IMAGE_NAME="registry.ap-southeast-1.aliyuncs.com/whitedit/ai-visa-api"
docker pull ${IMAGE_NAME}
docker service update ai-visa_api --image ${IMAGE_NAME} --force