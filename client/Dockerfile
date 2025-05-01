FROM node:22

# Set config
ARG REACT_APP_API_URL
ARG REACT_APP_API_URL_PRODUCTION
ARG REACT_APP_ENVIRONMENT

# Set as environment variables for React to use
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_API_URL_PRODUCTION=${REACT_APP_API_URL_PRODUCTION}
ENV REACT_APP_ENVIRONMENT=${REACT_APP_ENVIRONMENT}
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

# Create and change to the app directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create entrypoint script - build at runtime to access environment variables
RUN echo '#!/bin/sh\n\
# Print environment variables for debugging (optional)\n\
echo "Building with REACT_APP_API_URL=$REACT_APP_API_URL"\n\
echo "Building with REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT"\n\
\n\
# Build with environment variables available at runtime\n\
npm run build\n\
\n\
# Start Caddy to serve the built app\n\
caddy run --config Caddyfile --adapter caddyfile\n\
' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Install Caddy
RUN apt-get update && apt-get install -y curl && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main" | tee /etc/apt/sources.list.d/caddy-stable.list && \
    apt-get update && \
    apt-get install -y caddy && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy Caddyfile
COPY Caddyfile .
RUN caddy fmt Caddyfile --overwrite

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]