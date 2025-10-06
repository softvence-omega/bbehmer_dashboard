# ---------------------------------------
# Variables
# ---------------------------------------
COMPOSE_FILE := compose.yaml
SERVICE := frontend
IMAGE := sajibsv/bbehmer-frontend:latest

.PHONY: all build rebuild push up down restart deploy logs

# Build Docker image locally (multi-stage)
build:
	docker build -t $(IMAGE) .

# Rebuild without cache
rebuild:
	docker build --no-cache -t $(IMAGE) .

# Push Docker image to Docker Hub
push:
	docker push $(IMAGE)

# Run using docker-compose
up:
	docker compose -f $(COMPOSE_FILE) up

# Stop services
down:
	docker compose -f $(COMPOSE_FILE) down

# Restart services
restart:
	$(MAKE) down
	$(MAKE) up

# Show logs
logs:
	docker compose -f $(COMPOSE_FILE) logs -f $(SERVICE)

# Deploy: pull latest image and restart container
deploy:
	docker compose -f $(COMPOSE_FILE) pull $(SERVICE)
	$(MAKE) restart
