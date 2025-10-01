import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import FormData from "form-data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "Falta la imagen" });
  }

  try {
    const formData = new FormData();
    formData.append("image_file_b64", imageBase64.replace(/^data:image\/\w+;base64,/, ""));
    formData.append("size", "auto");
    formData.append("bg_color", "ffffff"); // Fondo blanco

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": process.env.REMOVEBG_API_KEY!,
      },
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "binary");
    const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;

    res.status(200).json({ image: base64Image });
  } catch (error: any) {
    console.error("Error eliminando fondo:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al procesar la imagen" });
  }
}
