import { useState } from "react";

export default function Text2ImgClient() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const generate = async () => {
    setLoading(true);
    setSaveStatus(null);
    
    try {
      const res = await fetch("/api/text2img", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      const data = await res.json();
      if (data.output) {
        setResult(data.output);
        
        // Afficher le statut de sauvegarde
        if (data.saved) {
          setSaveStatus({ success: true, id: data.saveId });
        } else {
          setSaveStatus({ success: false });
        }
      } else {
        alert("Erreur: " + JSON.stringify(data.error || "inconnue"));
      }
    } catch (error) {
      alert("Erreur: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto text-center">
      <input
        type="text"
        placeholder="Décris le tatouage"
        className="border p-2 rounded"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />
      <button 
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50" 
        onClick={generate}
        disabled={loading}
      >
        {loading ? "Génération..." : "Générer le tatouage"}
      </button>
      
      {saveStatus && (
        <div className={`text-sm p-2 rounded ${
          saveStatus.success 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {saveStatus.success 
            ? `✅ Sauvegardé avec succès ${saveStatus.id ? `(ID: ${saveStatus.id})` : ''}` 
            : '⚠️ Sauvegardé sans image (problème de taille)'}
        </div>
      )}
      
      {result && (
        <img src={result} alt="Résultat IA" className="max-h-96 mx-auto mt-4" />
      )}
    </div>
  );
}