export function notFoundHandler(request, response) {
  response.status(404).json({ message: `Route ${request.originalUrl} not found.` });
}

export function errorHandler(error, request, response, next) {
  console.error(error);

  response.status(error.status ?? 500).json({
    message: error.message || 'Something went wrong.',
  });
}