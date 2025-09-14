const Product = require('../models/product');

exports.list = async (req, res) => {
  // TODO: 获取产品列表
  const products = await Product.findAll();
  res.json({ data: products });
};
