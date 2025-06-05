import { useState, useEffect } from "react";

export default function TattooChat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger les tatouages de l'utilisateur au démarrage
  useEffect(() => {
    loadUserTattoos();
  }, [user.id]);

  const loadUserTattoos = async () => {
    try {
      const res = await fetch(`/api/tattoos/user/${user.id}`);
      const data = await res.json();
      
      if (data.success) {
        // Convertir les tatouages en format de messages de chat
        const tattooMessages = data.tattoos.map(tattoo => ({
          id: tattoo.id,
          type: 'ai_response',
          prompt: tattoo.prompt,
          image: tattoo.image,
          timestamp: tattoo.created
        }));
        
        // Trier les messages par timestamp pour avoir les plus anciens en premier
        tattooMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        setMessages(tattooMessages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tatouages:', error);
    }
  };

  const generateTattoo = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    
    // Ajouter le message utilisateur au chat
    const userMessage = {
      id: Date.now(),
      type: 'user_message',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = newMessage;
    setNewMessage("");

    try {
      const res = await fetch("/api/text2img", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          userId: user.id
        })
      });

      const data = await res.json();
      
      if (data.output) {
        // Ajouter la réponse IA au chat
        const aiMessage = {
          id: data.saveId || Date.now() + 1,
          type: 'ai_response',
          prompt: currentPrompt,
          image: data.output,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        alert("Erreur: " + JSON.stringify(data.error || "inconnue"));
      }
    } catch (error) {
      alert("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateTattoo();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border border-gray-600">
              <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-medium text-white">{user.username}</h2>
              <p className="text-xs text-gray-400">Assistant Tatouage IA</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Commencez votre première création</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">Décrivez le tatouage que vous voulez et notre IA le créera pour vous</p>
            </div>
          ) : (
            messages.map((message) => 
              message.type === 'user_message' ? (
                <div key={message.id} className="flex justify-end mb-4">
                  <div className="bg-gray-800 text-white p-4 rounded-2xl max-w-xs lg:max-w-md border border-gray-700">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-start mb-6">
                  <div className="bg-gray-900 p-4 rounded-2xl max-w-sm lg:max-w-lg border border-gray-800">
                    <p className="text-gray-300 mb-3 text-xs italic border-l-2 border-gray-700 pl-3">"{message.prompt}"</p>
                    {message.image && (
                      <div className="rounded-xl overflow-hidden bg-white mb-3">
                        <img 
                          src={message.image} 
                          alt="Tatouage généré" 
                          className="w-full max-h-80 object-contain"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              )
            )
          )}
          
          {loading && (
            <div className="flex justify-start mb-6">
              <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-gray-400 text-sm ml-2">Génération en cours...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-4 bg-gray-900 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Décrivez votre tatouage..."
              className="flex-1 bg-black text-white p-4 rounded-2xl border border-gray-700 focus:border-gray-500 focus:outline-none transition-colors placeholder-gray-500 text-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={generateTattoo}
              disabled={loading || !newMessage.trim()}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-700 hover:border-gray-600 text-sm font-medium"
            >
              {loading ? '...' : 'Envoyer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}