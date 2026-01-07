require('dotenv').config();
const { createDatabase } = require('./create-database');
const { syncModels } = require('./sync-models');
const { seedData } = require('./seed-data');

async function setupDatabase() {
    console.log('🚀 Bắt đầu thiết lập cơ sở dữ liệu home_service trên TiDB Cloud...\n');

    try {
        // Bước 1: Tạo database
        console.log('=== BƯỚC 1: TẠO DATABASE ===');
        await createDatabase();
        console.log('');

        // Bước 2: Tạo các bảng từ models
        console.log('=== BƯỚC 2: TẠO CÁC BẢNG ===');
        await syncModels();
        console.log('');

        // Bước 3: Thêm dữ liệu mẫu
        console.log('=== BƯỚC 3: THÊM DỮ LIỆU MẪU ===');
        await seedData();
        console.log('');

        console.log('🎉 HOÀN THÀNH THIẾT LẬP DATABASE!');
        console.log('');
        console.log('📋 Tóm tắt:');
        console.log('   ✅ Database home_service đã được tạo trên TiDB Cloud');
        console.log('   ✅ 16 bảng đã được tạo từ Sequelize models');
        console.log('   ✅ Dữ liệu mẫu đã được thêm vào');
        console.log('');
        console.log('🔗 Thông tin kết nối:');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   Database: ${process.env.DB_NAME}`);
        console.log(`   Port: ${process.env.DB_PORT}`);
        console.log('');
        console.log('🔑 Tài khoản test:');
        console.log('   Admin: admin@homeservice.com / admin123');
        console.log('   Customer: customer1@example.com / 123456');
        console.log('   Worker: worker1@example.com / 123456');
        console.log('');
        console.log('▶️  Bây giờ bạn có thể chạy server: npm run dev');

    } catch (error) {
        console.error('❌ Lỗi thiết lập database:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };