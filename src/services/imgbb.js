export async function uploadImageToImgBB(file) {
  const apiKey = "9a954a242a0187ec598968a9661d15c4";
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Falha ao carregar imagem para o servidor.");
    }

    const data = await response.json();
    return data.data.url; // Retorna o link direto da imagem
  } catch (error) {
    console.error("Erro no upload do ImgBB:", error);
    throw error;
  }
}