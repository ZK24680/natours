const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// exports.getAllUser = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     data: {
//       users
//     }
//   });
// });

const objectfilter = (obj, ...avaliableFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (avaliableFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //Check make sure not to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for update password!. Please use the route /updatePassword',
        400
      )
    );
  }

  //filter only suggested fields for  update
  const filteredObj = objectfilter(req.body, 'name', 'email');

  //get the user from protect route  and update
  const user = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  //get the user Id from protect (from JWT token payload)

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not yet defined! Please use /signup instead!'
  });
};

// exports.createUser = factory.createOne(User);

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Don't update password
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
