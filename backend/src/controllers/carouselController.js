const Carousel = require('../models/carousel');
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH || './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

class CarouselController {
  // 获取轮播图列表
  async getCarousels(req, res) {
    try {
      const { status } = req.query;
      const where = {};
      
      if (status !== undefined) {
        where.status = status === 'true';
      }
      
      const carousels = await Carousel.findAll({
        where,
        order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
      });
      
      res.json({
        success: true,
        data: carousels
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取单个轮播图
  async getCarousel(req, res) {
    try {
      const { id } = req.params;
      const carousel = await Carousel.findByPk(id);
      
      if (!carousel) {
        return res.status(404).json({ error: '轮播图不存在' });
      }
      
      res.json({
        success: true,
        data: carousel
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 创建轮播图
  async createCarousel(req, res) {
    try {
      const { title, link_url, sort_order, status } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: '请上传图片' });
      }
      
      const carousel = await Carousel.create({
        title,
        image_url: '/uploads/' + req.file.filename,
        link_url,
        sort_order: parseInt(sort_order) || 0,
        status: status !== 'false'
      });
      
      res.json({
        success: true,
        message: '轮播图创建成功',
        data: carousel
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 更新轮播图
  async updateCarousel(req, res) {
    try {
      const { id } = req.params;
      const { title, link_url, sort_order, status } = req.body;
      
      const carousel = await Carousel.findByPk(id);
      if (!carousel) {
        return res.status(404).json({ error: '轮播图不存在' });
      }
      
      const updateData = {
        title,
        link_url,
        sort_order: parseInt(sort_order) || carousel.sort_order,
        status: status !== 'false'
      };
      
      // 如果上传了新图片
      if (req.file) {
        updateData.image_url = '/uploads/' + req.file.filename;
      }
      
      await carousel.update(updateData);
      
      res.json({
        success: true,
        message: '轮播图更新成功',
        data: carousel
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 删除轮播图
  async deleteCarousel(req, res) {
    try {
      const { id } = req.params;
      
      const carousel = await Carousel.findByPk(id);
      if (!carousel) {
        return res.status(404).json({ error: '轮播图不存在' });
      }
      
      await carousel.destroy();
      
      res.json({
        success: true,
        message: '轮播图删除成功'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取上传中间件
  getUploadMiddleware() {
    return upload.single('image');
  }
}

module.exports = new CarouselController();