import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../../../services/api';
import { User } from '../../../types';
import { Spinner } from '../../../components/ui/Spinner';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { UserDetailModal } from '../../../components/admin/UserDetailModal';
import { CreateUserModal } from '../../../components/admin/CreateUserModal';

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
    const { t } = useTranslation();
    const statusKey = status ? status.toLowerCase() : 'active';
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block capitalize';
    const variantClasses = {
        active: 'bg-success/20 text-success',
        frozen: 'bg-warning/20 text-warning',
    };
    return <span className={`${baseClasses} ${variantClasses[statusKey as keyof typeof variantClasses]}`}>{t(`common.status.${statusKey}`)}</span>;
}

export const UserManagementTab: React.FC = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await api.adminListUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleUserUpdate = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleUserCreated = (newUser: User) => {
        setUsers(prevUsers => [...prevUsers, newUser]);
        setIsCreateModalOpen(false);
    };

    if (isLoading) return <Spinner />;
    if (error) return <div className="text-error text-center p-4">{error}</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">{t('admin.userManagement.title')}</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    {t('admin.userManagement.createButton')}
                </Button>
            </div>


            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg shadow-lg">
                <div className="p-4 border-b border-brand-ui-element/20">
                    <Input
                        placeholder={t('admin.userManagement.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-brand-dark/50">
                            <tr>
                                <th className="p-4 font-semibold text-brand-white">{t('admin.userManagement.table.name')}</th>
                                <th className="p-4 font-semibold text-brand-white hidden sm:table-cell">{t('admin.userManagement.table.email')}</th>
                                <th className="p-4 font-semibold text-right text-brand-white hidden md:table-cell">{t('admin.userManagement.table.balance')}</th>
                                <th className="p-4 font-semibold text-center text-brand-white">{t('admin.userManagement.table.status')}</th>
                                <th className="p-4 font-semibold text-center text-brand-white">{t('admin.userManagement.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-brand-ui-element/20 last:border-0 hover:bg-brand-ui-element/10">
                                    <td className="p-4">
                                        <div className="font-semibold">{user.firstName} {user.lastName}</div>
                                        <div className="text-sm text-brand-light-gray">@{user.username}</div>
                                    </td>
                                    <td className="p-4 text-brand-light-gray hidden sm:table-cell">{user.email}</td>
                                    <td className="p-4 font-mono text-right text-brand-secondary hidden md:table-cell">£{parseFloat(user.balance || '0').toFixed(2)}</td>
                                    <td className="p-4 text-center"><StatusBadge status={user.status} /></td>
                                    <td className="p-4 text-center">
                                        <Button variant="secondary" size="sm" onClick={() => setSelectedUser(user)}>
                                            {t('admin.userManagement.table.manage')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={handleUserUpdate}
                />
            )}

            {isCreateModalOpen && (
                <CreateUserModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onUserCreated={handleUserCreated}
                />
            )}
        </div>
    );
};
