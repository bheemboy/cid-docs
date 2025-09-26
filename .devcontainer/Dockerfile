FROM node:24-bullseye-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y git bash ca-certificates openssl curl sudo && \
    rm -rf /var/lib/apt/lists/* && \
    npm config set cafile /etc/ssl/certs/ca-certificates.crt && \
    echo "node ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

# Install Docusaurus CLI globally
RUN npm install -g @docusaurus/core@latest

# Create workspace directory
WORKDIR /workspace

# Switch to node user
USER node

EXPOSE 3000
