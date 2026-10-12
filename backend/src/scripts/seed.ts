import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { CarouselSlide } from '../models/CarouselSlide.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Iniciando población de datos iniciales...');

    // 1. Crear usuario Admin por defecto si no existe
    const adminUser = process.env.ADMIN_DEFAULT_USER || 'admin';
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'admin12345';
    const existingAdmin = await User.findOne({ username: adminUser });
    if (!existingAdmin) {
      const admin = new User({
        username: adminUser,
        passwordHash: adminPass,
        rol: 'ADMIN',
      });
      await admin.save();
      console.log(`✅ Usuario Administrador inicial "${adminUser}" configurado exitosamente.`);
    } else {
      console.log(`ℹ️  El usuario administrador "${adminUser}" ya existe.`);
    }

    // 2. Crear Slides iniciales
    await CarouselSlide.deleteMany({});
    await CarouselSlide.create([
        {
          titulo: 'Tradición que brilla',
          subtitulo: 'Colección Exclusiva de Filigrana Yucateca',
          imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop',
          targetUrl: '/catalogo?hashtag=Filigrana',
          orden: 1,
          isActive: true,
        },
        {
          titulo: 'Especial Novias',
          subtitulo: 'Encuentra el tocado perfecto para tu gran día',
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
          targetUrl: '/catalogo?hashtag=Boda',
          orden: 2,
          isActive: true,
        },
      ]);
      console.log('✅ Slides del carrusel iniciales creados.');

    // 3. Crear Productos iniciales
    await Product.deleteMany({});
    await Product.create([
        {
          nombre: 'Rosario de Filigrana Tradicional',
          descripcion: 'Hermoso rosario elaborado a mano por artesanos yucatecos. Detalles finos en filigrana que resaltan la elegancia de la tradición.',
          precioBase: 2500.0,
          imagenes: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop'],
          detalles: [
            { clave: 'Material', valor: 'Plata 925 bañada en Oro' },
            { clave: 'Largo', valor: '45 cm' },
          ],
          hashtags: ['#Filigrana', '#Boda', '#Tradición', '#Rosario'],
          estado: 'EN_STOCK',
        },
        {
          nombre: 'Tocado Floral para Novia',
          descripcion: 'Tocado espectacular diseñado para resaltar en tu día más importante. Creado con incrustaciones brillantes y diseño floral ajustable.',
          precioBase: 1200.0,
          imagenes: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'],
          detalles: [
            { clave: 'Flores', valor: 'Cristal Austriaco' },
            { clave: 'Fijación', valor: 'Peineta metálica' },
          ],
          hashtags: ['#Boda', '#Tocado', '#Novia', '#Cristal'],
          estado: 'BAJO_ENCARGO',
        },
        {
          nombre: 'Aretes de Filigrana Lágrima',
          descripcion: 'Aretes ligeros pero con gran presencia. El diseño en forma de lágrima es un clásico que nunca pasa de moda.',
          precioBase: 850.0,
          imagenes: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'],
          detalles: [
            { clave: 'Material', valor: 'Oro 14k' },
            { clave: 'Cierre', valor: 'Mariposa' },
          ],
          hashtags: ['#Filigrana', '#Aretes', '#Oro'],
          estado: 'EN_STOCK',
        },
        {
          nombre: 'Pulsera Regional Henequén',
          descripcion: 'Diseño inspirado en el oro verde de Yucatán. Entrelazado perfecto que aporta textura y brillo.',
          precioBase: 950.0,
          imagenes: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'],
          detalles: [
            { clave: 'Material', valor: 'Plata 925' },
            { clave: 'Talla', valor: 'Ajustable' },
          ],
          hashtags: ['#Pulsera', '#Plata', '#Tradición'],
          estado: 'EN_STOCK',
        },
        {
          nombre: 'Gargantilla Mestiza',
          descripcion: 'Pieza central que no puede faltar en una ocasión especial. Destaca por su dije central de gran tamaño.',
          precioBase: 3100.0,
          imagenes: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'],
          detalles: [
            { clave: 'Material', valor: 'Oro 18k' },
            { clave: 'Estilo', valor: 'Gargantilla' },
          ],
          hashtags: ['#Oro', '#Gargantilla', '#Elegancia'],
          estado: 'AGOTADO',
        },
      ]);
      console.log('✅ Productos iniciales creados.');

    console.log('[Seed] Proceso completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error poblando la base de datos:', error);
    process.exit(1);
  }
};

seedData();
