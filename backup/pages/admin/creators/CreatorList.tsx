import { useState } from 'react';
import { Plus, Search, Edit, Trash, Link as LinkIcon } from 'lucide-react';
import { useCreatorsStore } from '../../../store/creatorsStore';
import { formatDate } from '../../../lib/utils';
import CreatorForm from './CreatorForm';
import LinkMoviesForm from './LinkMoviesForm';

export default function CreatorList() {
  const { creators, deleteCreator } = useCreatorsStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLinkMoviesOpen, setIsLinkMoviesOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCreators = creators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (creator) => {
    setEditingCreator(creator);
    setIsFormOpen(true);
  };

  const handleDelete = async (creatorId: string) => {
    if (window.confirm('Are you sure you want to delete this creator?')) {
      await deleteCreator(creatorId);
    }
  };

  const handleLinkMovies = (creator) => {
    setSelectedCreator(creator);
    setIsLinkMoviesOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Creator Management</h1>
        <button
          onClick={() => {
            setEditingCreator(null);
            setIsFormOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-2" />
          Add Creator
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="search"
            placeholder="Search creators..."
            className="input pl-10 w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4">Creator</th>
                <th className="text-left p-4">Social Links</th>
                <th className="text-left p-4">Join Date</th>
                <th className="text-left p-4">Movies</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCreators.map((creator) => (
                <tr key={creator.id} className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={creator.image}
                          alt={creator.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{creator.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {creator.bio}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {creator.socialLinks.youtube && (
                        <a
                          href={creator.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          YouTube
                        </a>
                      )}
                      {creator.socialLinks.instagram && (
                        <a
                          href={creator.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{formatDate(creator.joinDate)}</td>
                  <td className="p-4">{creator.movieIds.length} movies</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleLinkMovies(creator)}
                      className="btn btn-ghost btn-sm mr-2"
                      title="Link Movies"
                    >
                      <LinkIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(creator)}
                      className="btn btn-ghost btn-sm mr-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(creator.id)}
                      className="btn btn-ghost btn-sm text-destructive"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <CreatorForm
          creator={editingCreator}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCreator(null);
          }}
        />
      )}

      {isLinkMoviesOpen && selectedCreator && (
        <LinkMoviesForm
          creator={selectedCreator}
          onClose={() => {
            setIsLinkMoviesOpen(false);
            setSelectedCreator(null);
          }}
        />
      )}
    </div>
  );
}