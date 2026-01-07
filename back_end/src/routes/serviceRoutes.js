const express = require('express');
const serviceController = require('../controllers/serviceController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const {
    createCategoryValidation,
    updateCategoryValidation,
    categoryIdValidation,
    createServiceValidation,
    updateServiceValidation,
    serviceIdValidation,
    queryValidation,
    handleValidationErrors
} = require('../validators/serviceValidator');

const router = express.Router();

// === PUBLIC ROUTES ===

// Lấy tất cả categories đang hoạt động
router.get('/categories',
    serviceController.getActiveCategories
);

// Lấy tất cả services đang hoạt động
router.get('/services',
    queryValidation,
    handleValidationErrors,
    serviceController.getActiveServices
);

// Lấy chi tiết service
router.get('/services/:serviceId',
    serviceIdValidation,
    handleValidationErrors,
    serviceController.getServiceById
);

// Lấy services theo category
router.get('/categories/:categoryId/services',
    categoryIdValidation,
    queryValidation,
    handleValidationErrors,
    serviceController.getServicesByCategory
);

// === ADMIN ROUTES ===

// Middleware yêu cầu authentication và admin role cho tất cả admin routes
router.use('/admin', authenticateToken);
router.use('/admin', requireAdmin);

// === ADMIN CATEGORY ROUTES ===

// Lấy tất cả categories (bao gồm inactive)
router.get('/admin/categories',
    queryValidation,
    handleValidationErrors,
    serviceController.getAllCategories
);

// Tạo category mới
router.post('/admin/categories',
    createCategoryValidation,
    handleValidationErrors,
    serviceController.createCategory
);

// Cập nhật category
router.put('/admin/categories/:categoryId',
    categoryIdValidation,
    updateCategoryValidation,
    handleValidationErrors,
    serviceController.updateCategory
);

// Xóa category
router.delete('/admin/categories/:categoryId',
    categoryIdValidation,
    handleValidationErrors,
    serviceController.deleteCategory
);

// === ADMIN SERVICE ROUTES ===

// Lấy tất cả services (bao gồm inactive)
router.get('/admin/services',
    queryValidation,
    handleValidationErrors,
    serviceController.getAllServices
);

// Tạo service mới
router.post('/admin/services',
    createServiceValidation,
    handleValidationErrors,
    serviceController.createService
);

// Cập nhật service
router.put('/admin/services/:serviceId',
    serviceIdValidation,
    updateServiceValidation,
    handleValidationErrors,
    serviceController.updateService
);

// Xóa service
router.delete('/admin/services/:serviceId',
    serviceIdValidation,
    handleValidationErrors,
    serviceController.deleteService
);

// Lấy thống kê services
router.get('/admin/stats',
    serviceController.getServiceStats
);

module.exports = router;