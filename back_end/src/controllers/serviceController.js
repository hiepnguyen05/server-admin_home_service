const serviceService = require('../services/serviceService');
const { successResponse, errorResponse } = require('../utils/responseUtils');

class ServiceController {
    // === PUBLIC ROUTES ===

    // Lấy tất cả categories đang hoạt động
    async getActiveCategories(req, res) {
        try {
            const categories = await serviceService.getActiveCategories();
            return successResponse(res, 'Lấy danh sách categories thành công', categories);
        } catch (error) {
            console.error('Lỗi khi lấy categories:', error);
            return errorResponse(res, 'Lỗi server khi lấy categories', 500);
        }
    }

    // Lấy tất cả services đang hoạt động
    async getActiveServices(req, res) {
        try {
            const { category_id, search, page = 1, limit = 10 } = req.query;
            const services = await serviceService.getActiveServices({
                category_id,
                search,
                page: parseInt(page),
                limit: parseInt(limit)
            });
            return successResponse(res, 'Lấy danh sách services thành công', services);
        } catch (error) {
            console.error('Lỗi khi lấy services:', error);
            return errorResponse(res, 'Lỗi server khi lấy services', 500);
        }
    }

    // Lấy chi tiết service
    async getServiceById(req, res) {
        try {
            const { serviceId } = req.params;
            const service = await serviceService.getServiceById(serviceId);

            if (!service) {
                return errorResponse(res, 'Không tìm thấy service', 404);
            }

            return successResponse(res, 'Lấy thông tin service thành công', service);
        } catch (error) {
            console.error('Lỗi khi lấy service:', error);
            return errorResponse(res, 'Lỗi server khi lấy service', 500);
        }
    }

    // Lấy services theo category
    async getServicesByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const services = await serviceService.getServicesByCategory(categoryId, {
                page: parseInt(page),
                limit: parseInt(limit)
            });

            return successResponse(res, 'Lấy services theo category thành công', services);
        } catch (error) {
            console.error('Lỗi khi lấy services theo category:', error);
            return errorResponse(res, 'Lỗi server khi lấy services', 500);
        }
    }

    // === ADMIN ROUTES ===

    // Lấy tất cả categories (bao gồm inactive)
    async getAllCategories(req, res) {
        try {
            const { page = 1, limit = 10, search, status } = req.query;
            const categories = await serviceService.getAllCategories({
                page: parseInt(page),
                limit: parseInt(limit),
                search,
                status
            });
            return successResponse(res, 'Lấy danh sách categories thành công', categories);
        } catch (error) {
            console.error('Lỗi khi lấy categories:', error);
            return errorResponse(res, 'Lỗi server khi lấy categories', 500);
        }
    }

    // Tạo category mới
    async createCategory(req, res) {
        try {
            const categoryData = req.body;
            const category = await serviceService.createCategory(categoryData);
            return successResponse(res, 'Tạo category thành công', category, 201);
        } catch (error) {
            console.error('Lỗi khi tạo category:', error);
            if (error.message.includes('đã tồn tại')) {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Lỗi server khi tạo category', 500);
        }
    }

    // Cập nhật category
    async updateCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const updateData = req.body;

            const category = await serviceService.updateCategory(categoryId, updateData);
            if (!category) {
                return errorResponse(res, 'Không tìm thấy category', 404);
            }

            return successResponse(res, 'Cập nhật category thành công', category);
        } catch (error) {
            console.error('Lỗi khi cập nhật category:', error);
            if (error.message.includes('đã tồn tại')) {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Lỗi server khi cập nhật category', 500);
        }
    }

    // Xóa category
    async deleteCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const result = await serviceService.deleteCategory(categoryId);

            if (!result) {
                return errorResponse(res, 'Không tìm thấy category', 404);
            }

            return successResponse(res, 'Xóa category thành công');
        } catch (error) {
            console.error('Lỗi khi xóa category:', error);
            if (error.message.includes('có services')) {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Lỗi server khi xóa category', 500);
        }
    }

    // Lấy tất cả services (bao gồm inactive)
    async getAllServices(req, res) {
        try {
            const { page = 1, limit = 10, search, category_id, status } = req.query;
            const services = await serviceService.getAllServices({
                page: parseInt(page),
                limit: parseInt(limit),
                search,
                category_id,
                status
            });
            return successResponse(res, 'Lấy danh sách services thành công', services);
        } catch (error) {
            console.error('Lỗi khi lấy services:', error);
            return errorResponse(res, 'Lỗi server khi lấy services', 500);
        }
    }

    // Tạo service mới
    async createService(req, res) {
        try {
            const serviceData = req.body;
            const service = await serviceService.createService(serviceData);
            return successResponse(res, 'Tạo service thành công', service, 201);
        } catch (error) {
            console.error('Lỗi khi tạo service:', error);
            if (error.message.includes('đã tồn tại') || error.message.includes('không tồn tại')) {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Lỗi server khi tạo service', 500);
        }
    }

    // Cập nhật service
    async updateService(req, res) {
        try {
            const { serviceId } = req.params;
            const updateData = req.body;

            const service = await serviceService.updateService(serviceId, updateData);
            if (!service) {
                return errorResponse(res, 'Không tìm thấy service', 404);
            }

            return successResponse(res, 'Cập nhật service thành công', service);
        } catch (error) {
            console.error('Lỗi khi cập nhật service:', error);
            if (error.message.includes('đã tồn tại') || error.message.includes('không tồn tại')) {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Lỗi server khi cập nhật service', 500);
        }
    }

    // Xóa service
    async deleteService(req, res) {
        try {
            const { serviceId } = req.params;
            const result = await serviceService.deleteService(serviceId);

            if (!result) {
                return errorResponse(res, 'Không tìm thấy service', 404);
            }

            return successResponse(res, 'Xóa service thành công');
        } catch (error) {
            console.error('Lỗi khi xóa service:', error);
            if (error.message.includes('có bookings')) {
                return errorResponse(res, error.message, 400);
            }
            return errorResponse(res, 'Lỗi server khi xóa service', 500);
        }
    }

    // Thống kê services
    async getServiceStats(req, res) {
        try {
            const stats = await serviceService.getServiceStats();
            return successResponse(res, 'Lấy thống kê services thành công', stats);
        } catch (error) {
            console.error('Lỗi khi lấy thống kê services:', error);
            return errorResponse(res, 'Lỗi server khi lấy thống kê', 500);
        }
    }
}

module.exports = new ServiceController();