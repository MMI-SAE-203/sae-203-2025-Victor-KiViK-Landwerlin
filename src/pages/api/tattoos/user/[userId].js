import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.victor-landwerlin.fr');

export async function GET({ params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "ID utilisateur requis" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Récupérer tous les tatouages de cet utilisateur
    const records = await pb.collection('tatouage_ia').getList(1, 50, {
      filter: `utilisateur = "${userId}"`,
      sort: '-created',
    });

    console.log(`Tatouages trouvés pour user ${userId}:`, records.items.length);

    // Formater les données pour le chat
    const tattoos = records.items.map(record => ({
      id: record.id,
      prompt: record.prompt,
      image: record.image ? pb.files.getUrl(record, record.image) : null,
      status: record.status,
      created: record.created,
      updated: record.updated
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      tattoos: tattoos,
      total: records.totalItems
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des tatouages:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}