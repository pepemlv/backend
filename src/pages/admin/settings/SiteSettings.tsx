import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'PMStreaming',
    siteDescription: 'Votre plateforme de streaming avec paiement mobile',
    contactEmail: 'contact@pmstreaming.com',
    supportPhone: '+243 123 456 789',
    currency: 'USD',
    language: 'fr',
    maintenanceMode: false,
    allowRegistration: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In production, this would make an API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres du Site</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Informations générales</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom du site
              </label>
              <input
                type="text"
                className="input w-full"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="input w-full h-24"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Contact</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email de contact
              </label>
              <input
                type="email"
                className="input w-full"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Téléphone support
              </label>
              <input
                type="tel"
                className="input w-full"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Préférences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Devise
              </label>
              <select
                className="input w-full"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="CDF">CDF (FC)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Langue
              </label>
              <select
                className="input w-full"
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Mode maintenance</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Autoriser les inscriptions</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            <Save size={18} className="mr-2" />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}