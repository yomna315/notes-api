function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function globalErrorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  if (err.code === 11000) {
    return res
      .status(400)
      .json({ message: "Duplicate field value", details: err.keyValue });
  }

  return res
    .status(err.status || 500)
    .json({ message: err.message || "Something went wrong" });
}

export { asyncHandler, globalErrorHandler };
