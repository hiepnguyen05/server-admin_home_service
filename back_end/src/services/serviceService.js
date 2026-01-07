const serviceRepository = require('../repositories/serviceRepository');

class ServiceService {
    // === PUBLIC METHODS ===

    async getActiveCategories() {
        return await serviceRepository.getActiveCategories();
    }

    async getActiveServices(filters) {
        return await serviceRepository.getActiveServices(filters);
    }

    async getServiceById(serviceId) {
        return await serviceRepository.getServiceById(serviceId);
    }

    async getServicesByCategory(categoryId, pagination) {
        return await serviceRepository.getServicesByCategory(categoryId, pagination);
    }

    // === ADMIN METHODS ===

    // Category methods
    async getAllCategories(filters) {
        return await serviceRepository.getAllCategories(filters);
    }

    async createCategory(categoryData) {
        // Kiểm tra tên category đã tồn tại
        const existingCategory = await serviceRepository.getCategoryByName(categoryData.name);
        if (existingCategory) {
            throw new Error('Tên category đã tồn tại');
        }

        return await serviceRepository.createCategory(categoryData);
    }

    async updateCategory(categoryId, updateData) {
        // Kiểm tra category tồn tại
        const category = await serviceRepository.getCategoryById(categoryId);
        if (!category) {
            return null;
        }

        // Kiểm tra tên category đã tồn tại (nếu có thay đổi tên)
        if (updateData.name && updateData.name !== category.name) {
            const existingCategory = await serviceRepository.getCategoryByName(updateData.name);
            if (existingCategory) {
                throw new Error('Tên category đã tồn tại');
            }
        }

        return await serviceRepository.updateCategory(categoryId, updateData);
    }

    async deleteCategory(categoryId) {
        // Kiểm tra category tồn tại
        const category = await serviceRepository.getCategoryById(categoryId);
        if (!category) {
            return null;
        }

        // Kiểm tra category có services không
        const servicesCount = await serviceRepository.getServicesCountByCategory(categoryId);
        if (servicesCount > 0) {
            throw new Error('Không thể xóa category vì còn có services thuộc category này');
        }

        return await serviceRepository.deleteCategory(categoryId);
    }

    // Service methods
    async getAllServices(filters) {
        return await serviceRepository.getAllServices(filters);
    }

    async createService(serviceData) {
        // Kiểm tra category tồn tại
        const category = await serviceRepository.getCategoryById(serviceData.category_id);
        if (!category) {
            throw new Error('Category không tồn tại');
        }

        // Kiểm tra tên service đã tồn tại trong category
        const existingService = await serviceRepository.getServiceByNameAndCategory(
            serviceData.name,
            serviceData.category_id
        );
        if (existingService) {
            throw new Error('Tên service đã tồn tại trong category này');
        }

        return await serviceRepository.createService(serviceData);
    }

    async updateService(serviceId, updateData) {
        // Kiểm tra service tồn tại
        const service = await serviceRepository.getServiceById(serviceId);
        if (!service) {
            return null;
        }

        // Kiểm tra category tồn tại (nếu có thay đổi category)
        if (updateData.category_id && updateData.category_id !== service.category_id) {
            const category = await serviceRepository.getCategoryById(updateData.category_id);
            if (!category) {
                throw new Error('Category không tồn tại');
            }
        }

        // Kiểm tra tên service đã tồn tại trong category (nếu có thay đổi tên hoặc category)
        if (updateData.name || updateData.category_id) {
            const checkName = updateData.name || service.name;
            const checkCategoryId = updateData.category_id || service.category_id;

            if (checkName !== service.name || checkCategoryId !== service.category_id) {
                const existingService = await serviceRepository.getServiceByNameAndCategory(
                    checkName,
                    checkCategoryId
                );
                if (existingService && existingService.id !== service.id) {
                    throw new Error('Tên service đã tồn tại trong category này');
                }
            }
        }

        return await serviceRepository.updateService(serviceId, updateData);
    }

    async deleteService(serviceId) {
        // Kiểm tra service tồn tại
        const service = await serviceRepository.getServiceById(serviceId);
        if (!service) {
            return null;
        }

        // Kiểm tra service có bookings không
        const bookingsCount = await serviceRepository.getBookingsCountByService(serviceId);
        if (bookingsCount > 0) {
            throw new Error('Không thể xóa service vì còn có bookings sử dụng service này');
        }

        return await serviceRepository.deleteService(serviceId);
    }

    async getServiceStats() {
        return await serviceRepository.getServiceStats();
    }
}

module.exports = new ServiceService();