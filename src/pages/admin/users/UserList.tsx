import { useState } from 'react';
import { Users, Search, Edit, Trash, Mail, Phone } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

export default function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock users data - replace with real data in production
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '243123456789',
      joinDate: '2023-01-15',
      purchases: 5,
      status: 'active'
    },
    // Add more mock users...
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="search"
            placeholder="Rechercher un utilisateur..."
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
                <th className="text-left p-4">Utilisateur</th>
                <th className="text-left p-4">Contact</th>
                <th className="text-left p-4">Date d'inscription</th>
                <th className="text-left p-4">Achats</th>
                <th className="text-left p-4">Statut</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{formatDate(user.joinDate)}</td>
                  <td className="p-4">{user.purchases}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="btn btn-ghost btn-sm mr-2">
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-ghost btn-sm text-destructive">
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}