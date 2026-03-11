#!/bin/sh
# Ensure uploads directory has correct permissions for appuser
# This runs as root before dropping to appuser
chown -R appuser:appgroup /app/uploads

# Switch to appuser and start the application
exec su-exec appuser node dist/app.js
