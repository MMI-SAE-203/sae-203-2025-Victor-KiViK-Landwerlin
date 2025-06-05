import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.victor-landwerlin.fr');

export async function POST({ request }) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Email, mot de passe et nom d'utilisateur requis" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Créer le nouvel utilisateur
    const userData = {
      email: email,
      password: password,
      passwordConfirm: password,
      username: username,
      emailVisibility: true
    };

    console.log('Tentative de création utilisateur:', userData);

    const record = await pb.collection('users').create(userData);
    
    // Connecter automatiquement après inscription
    const authData = await pb.collection('users').authWithPassword(email, password);
    
    console.log('Inscription et connexion réussies:', authData.record);

    return new Response(JSON.stringify({ 
      success: true, 
      user: {
        id: authData.record.id,
        email: authData.record.email,
        username: authData.record.username,
        avatar: authData.record.avatar
      },
      token: authData.token
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    
    let errorMessage = "Erreur lors de l'inscription";
    
    if (error.data?.data) {
      // Erreurs de validation PocketBase
      const errors = error.data.data;
      if (errors.email) {
        errorMessage = "Email déjà utilisé ou invalide";
      } else if (errors.username) {
        errorMessage = "Nom d'utilisateur déjà pris";
      } else if (errors.password) {
        errorMessage = "Mot de passe trop faible (min 8 caractères)";
      }
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}