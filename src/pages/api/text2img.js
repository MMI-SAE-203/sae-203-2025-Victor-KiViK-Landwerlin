import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.victor-landwerlin.fr');

// Traduction gratuite sans clé API (limité à 1000 mots/jour par IP)
async function translateToEnglish(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=fr|en`
    );
    
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error('Erreur de traduction');
    }
  } catch (error) {
    console.error('Erreur de traduction:', error);
    return text;
  }
}

async function saveToDatabase(prompt, imageBuffer, userId) {
  try {
    // Créer un FormData pour uploader l'image comme fichier
    const formData = new FormData();
    
    // Convertir le buffer en Blob
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    
    // Ajouter les données avec l'ID utilisateur
    formData.append('prompt', prompt.substring(0, 1000));
    formData.append('image', imageBlob, 'tattoo.png'); // Upload comme fichier
    formData.append('created_at', new Date().toISOString());
    formData.append('status', 'generated');
    formData.append('utilisateur', userId); // Relation avec l'utilisateur

    console.log('Tentative de sauvegarde avec upload de fichier pour user:', userId);
    
    const record = await pb.collection('tatouage_ia').create(formData);
    console.log("Prompt enregistré avec succès:", record);
    return record;
  } catch (error) {
    console.error("Erreur détaillée lors de l'enregistrement:", error);
    
    // Fallback : sauvegarder sans image
    try {
      const recordDataWithoutImage = {
        prompt: prompt.substring(0, 1000),
        created_at: new Date().toISOString(),
        status: 'generated_no_image',
        utilisateur: userId
      };
      
      const record = await pb.collection('tatouage_ia').create(recordDataWithoutImage);
      console.log("Prompt enregistré sans image:", record);
      return record;
    } catch (secondError) {
      console.error("Erreur même sans image:", secondError);
      return null;
    }
  }
}

export async function POST({ request }) {
  try {
    const { prompt, userId } = await request.json();

    if (!prompt || prompt.trim() === '') {
      return new Response(JSON.stringify({ error: "Prompt vide" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Traduire le prompt
    const englishPrompt = await translateToEnglish(prompt);
    console.log(`Prompt traduit: ${prompt} → ${englishPrompt}`);
    
    const formData = new FormData();
    formData.append('prompt', `tattoo design, black ink, line art, on white background: ${englishPrompt}`);
    formData.append('model', 'sd3-medium');
    formData.append('output_format', 'png');

    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
      method: "POST",
      headers: {
        Authorization: `Bearer sk-tFiCv7tokhd5Xc0qA3scApd98fwSsH0EtLNTRy57DqL7CcpD`,
        Accept: "image/*"
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    // Sauvegarder avec le buffer original (plus efficace)
    console.log('Taille du buffer image:', imageBuffer.byteLength);
    const saveResult = await saveToDatabase(prompt, imageBuffer, userId);

    return new Response(JSON.stringify({ 
      output: dataUrl,
      saved: saveResult !== null,
      saveId: saveResult?.id || null
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Erreur dans l\'API:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}