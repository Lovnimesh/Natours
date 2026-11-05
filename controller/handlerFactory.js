import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // delete the tour of id related to user

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with requested id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: 'none',
    });
  });

export { deleteOne };
