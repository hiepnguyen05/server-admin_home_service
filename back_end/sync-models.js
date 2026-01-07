require('dotenv').config();
const { sequelize } = require('./src/config/database');
const initModels = require('./src/models/init-models');

async function syncModels() {
    try {
        console.log('🔄 Đang kết nối database...');

        // Kiểm tra kết nối
        await sequelize.authenticate();
        console.log('✅ Kết nối database thành công!');

        // Khởi tạo tất cả models
        console.log('🔄 Đang khởi tạo models...');
        const models = initModels(sequelize);
        console.log('✅ Đã khởi tạo', Object.keys(models).length, 'models');

        // Đồng bộ hóa database (tạo bảng)
        console.log('🔄 Đang tạo các bảng từ models...');
        await sequelize.sync({
            force: false, // Không xóa bảng cũ
            alter: true   // Cập nhật cấu trúc bảng nếu cần
        });
        console.log('✅ Đã tạo/cập nhật tất cả bảng thành công!');

        // Liệt kê các bảng đã tạo
        console.log('🔄 Đang kiểm tra các bảng đã tạo...');
        const [tables] = await sequelize.query('SHOW TABLES');
        console.log('📋 Danh sách bảng đã tạo:');
        tables.forEach((table, index) => {
            const tableName = table[`Tables_in_${process.env.DB_NAME}`];
            console.log(`   ${index + 1}. ${tableName}`);
        });

        console.log('\n🎉 Hoàn thành tạo cơ sở dữ liệu home_service!');

    } catch (error) {
        console.error('❌ Lỗi đồng bộ models:', error.message);
        console.error('Chi tiết lỗi:', error);
    } finally {
        await sequelize.close();
        console.log('🔚 Đã đóng kết nối database');
    }
}

if (require.main === module) {
    syncModels().catch(console.error);
}

module.exports = { syncModels };