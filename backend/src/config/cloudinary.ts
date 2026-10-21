import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
  api_key: ENV.CLOUDINARY.API_KEY,
  api_secret: ENV.CLOUDINARY.API_SECRET,
  secure: true,
});

const isMockCloudinary =
  !ENV.CLOUDINARY.API_KEY ||
  ENV.CLOUDINARY.API_KEY === 'mock_key' ||
  ENV.CLOUDINARY.CLOUD_NAME === 'mock_cloud';

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string = 'joyeria_con_alma/productos'
): Promise<{ url: string; publicId: string }> => {
  if (isMockCloudinary) {
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return {
      url: base64Image,
      publicId: `local_${Date.now()}`,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Error al subir imagen a Cloudinary'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicIdOrUrl: string): Promise<boolean> => {
  if (isMockCloudinary || publicIdOrUrl.startsWith('data:') || publicIdOrUrl.startsWith('local_')) {
    return true;
  }

  try {
    let publicId = publicIdOrUrl;
    // Extraer publicId si se pasa una URL completa
    if (publicIdOrUrl.startsWith('http')) {
      const parts = publicIdOrUrl.split('/');
      const filename = parts.pop() || '';
      const folder = parts.slice(parts.indexOf('upload') + 2).join('/');
      const cleanFilename = filename.substring(0, filename.lastIndexOf('.')) || filename;
      publicId = folder ? `${folder}/${cleanFilename}` : cleanFilename;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (err) {
    console.error(`[Cloudinary] Error destruyendo recurso ${publicIdOrUrl}:`, err);
    return false;
  }
};

export default cloudinary;
