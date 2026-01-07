require('dotenv').config();
const { sequelize } = require('./src/config/database');
const initModels = require('./src/models/init-models');
const bcrypt = require('bcryptjs');

async function seedData() {
    try {
        console.log('🔄 Đang kết nối database...');
        await sequelize.authenticate();
        console.log('✅ Kết nối database thành công!');

        // Khởi tạo models
        const models = initModels(sequelize);

        console.log('🔄 Đang thêm dữ liệu mẫu...');

        // 1. Tạo categories
        console.log('📝 Tạo categories...');
        const categories = await models.categories.bulkCreate([
            {
                name: 'Dọn dẹp nhà cửa',
                icon_url: '/icons/cleaning.png',
                is_active: true,
                sort_order: 1
            },
            {
                name: 'Sửa chữa điện nước',
                icon_url: '/icons/repair.png',
                is_active: true,
                sort_order: 2
            },
            {
                name: 'Chăm sóc sân vườn',
                icon_url: '/icons/garden.png',
                is_active: true,
                sort_order: 3
            },
            {
                name: 'Vận chuyển đồ đạc',
                icon_url: '/icons/moving.png',
                is_active: true,
                sort_order: 4
            },
            {
                name: 'Chăm sóc thú cưng',
                icon_url: '/icons/pet.png',
                is_active: true,
                sort_order: 5
            }
        ], { ignoreDuplicates: true });

        // 2. Tạo services
        console.log('📝 Tạo services...');
        const services = await models.services.bulkCreate([
            {
                category_id: categories[0].id,
                name: 'Dọn dẹp nhà cửa tổng quát',
                description: 'Dọn dẹp toàn bộ nhà cửa, lau chùi, hút bụi',
                price_type: 'hourly',
                default_price: 50000,
                duration_minutes: 120,
                commission_rate: 15.00,
                is_active: true
            },
            {
                category_id: categories[0].id,
                name: 'Giặt ủi quần áo',
                description: 'Giặt ủi quần áo, chăn màn, ga gối',
                price_type: 'fixed',
                default_price: 30000,
                duration_minutes: 60,
                commission_rate: 10.00,
                is_active: true
            },
            {
                category_id: categories[1].id,
                name: 'Sửa chữa điện',
                description: 'Sửa chữa hệ thống điện, thay bóng đèn, ổ cắm',
                price_type: 'quote',
                default_price: 100000,
                duration_minutes: 90,
                commission_rate: 20.00,
                is_active: true
            },
            {
                category_id: categories[1].id,
                name: 'Sửa chữa nước',
                description: 'Sửa chữa đường ống nước, vòi nước, bồn cầu',
                price_type: 'quote',
                default_price: 150000,
                duration_minutes: 120,
                commission_rate: 20.00,
                is_active: true
            },
            {
                category_id: categories[2].id,
                name: 'Cắt tỉa cây cảnh',
                description: 'Cắt tỉa, chăm sóc cây cảnh trong vườn',
                price_type: 'hourly',
                default_price: 40000,
                duration_minutes: 90,
                commission_rate: 12.00,
                is_active: true
            }
        ], { ignoreDuplicates: true });

        // 3. Tạo admin user
        console.log('📝 Tạo admin user...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = await models.users.create({
            code: 'ADMIN001',
            full_name: 'Quản trị viên',
            phone: '0901234567',
            email: 'admin@homeservice.com',
            password_hash: adminPassword,
            role: 'admin',
            status: 'active'
        });

        // 4. Tạo sample customers
        console.log('📝 Tạo sample customers...');
        const customerPassword = await bcrypt.hash('123456', 10);
        const customers = await models.users.bulkCreate([
            {
                code: 'CUST001',
                full_name: 'Nguyễn Văn A',
                phone: '0901234568',
                email: 'customer1@example.com',
                password_hash: customerPassword,
                role: 'customer',
                status: 'active'
            },
            {
                code: 'CUST002',
                full_name: 'Trần Thị B',
                phone: '0901234569',
                email: 'customer2@example.com',
                password_hash: customerPassword,
                role: 'customer',
                status: 'active'
            }
        ], { ignoreDuplicates: true });

        // 5. Tạo sample workers
        console.log('📝 Tạo sample workers...');
        const workerPassword = await bcrypt.hash('123456', 10);
        const workers = await models.users.bulkCreate([
            {
                code: 'WORK001',
                full_name: 'Lê Văn C',
                phone: '0901234570',
                email: 'worker1@example.com',
                password_hash: workerPassword,
                role: 'worker',
                status: 'active'
            },
            {
                code: 'WORK002',
                full_name: 'Phạm Thị D',
                phone: '0901234571',
                email: 'worker2@example.com',
                password_hash: workerPassword,
                role: 'worker',
                status: 'active'
            }
        ], { ignoreDuplicates: true });

        // 6. Tạo user addresses
        console.log('📝 Tạo user addresses...');
        await models.user_addresses.bulkCreate([
            {
                user_id: customers[0].id,
                name: 'Nhà riêng',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                latitude: 10.762622,
                longitude: 106.660172,
                is_default: true
            },
            {
                user_id: customers[1].id,
                name: 'Văn phòng',
                address: '456 Đường XYZ, Quận 3, TP.HCM',
                latitude: 10.768431,
                longitude: 106.681602,
                is_default: true
            }
        ], { ignoreDuplicates: true });

        // 7. Tạo wallets cho users
        console.log('📝 Tạo wallets...');
        const allUsers = [adminUser, ...customers, ...workers];
        for (const user of allUsers) {
            await models.wallets.create({
                user_id: user.id,
                balance: user.role === 'customer' ? 500000 : 0,
                hold_balance: 0,
                currency: 'VND'
            });
        }

        // 8. Tạo worker profiles
        console.log('📝 Tạo worker profiles...');
        for (const worker of workers) {
            await models.worker_profiles.create({
                user_id: worker.id,
                citizen_id: `0${Math.floor(Math.random() * 1000000000)}`,
                bio: 'Tôi có nhiều năm kinh nghiệm trong lĩnh vực dịch vụ gia đình',
                experience_years: 3,
                radius_km: 15,
                is_verified: true,
                is_online: true,
                rating_avg: 4.50,
                total_jobs: 50,
                total_reviews: 30
            });
        }

        // 9. Tạo worker services
        console.log('📝 Tạo worker services...');
        await models.worker_services.bulkCreate([
            { worker_id: workers[0].id, service_id: services[0].id },
            { worker_id: workers[0].id, service_id: services[1].id },
            { worker_id: workers[1].id, service_id: services[2].id },
            { worker_id: workers[1].id, service_id: services[3].id }
        ], { ignoreDuplicates: true });

        // 10. Tạo system settings
        console.log('📝 Tạo system settings...');
        await models.system_settings.bulkCreate([
            {
                key: 'platform_fee_rate',
                value: '5.0',
                description: 'Tỷ lệ phí nền tảng (%)'
            },
            {
                key: 'min_booking_amount',
                value: '50000',
                description: 'Số tiền đặt dịch vụ tối thiểu (VND)'
            },
            {
                key: 'max_booking_amount',
                value: '5000000',
                description: 'Số tiền đặt dịch vụ tối đa (VND)'
            }
        ], { ignoreDuplicates: true });

        console.log('✅ Đã thêm dữ liệu mẫu thành công!');
        console.log('\n📊 Tóm tắt dữ liệu đã tạo:');
        console.log(`   - ${categories.length} categories`);
        console.log(`   - ${services.length} services`);
        console.log(`   - 1 admin user`);
        console.log(`   - ${customers.length} customers`);
        console.log(`   - ${workers.length} workers`);
        console.log(`   - ${allUsers.length} wallets`);
        console.log(`   - 2 user addresses`);
        console.log(`   - ${workers.length} worker profiles`);
        console.log(`   - 4 worker services`);
        console.log(`   - 3 system settings`);

        console.log('\n🔑 Thông tin đăng nhập:');
        console.log('   Admin: admin@homeservice.com / admin123');
        console.log('   Customer 1: customer1@example.com / 123456');
        console.log('   Customer 2: customer2@example.com / 123456');
        console.log('   Worker 1: worker1@example.com / 123456');
        console.log('   Worker 2: worker2@example.com / 123456');

    } catch (error) {
        console.error('❌ Lỗi thêm dữ liệu mẫu:', error.message);
        console.error('Chi tiết lỗi:', error);
    } finally {
        await sequelize.close();
        console.log('🔚 Đã đóng kết nối database');
    }
}

if (require.main === module) {
    seedData().catch(console.error);
}

module.exports = { seedData };