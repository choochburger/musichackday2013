
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.helper = function(req, res) {
  res.render('helper', { layout: false });
};
