export function notFoundHandler(req, _res, _next) {
  const error = new Error(
    `method ${req.method} on path ${req.originalUrl} not found`,
  );
  error['status'] = 404;
  throw error;
}

export function globalErrorHandler(error, _req, res, _next) {
  res.status(error['status'] || 500);
  res.json({ error: { message: error.message } });
}
