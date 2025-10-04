// lib/removeBackground.ts
import axios from "axios";

/**
 * Elimina el fondo de una imagen usando la API de remove.bg
 * @param imageFile Archivo de imagen a procesar
 * @returns Blob de la imagen procesada con fondo removido
 */
export const removeBackground = async (imageFile: File): Promise<Blob | null> => {
  const apiKey = process.env.KEY_REMOVE
  const formData = new FormData();
  formData.append("image_file", imageFile);
  formData.append("size", "auto"); // tamaño automático

  try {
    const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
      headers: {
        "X-Api-Key": apiKey,
      },
      responseType: "blob", // para recibir la imagen como Blob
    });

    return response.data;
  } catch (error) {
    console.error("Error al eliminar el fondo:", error);
    return null;
  }
};
