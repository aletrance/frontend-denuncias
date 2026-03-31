#!/bin/sh
# Ensure uploads and informes directory have correct permissions for appuser
# This runs as root before dropping to appuser
chown -R appuser:appgroup /app/uploads
chown -R appuser:appgroup /app/03_INFORMES_LISTOS

# Switch to appuser and start the application
exec su-exec appuser node dist/app.js
