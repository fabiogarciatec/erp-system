import { IconType } from 'react-icons';
import { FiHome, FiSettings, FiUsers, FiBox, FiDollarSign, FiFileText, FiTruck, FiBarChart } from 'react-icons/fi';

interface SubMenuItem {
  name: string;
  path: string;
  icon?: IconType;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: IconType;
  subItems?: SubMenuItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: FiHome
  },
  {
    name: 'Vendas',
    path: '/sales',
    icon: FiDollarSign
  },
  {
    name: 'Produtos',
    path: '/products',
    icon: FiBox
  },
  {
    name: 'Clientes',
    path: '/customers',
    icon: FiUsers
  },
  {
    name: 'Fornecedores',
    path: '/suppliers',
    icon: FiTruck
  },
  {
    name: 'Relatórios',
    path: '/reports',
    icon: FiBarChart
  },
  {
    name: 'Documentos',
    path: '/documents',
    icon: FiFileText
  },
  {
    name: 'Configurações',
    path: '/configuracoes',
    icon: FiSettings,
    subItems: [
      {
        name: 'Profile',
        path: '/configuracoes/profile'
      },
      {
        name: 'Company',
        path: '/configuracoes/company'
      }
    ]
  }
];