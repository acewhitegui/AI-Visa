DOCKER_IMAGE="crpi-ka5m16o5z8ea5t9p.eu-west-1.personal.cr.aliyuncs.com/gotoiom/ai-visa-cms"
docker pull ${DOCKER_IMAGE}
docker service update ai-visa_cms --image ${DOCKER_IMAGE} --force