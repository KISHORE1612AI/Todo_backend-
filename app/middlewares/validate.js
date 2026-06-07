const validate = (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required',
    });
  }

  if (typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Title must be a string',
    });
  }

  if (title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Title must be at least 3 characters',
    });
  }

  if (title.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Title cannot exceed 100 characters',
    });
  }

  next();
};

export default validate;