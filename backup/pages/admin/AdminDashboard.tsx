import { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import { Film, Users, Settings, LogOut, LayoutDashboard, UserCircle, Radio } from 'lucide-react';
import toast from 'react-hot-toast';
import MovieList from './movies/MovieList';
import UserList from './users/UserList';
import CreatorList from './creators/CreatorList';
import SiteSettings from './settings/SiteSettings';
import LiveStreamingPage from './streaming/LiveStreamingPage';
import '../admin/movies/MovieForm.css'

const Sidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0">
      <div className="p-6">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">
            PMS<span className="text-primary">treaming</span>
          </span>
        </Link>
      </div>

      <nav className="mt-6">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/admin/dashboard/movies"
          className="flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Film size={20} />
          <span>Movies</span>
        </Link>
        
        <Link
          to="/admin/dashboard/creators"
          className="flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <UserCircle size={20} />
          <span>Creators</span>
        </Link>
        
        <Link
          to="/admin/dashboard/users"
          className="flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Users size={20} />
          <span>Users</span>
        </Link>

        <Link
          to="/admin/dashboard/streaming"
          className="flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Radio size={20} />
          <span>Live Streaming</span>
        </Link>
        
        <Link
          to="/admin/dashboard/settings"
          className="flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-destructive w-full text-left mt-6"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

const DashboardHome = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg">
          <Film className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">150</h3>
          <p className="text-muted-foreground">Total Movies</p>
        </div>
        <div className="bg-card p-6 rounded-lg">
          <Users className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">1,234</h3>
          <p className="text-muted-foreground">Users</p>
        </div>
        <div className="bg-card p-6 rounded-lg">
          <Settings className="h-8 w-8 text-primary mb-2" />
          <h3 className="text-2xl font-bold">€2,345</h3>
          <p className="text-muted-foreground">Monthly Revenue</p>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="admin-content">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="movies" element={<MovieList />} />
          <Route path="creators" element={<CreatorList />} />
          <Route path="users" element={<UserList />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="streaming" element={<LiveStreamingPage />} />
        </Routes>
      </div>
    </div>
  );
}