const { body, param, query, validationResult } = require('express-validator');

// Middleware xử lý lỗi validation
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

// === CATEGORY VALIDATORS ===

const createCategoryValidation = [
    body('name')
        .notEmpty()
        .withMessage('Tên category là bắt buộc')
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên category phải từ 2-100 ký tự')
        .trim(),

    body('icon_url')
        .optional()
        .isURL()
        .withMessage('Icon URL phải là URL hợp lệ')
        .isLength({ max: 255 })
        .withMessage('Icon URL không được quá 255 ký tự'),

    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active phải là boolean'),

    body('sort_order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sort_order phải là số nguyên không âm')
];

const updateCategoryValidation = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Tên category phải từ 2-100 ký tự')
        .trim(),

    body('icon_url')
        .optional()
        .isURL()
        .withMessage('Icon URL phải là URL hợp lệ')
        .isLength({ max: 255 })
        .withMessage('Icon URL không được quá 255 ký tự'),

    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active phải là boolean'),

    body('sort_order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sort_order phải là số nguyên không âm')
];

// === SERVICE VALIDATORS ===

const createServiceValidation = [
    body('category_id')
        .notEmpty()
        .withMessage('Category ID là bắt buộc')
        .isInt({ min: 1 })
        .withMessage('Category ID phải là số nguyên dương'),

    body('name')
        .notEmpty()
        .withMessage('Tên service là bắt buộc')
        .isLength({ min: 2, max: 150 })
        .withMessage('Tên service phải từ 2-150 ký tự')
        .trim(),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Mô tả không được quá 1000 ký tự')
        .trim(),

    body('price_type')
        .optional()
        .isIn(['fixed', 'hourly', 'quote'])
        .withMessage('price_type phải là fixed, hourly hoặc quote'),

    body('default_price')
        .notEmpty()
        .withMessage('Giá mặc định là bắt buộc')
        .isFloat({ min: 0 })
        .withMessage('Giá mặc định phải là số không âm'),

    body('duration_minutes')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Thời gian phải là số nguyên dương (phút)'),

    body('commission_rate')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Tỷ lệ hoa hồng phải từ 0-100%'),

    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active phải là boolean')
];

const updateServiceValidation = [
    body('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Category ID phải là số nguyên dương'),

    body('name')
        .optional()
        .isLength({ min: 2, max: 150 })
        .withMessage('Tên service phải từ 2-150 ký tự')
        .trim(),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Mô tả không được quá 1000 ký tự')
        .trim(),

    body('price_type')
        .optional()
        .isIn(['fixed', 'hourly', 'quote'])
        .withMessage('price_type phải là fixed, hourly hoặc quote'),

    body('default_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Giá mặc định phải là số không âm'),

    body('duration_minutes')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Thời gian phải là số nguyên dương (phút)'),

    body('commission_rate')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Tỷ lệ hoa hồng phải từ 0-100%'),

    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active phải là boolean')
];

// === PARAM VALIDATORS ===

const categoryIdValidation = [
    param('categoryId')
        .isInt({ min: 1 })
        .withMessage('Category ID phải là số nguyên dương')
];

const serviceIdValidation = [
    param('serviceId')
        .isInt({ min: 1 })
        .withMessage('Service ID phải là số nguyên dương')
];

// === QUERY VALIDATORS ===

const queryValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page phải là số nguyên dương'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit phải từ 1-100'),

    query('search')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Từ khóa tìm kiếm phải từ 1-100 ký tự')
        .trim(),

    query('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status phải là active hoặc inactive'),

    query('category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Category ID phải là số nguyên dương')
];

module.exports = {
    // Category validators
    createCategoryValidation,
    updateCategoryValidation,
    categoryIdValidation,

    // Service validators
    createServiceValidation,
    updateServiceValidation,
    serviceIdValidation,

    // Query validators
    queryValidation,

    // Error handler
    handleValidationErrors
};