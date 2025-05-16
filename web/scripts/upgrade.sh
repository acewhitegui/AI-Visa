DOCKER_IMAGE="crpi-ka5m16o5z8ea5t9p.eu-west-1.personal.cr.aliyuncs.com/gotoiom/ai-visa-web"
docker pull ${DOCKER_IMAGE}
docker service update ai-visa_web --image ${DOCKER_IMAGE} --force