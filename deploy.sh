CONTEXT_NAME="portfolio-site"
STACK_NAME="album-cut"
COMPOSE_FILE="compose.prod.yaml"

echo "Switching to remote context..."
docker context use "${CONTEXT_NAME}"

echo "Deploying stack to remote..."
docker stack deploy -c "${COMPOSE_FILE}" "${STACK_NAME}" --with-registry-auth

echo "Switching to default context"
docker context use "default"

echo "All done!"
