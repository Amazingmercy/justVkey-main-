const currency = ((req, res, next) => {
    const currency = req.query.currency;
    // Make currency available in all templates
    res.locals.currency = currency;
    
    next()
    
  });


  module.exports = currency