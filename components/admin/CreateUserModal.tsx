import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../layout/Modal';
import { User } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import * as api from '../../services/api';

interface CreateUserModalProps {
    onClose: () => void;
    onUserCreated: (newUser: User) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onUserCreated }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: 'password123', // Default password for simplicity
        referral_code: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // The API for admin user creation might accept more fields than public registration
            const res = await api.adminCreateUser(formData);
            onUserCreated(res);
        } catch (err: any) {
            setError(err.message || "Failed to create user.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={t('admin.createUserModal.title')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-brand-light-gray">
                    {t('admin.createUserModal.desc')}
                </p>
                {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="firstName" label={t('admin.createUserModal.firstName')} value={formData.firstName} onChange={handleChange} required />
                    <Input name="lastName" label={t('admin.createUserModal.lastName')} value={formData.lastName} onChange={handleChange} required />
                </div>
                <Input name="email" label={t('admin.createUserModal.email')} type="email" value={formData.email} onChange={handleChange} required />
                <Input name="username" label={t('admin.createUserModal.username')} value={formData.username} onChange={handleChange} required />
                <Input name="referral_code" label={t('admin.createUserModal.referrer')} value={formData.referral_code} onChange={handleChange} />
                <Input name="password" label={t('admin.createUserModal.password')} type="password" value={formData.password} onChange={handleChange} required />
                <p className="text-xs text-brand-ui-element">{t('admin.createUserModal.passwordNote')}</p>

                <div className="flex justify-end gap-4 pt-4 border-t border-brand-ui-element/30">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>{t('admin.userDetailModal.cancel')}</Button>
                    <Button type="submit" isLoading={isLoading}>{t('admin.createUserModal.button')}</Button>
                </div>
            </form>
        </Modal>
    );
};
