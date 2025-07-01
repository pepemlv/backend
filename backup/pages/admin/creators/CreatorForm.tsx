import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useCreatorsStore, Creator } from '../../../store/creatorsStore';
import toast from 'react-hot-toast';

type CreatorFormProps = {
  creator?: Creator;
  onClose: () => void;
};

export default function CreatorForm({ creator, onClose }: CreatorFormProps) {
  const { addCreator, updateCreator } = useCreatorsStore();
  const [formData, setFormData] = useState({
    name: creator?.name || '',
    bio: creator?.bio || '',
    image: creator?.image || '',
    socialLinks: {
      website: creator?.socialLinks.website || '',
      youtube: creator?.socialLinks.youtube || '',
      instagram: creator?.socialLinks.instagram || '',
      twitter: creator?.socialLinks.twitter || ''
    },
    storeUrl: creator?.storeUrl || ''
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setSelectedImage(file);
      // Create local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Handle file upload
      if (selectedImage) {
        const imageFileName = `${Date.now()}-${selectedImage.name}`;
        // Save image to assets/photos
        // This is a mock implementation - in a real app, you'd use proper file handling
        console.log(`Saving image: ${imageFileName}`);
      }

      if (creator) {
        await updateCreator(creator.id, formData);
        toast.success('Creator updated successfully');
      } else {
        await addCreator(formData);
        toast.success('Creator added successfully');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl">
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-xl font-semibold">
              {creator ? 'Edit Creator' : 'Add Creator'}
            </h2>
            <button onClick={onClose} className="btn btn-ghost btn-sm">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <textarea
                  className="input w-full h-24"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profileImageUpload"
                  />
                  <label
                    htmlFor="profileImageUpload"
                    className="btn btn-outline flex-1"
                  >
                    <Upload size={18} className="mr-2" />
                    {selectedImage ? selectedImage.name : 'Upload Image'}
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: Square ratio, PNG or JPG
                </p>
              </div>

              {formData.image && (
                <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Social Links</h3>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    className="input w-full"
                    value={formData.socialLinks.website}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        website: e.target.value
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    YouTube
                  </label>
                  <input
                    type="url"
                    className="input w-full"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        youtube: e.target.value
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Instagram
                  </label>
                  <input
                    type="url"
                    className="input w-full"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        instagram: e.target.value
                      }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    className="input w-full"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        twitter: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Printify Store URL
                </label>
                <input
                  type="url"
                  className="input w-full"
                  value={formData.storeUrl}
                  onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                  placeholder="https://printify.com/store/your-store"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your Printify store URL to sell merchandise
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {creator ? 'Update' : 'Add'} Creator
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}