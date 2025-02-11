const currency = (req, res, next) => {
  if (req.query.currency) {
      res.cookie('currency', req.query.currency, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
  }

  res.locals.currency = req.cookies.currency || 'NGN';

  next();
};

module.exports = currency;
