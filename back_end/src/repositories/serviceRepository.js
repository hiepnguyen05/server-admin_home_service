const { Op } = require('sequelize');
const { categories, services, bookings } = require('../models/init-models')(require('../config/database').sequelize);

class ServiceRepository {
    // === CATEGORY METHODS ===

    async getActiveCategories() {
        return await categories.findAll({
            where: { is_active: true },
            order: [['sort_order', 'ASC'], ['name', 'ASC']],
            attributes: ['id', 'name', 'icon_url', 'sort_order']
        });
    }

    async getAllCategories(filters = {}) {
        const { page = 1, limit = 10, search, status } = filters;
        const offset = (page - 1) * limit;

        const whereClause = {};

        if (search) {
            whereClause.name = {
                [Op.like]: `%${search}%`
            };
        }

        if (status !== undefined) {
            whereClause.is_active = status === 'active';
        }

        const { count, rows } = await categories.findAndCountAll({
            where: whereClause,
            order: [['sort_order', 'ASC'], ['name', 'ASC']],
            limit,
            offset,
            attributes: ['id', 'name', 'icon_url', 'is_active', 'sort_order', 'createdAt', 'updatedAt']
        });

        return {
            categories: rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        };
    }

    async getCategoryById(categoryId) {
        return await categories.findByPk(categoryId);
    }

    async getCategoryByName(name) {
        return await categories.findOne({
            where: { name }
        });
    }

    async createCategory(categoryData) {
        return await categories.create(categoryData);
    }

    async updateCategory(categoryId, updateData) {
        const [updatedRowsCount] = await categories.update(updateData, {
            where: { id: categoryId }
        });

        if (updatedRowsCount === 0) {
            return null;
        }

        return await this.getCategoryById(categoryId);
    }

    async deleteCategory(categoryId) {
        const deletedRowsCount = await categories.destroy({
            where: { id: categoryId }
        });

        return deletedRowsCount > 0;
    }

    async getServicesCountByCategory(categoryId) {
        return await services.count({
            where: { category_id: categoryId }
        });
    }

    // === SERVICE METHODS ===

    async getActiveServices(filters = {}) {
        const { page = 1, limit = 10, category_id, search } = filters;
        const offset = (page - 1) * limit;

        const whereClause = { is_active: true };

        if (category_id) {
            whereClause.category_id = category_id;
        }

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await services.findAndCountAll({
            where: whereClause,
            include: [{
                model: categories,
                as: 'category',
                attributes: ['id', 'name', 'icon_url']
            }],
            order: [['name', 'ASC']],
            limit,
            offset,
            attributes: [
                'id', 'name', 'description', 'price_type', 'default_price',
                'duration_minutes', 'category_id'
            ]
        });

        return {
            services: rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        };
    }

    async getAllServices(filters = {}) {
        const { page = 1, limit = 10, search, category_id, status } = filters;
        const offset = (page - 1) * limit;

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        if (category_id) {
            whereClause.category_id = category_id;
        }

        if (status !== undefined) {
            whereClause.is_active = status === 'active';
        }

        const { count, rows } = await services.findAndCountAll({
            where: whereClause,
            include: [{
                model: categories,
                as: 'category',
                attributes: ['id', 'name', 'icon_url']
            }],
            order: [['name', 'ASC']],
            limit,
            offset
        });

        return {
            services: rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        };
    }

    async getServiceById(serviceId) {
        return await services.findByPk(serviceId, {
            include: [{
                model: categories,
                as: 'category',
                attributes: ['id', 'name', 'icon_url']
            }]
        });
    }

    async getServicesByCategory(categoryId, pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        const { count, rows } = await services.findAndCountAll({
            where: {
                category_id: categoryId,
                is_active: true
            },
            include: [{
                model: categories,
                as: 'category',
                attributes: ['id', 'name', 'icon_url']
            }],
            order: [['name', 'ASC']],
            limit,
            offset,
            attributes: [
                'id', 'name', 'description', 'price_type', 'default_price',
                'duration_minutes', 'category_id'
            ]
        });

        return {
            services: rows,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        };
    }

    async getServiceByNameAndCategory(name, categoryId) {
        return await services.findOne({
            where: {
                name,
                category_id: categoryId
            }
        });
    }

    async createService(serviceData) {
        return await services.create(serviceData);
    }

    async updateService(serviceId, updateData) {
        const [updatedRowsCount] = await services.update(updateData, {
            where: { id: serviceId }
        });

        if (updatedRowsCount === 0) {
            return null;
        }

        return await this.getServiceById(serviceId);
    }

    async deleteService(serviceId) {
        const deletedRowsCount = await services.destroy({
            where: { id: serviceId }
        });

        return deletedRowsCount > 0;
    }

    async getBookingsCountByService(serviceId) {
        return await bookings.count({
            where: { service_id: serviceId }
        });
    }

    async getServiceStats() {
        const totalServices = await services.count();
        const activeServices = await services.count({ where: { is_active: true } });
        const inactiveServices = totalServices - activeServices;

        const totalCategories = await categories.count();
        const activeCategories = await categories.count({ where: { is_active: true } });

        // Thống kê theo price_type
        const priceTypeStats = await services.findAll({
            attributes: [
                'price_type',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            group: ['price_type'],
            raw: true
        });

        // Top categories có nhiều services nhất
        const topCategories = await categories.findAll({
            attributes: [
                'id', 'name',
                [require('sequelize').fn('COUNT', require('sequelize').col('services.id')), 'services_count']
            ],
            include: [{
                model: services,
                as: 'services',
                attributes: []
            }],
            group: ['categories.id'],
            order: [[require('sequelize').fn('COUNT', require('sequelize').col('services.id')), 'DESC']],
            limit: 5,
            raw: true
        });

        return {
            services: {
                total: totalServices,
                active: activeServices,
                inactive: inactiveServices
            },
            categories: {
                total: totalCategories,
                active: activeCategories,
                inactive: totalCategories - activeCategories
            },
            priceTypeDistribution: priceTypeStats,
            topCategories
        };
    }
}

module.exports = new ServiceRepository();