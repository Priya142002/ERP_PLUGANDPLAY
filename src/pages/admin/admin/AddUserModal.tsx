import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Mail, User, Shield } from 'lucide-react';
import { adminApi } from '../../../services/api';
import { useNotifications } from '../../../context/AppContext';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave }) => {
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    roleId: '',
    password: Math.random().toString(36).slice(-8), 
  });

  const [roles, setRoles] = useState<{label: string, value: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      // Reset password on each open
      setFormData(prev => ({ ...prev, password: Math.random().toString(36).slice(-8) }));
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    try {
      const res = await adminApi.getRoles();
      if (res.success && Array.isArray(res.data)) {
        setRoles(res.data.map((r: any) => ({ label: r.roleName, value: r.id.toString() })));
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load roles',
        duration: 3000
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roleId) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Please select a role',
        duration: 3000
      });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        roleId: parseInt(formData.roleId)
      };
      const res = await adminApi.createUser(payload);
      if (res.success) {
        showNotification({
          type: 'success',
          title: 'Success',
          message: res.message || 'User invited successfully',
          duration: 3000
        });
        if (onSave) onSave();
        onClose();
      } else {
        showNotification({
          type: 'error',
          title: 'Error',
          message: res.message || 'Failed to invite user',
          duration: 3000
        });
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'An error occurred',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Users / New"
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email"
            type="email"
            required
            placeholder="user@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            leftIcon={<Mail size={16} />}
          />

          <Input
            label="Full Name"
            required
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            leftIcon={<User size={16} />}
          />

          <Select
            label="User Role"
            required
            value={formData.roleId}
            onChange={(e) => handleChange('roleId', e.target.value)}
            options={[
              { label: 'Select Role', value: '' },
              ...roles
            ]}
            leftIcon={<Shield size={16} />}
          />

          <Input
            label="Temporary Password"
            required
            readOnly
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            leftIcon={<Shield size={16} />}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-6 py-2"
            disabled={loading}
          >
            {loading ? 'Inviting...' : 'Invite User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
