import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart2, Settings, Menu, X, Disc } from 'lucide-react';

interface Tab {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

const NavItem = ({ to, icon, label, onClick, delay }: { to: string; icon: React.ReactNode; label: string; onClick?: () => void; delay: string }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 border-2 border-transparent transition-all duration-200 font-bold tracking-wider animate-slide-up ${delay} ${
          isActive
            ? 'bg-[#FF00FF] text-white border-black shadow-[4px_4px_0px_0px_#000000] -translate-y-1'
            : 'text-slate-700 hover:bg-white hover:border-black hover:shadow-[4px_4px_0px_0px_#000000] hover:translate-x-2'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<Tab[]>([]);

  const closeSidebar = () => setIsSidebarOpen(false);

  const getPageTitle = (path: string) => {
    if (path === '/') return 'DASHBOARD';
    if (path === '/subjects') return 'DATABASE';
    if (path.startsWith('/subject/')) return 'FILE_VIEWER';
    if (path === '/analytics') return 'ANALYTICS';
    if (path === '/settings') return 'CONFIG';
    return 'UNKNOWN';
  };

  const getPageIcon = (path: string) => {
    if (path === '/') return <LayoutDashboard size={14} />;
    if (path === '/subjects' || path.startsWith('/subject/')) return <BookOpen size={14} />;
    if (path === '/analytics') return <BarChart2 size={14} />;
    if (path === '/settings') return <Settings size={14} />;
    return <Disc size={14} />;
  };

  // Manage Tabs
  useEffect(() => {
    const exists = tabs.find(t => t.path === location.pathname);
    if (!exists) {
      setTabs(prev => [...prev, {
        path: location.pathname,
        label: getPageTitle(location.pathname),
        icon: getPageIcon(location.pathname)
      }]);
    }
  }, [location.pathname]);

  const closeTab = (e: React.MouseEvent, pathToRemove: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const newTabs = tabs.filter(t => t.path !== pathToRemove);
    setTabs(newTabs);

    // If we closed the active tab, navigate elsewhere
    if (location.pathname === pathToRemove) {
      if (newTabs.length > 0) {
        navigate(newTabs[newTabs.length - 1].path);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#f0f0f0] border-r-4 border-black transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Scanline overlay for sidebar */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 background-size-[100%_2px,3px_100%]"></div>
          
          <div className="h-20 flex items-center px-6 border-b-4 border-black bg-white z-10">
             <div className="w-10 h-10 bg-[#00FFFF] border-2 border-black flex items-center justify-center text-black mr-3 shadow-[3px_3px_0px_0px_#000000] hover:animate-spin cursor-help">
                <Disc size={24} />
             </div>
             <div className="flex flex-col">
                <span className="text-xl font-bold text-black tracking-widest leading-none font-['Rajdhani'] hover-glitch cursor-default">SSC_OS</span>
                <span className="text-[10px] text-slate-500 font-mono">SYS.READY<span className="animate-blink">_</span></span>
             </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-4 z-10">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="DASHBOARD" onClick={closeSidebar} delay="delay-75" />
            <NavItem to="/subjects" icon={<BookOpen size={20} />} label="SUBJECTS" onClick={closeSidebar} delay="delay-100" />
            <NavItem to="/analytics" icon={<BarChart2 size={20} />} label="ANALYTICS" onClick={closeSidebar} delay="delay-150" />
            <NavItem to="/settings" icon={<Settings size={20} />} label="CONFIG" onClick={closeSidebar} delay="delay-200" />
          </nav>
          
          <div className="p-4 border-t-4 border-black bg-[#e0e0e0] text-xs font-mono text-center z-10">
            <div className="mb-1">NET: <span className="text-[#00aa00] font-bold">CONNECTED</span></div>
            <div className="text-[10px] text-slate-500">MEM: 64MB OK</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#dbeafe]">
        {/* Header / Taskbar */}
        <header className="h-14 bg-[#c0c0c0] border-b-4 border-black flex items-end px-2 space-x-1 shadow-sm z-10 overflow-x-auto no-scrollbar">
          <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 mr-2 text-black border-2 border-black bg-white active:bg-black active:text-white mb-2"
            >
              <Menu size={20} />
          </button>
          
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <div 
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`
                  relative group flex items-center gap-2 px-4 py-2 min-w-[140px] max-w-[200px] cursor-pointer select-none
                  border-t-2 border-l-2 border-r-2 border-black rounded-t-md mb-[-4px] z-20
                  ${isActive 
                    ? 'bg-[#dbeafe] font-bold text-black pb-3' 
                    : 'bg-[#a0a0a0] text-slate-700 hover:bg-[#b0b0b0] border-b-2'
                  }
                `}
              >
                {tab.icon}
                <span className="truncate text-xs font-mono uppercase flex-1">{tab.label}</span>
                <button 
                  onClick={(e) => closeTab(e, tab.path)}
                  className={`
                    p-0.5 rounded-sm hover:bg-red-500 hover:text-white transition-colors
                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  `}
                >
                  <X size={12} />
                </button>
                {/* Active Indicator Line */}
                {isActive && <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF00FF]"></div>}
              </div>
            );
          })}
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9IiNkYmVhZmUiLz4KPHBhdGggZD0iTTAgNDBMMTQwIDBoNDB2NDBIMHoiIGZpbGw9InRyYW5zcGFyZW50IiBzdHJva2U9IiM5M2M1ZmQiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC41Ii8+Cjwvc3ZnPg==')]">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;