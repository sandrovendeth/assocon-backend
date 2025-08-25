const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔍 Criando usuário administrador...');

    // Hash da senha
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Criar usuário admin
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@assocon.com.br',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Nome:', adminUser.name);
    console.log('🔑 Role:', adminUser.role);
    console.log('🔐 Senha: admin123');
    console.log('\n🎯 Agora você pode fazer login no frontend!');
    console.log('📝 Credenciais:');
    console.log('   Email: admin@assocon.com.br');
    console.log('   Senha: admin123');
  } catch (error) {
    console.log('❌ Erro ao criar usuário:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
