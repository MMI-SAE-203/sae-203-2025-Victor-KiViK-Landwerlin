import { useState } from "react";

export default function AuthComponent({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await res.json();
        if (data.success) {
          onAuthSuccess(data.user);
        } else {
          alert('Erreur de connexion: ' + data.error);
        }
      } else {
        // Inscription
        if (formData.password !== formData.confirmPassword) {
          alert('Les mots de passe ne correspondent pas');
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            username: formData.username
          })
        });

        const data = await res.json();
        if (data.success) {
          onAuthSuccess(data.user);
        } else {
          alert('Erreur d\'inscription: ' + data.error);
        }
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
            <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            {isLogin ? 'Connectez-vous' : 'Créer un compte'}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {isLogin 
              ? 'Accédez à vos tatouages personnalisés' 
              : 'Rejoignez la communauté des tatouages IA'
            }
          </p>
        </div>

        {/* Formulaire */}
        <div className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-white focus:outline-none transition-colors placeholder-gray-500"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-white focus:outline-none transition-colors placeholder-gray-500"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-white focus:outline-none transition-colors placeholder-gray-500"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-white focus:outline-none transition-colors placeholder-gray-500"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6 border border-gray-700 hover:border-gray-600"
          >
            {loading 
              ? (isLogin ? 'Connexion...' : 'Inscription...') 
              : (isLogin ? 'Connexion' : 'Créer un compte')
            }
          </button>
        </div>

        {/* Toggle entre connexion/inscription */}
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-white transition-colors text-sm underline underline-offset-4"
          >
            {isLogin 
              ? "création de compte" 
              : "Déjà un compte ? Se connecter"
            }
          </button>
        </div>
      </div>
    </div>
  );
}