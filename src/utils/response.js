module.exports = {
    success: (res, data, message = 'Operation successful') => {
      res.status(200).json({
        message,
        data,
      });
    },
    error: (res, message = 'Operation failed', code = 500) => {
      res.status(code).json({
        message,
      });
    },
  }
  