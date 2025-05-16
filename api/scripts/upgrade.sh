IMAGE_NAME="crpi-ka5m16o5z8ea5t9p.eu-west-1.personal.cr.aliyuncs.com/gotoiom/ai-visa-api"
docker pull ${IMAGE_NAME}
docker service update ai-visa_api --image ${IMAGE_NAME} --force