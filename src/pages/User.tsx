import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { PlusCircle, User } from 'lucide-react';
import { Switch } from '@mui/material';
import axios from 'axios';

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Données utilisateurs fictives
  const [usersData, setUsersData] = useState<any [] | null>([]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      setUsersData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Erreur de recuperation des utilisateurs", error);
    }
  }

  useState(() => {
    getAllUsers();
  }, [usersData]);

  // Met à jour le rôle d'un utilisateur spécifique
  const handleRoleChange = (userId: number, newRole: string) => {
    const updatedUsers = usersData?.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsersData(updatedUsers);
  };

  // Définir les colonnes pour le tableau des utilisateurs
  const usersColumns = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Rôle', sortable: true },
    { key: 'verification', label: 'Vérification', sortable: true },
    { key: 'date_creation', label: 'Date de création', sortable: true },
    { key: 'derniere_connexion', label: 'Dernière connexion', sortable: true },
  ];

  // Filtrer les utilisateurs par rôle
  const filteredUsers = filterRole === 'all'
    ? usersData
    : usersData?.filter(user => user.role.toLowerCase() === filterRole);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
        <p className="text-gray-600">Gérer les utilisateurs et leurs rôles</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('users')}
            >
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Utilisateurs
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="role-filter" className="block text-sm text-gray-600 mb-1">
                      Rôle
                    </label>
                    <select
                      id="role-filter"
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="all">Tous les rôles</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>
              </div>

              <DataTable
                title="Utilisateurs"
                data={filteredUsers}
                columns={usersColumns}
              />
            </>
          )}

          {activeTab === 'roles' && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium">Rôles</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter un nouveau rôle
                </button>
              </div>

              {/* Ici, vous pouvez ajouter un autre DataTable ou un composant similaire pour gérer les rôles */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
