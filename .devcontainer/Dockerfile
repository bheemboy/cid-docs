FROM node:24-alpine

# Install system dependencies
RUN apk add --no-cache git bash ca-certificates && update-ca-certificates

# Install Docusaurus CLI globally
RUN npm install -g @docusaurus/core@latest

# Create workspace directory
WORKDIR /workspace

# Switch to node user
USER node

EXPOSE 3000
