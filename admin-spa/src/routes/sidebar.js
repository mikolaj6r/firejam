const routes = [
  {
    path: '/app/dashboard',
    icon: 'HomeIcon',
    name: 'Dashboard',
  },
  {
    path: '/app/me',
    icon: 'FormsIcon',
    name: 'Profile Page',
  },
  {
    path: '/app/messages',
    icon: 'CardsIcon',
    name: 'Messages',
  },
  {
    path: '/app/posts',
    icon: 'TablesIcon',
    name: 'Posts',
  },
  {
    path: '/app/pages',
    icon: 'TablesIcon',
    name: 'Pages',
  },
  {
    path: '/app/events',
    icon: 'ModalsIcon',
    name: 'Events',
  },
  {
    path: '/app/clients',
    icon: 'TablesIcon',
    name: 'Clients',
  },
  {
    icon: 'PagesIcon',
    name: 'Admin',
    routes: [
      // submenu
      {
        path: '/app/users',
        name: 'Users',
      }
    ],
  },
]

export default routes
