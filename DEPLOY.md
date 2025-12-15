# Deployment Guide

This guide describes how to deploy the frontend application to an Ubuntu server using Docker.

## Prerequisites

1.  **Docker & Docker Compose**: Ensure Docker and Docker Compose are installed on your Ubuntu server.
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose -y
    ```

2.  **Backend Service**: Ensure your backend service is running and accessible.
    *   If running on the same server but outside Docker, it should be listening on port `8001` (or update `nginx.conf` accordingly).
    *   The `docker-compose.yml` is configured to access the host machine via `host.docker.internal`.

## Deployment Steps

1.  **Transfer Files**: Copy the project files to your server.
    ```bash
    scp -r z-image-gemini-build user@your-server-ip:~/
    ```

2.  **Navigate to Directory**:
    ```bash
    cd z-image-gemini-build
    ```

3.  **Build and Run**:
    ```bash
    sudo docker-compose up -d --build
    ```

4.  **Verify**:
    *   Access `http://your-server-ip` in your browser.
    *   The frontend should load and be able to communicate with the backend via `/api/`.

## Configuration

*   **Nginx Proxy**: The `nginx.conf` file proxies `/api/` requests to `http://host.docker.internal:8001`. Modify this if your backend runs elsewhere.
*   **Ports**: The `docker-compose.yml` exposes port `80`. Change this if you need to run on a different port.

## Updates

To update the application:
1.  Pull the latest code or transfer updated files.
2.  Run `sudo docker-compose up -d --build` to rebuild and restart the container.
