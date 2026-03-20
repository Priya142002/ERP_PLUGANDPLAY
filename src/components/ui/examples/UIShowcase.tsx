import React, { useState } from 'react';
import { z } from 'zod';
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Radio,
  Modal,
  Badge,
  Card,
  Form,
  DataTable,
  ToastContainer
} from '../index';
import type { ToastNotification } from '../../../types';

// Example form schema
const exampleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user'], { required_error: 'Please select a role' }),
  bio: z.string().optional(),
  notifications: z.boolean().optional(),
  theme: z.enum(['light', 'dark']).optional()
});

type ExampleFormData = z.infer<typeof exampleSchema>;

// Example data for DataTable
const sampleData = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'active' }
];

const columns = [
  { key: 'name' as const, label: 'Name', sortable: true },
  { key: 'email' as const, label: 'Email', sortable: true },
  { key: 'role' as const, label: 'Role', filterable: true },
  { 
    key: 'status' as const, 
    label: 'Status', 
    filterable: true,
    render: (value: string) => (
      <Badge variant={value === 'active' ? 'success' : 'error'}>
        {value}
      </Badge>
    )
  }
];

const UIShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (type: ToastNotification['type'], title: string, message?: string) => {
    const notification: ToastNotification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      duration: 5000
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleFormSubmit = async (data: ExampleFormData) => {
    console.log('Form submitted:', data);
    addNotification('success', 'Form Submitted', 'Your data has been saved successfully!');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">UI Component Library Showcase</h1>
      
      {/* Buttons */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Buttons</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="info">Info</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Form Components */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Form Components</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Text Input"
              placeholder="Enter your name"
              helpText="This is a help text"
            />
            
            <Input
              label="Email Input"
              type="email"
              placeholder="Enter your email"
              error="This field is required"
            />
            
            <Select
              label="Select Option"
              placeholder="Choose an option"
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' }
              ]}
            />
            
            <div>
              <Textarea
                label="Description"
                placeholder="Enter description"
                rows={3}
              />
            </div>
            
            <div>
              <Checkbox
                label="I agree to the terms and conditions"
                helpText="Please read our terms carefully"
              />
            </div>
            
            <div>
              <Radio
                label="Theme Preference"
                name="theme"
                options={[
                  { value: 'light', label: 'Light Theme' },
                  { value: 'dark', label: 'Dark Theme' }
                ]}
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Badges */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Badges</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success" rounded>Rounded</Badge>
          </div>
        </Card.Body>
      </Card>

      {/* Data Table */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Data Table</h2>
        </Card.Header>
        <Card.Body>
          <DataTable
            data={sampleData}
            columns={columns}
            searchable
            filterable
            sortable
            paginated
            pageSize={5}
            onEdit={(item: any) => addNotification('info', 'Edit Action', `Editing ${item.name}`)}
            onDelete={(item: any) => addNotification('warning', 'Delete Action', `Deleting ${item.name}`)}
          />
        </Card.Body>
      </Card>

      {/* Modal and Form */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Modal with Form</h2>
        </Card.Header>
        <Card.Body>
          <Button onClick={() => setIsModalOpen(true)}>
            Open Modal Form
          </Button>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="User Information"
            size="lg"
          >
            <Form
              validationSchema={exampleSchema}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsModalOpen(false)}
              submitText="Save User"
            >
              {({ values, errors, touched, setValue, setFieldTouched }) => (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    required
                    value={values.name || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('name', e.target.value)}
                    onBlur={() => setFieldTouched('name')}
                    error={touched.name ? errors.name : undefined}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={values.email || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('email', e.target.value)}
                    onBlur={() => setFieldTouched('email')}
                    error={touched.email ? errors.email : undefined}
                  />
                  
                  <Radio
                    label="User Role"
                    name="role"
                    required
                    value={values.role || ''}
                    onChange={(value) => setValue('role', value)}
                    options={[
                      { value: 'admin', label: 'Administrator' },
                      { value: 'user', label: 'Regular User' }
                    ]}
                    error={touched.role ? errors.role : undefined}
                  />
                  
                  <Textarea
                    label="Bio"
                    value={values.bio || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                  
                  <Checkbox
                    label="Enable email notifications"
                    checked={values.notifications || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('notifications', e.target.checked)}
                  />
                </div>
              )}
            </Form>
          </Modal>
        </Card.Body>
      </Card>

      {/* Toast Notifications */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Toast Notifications</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="success" 
              onClick={() => addNotification('success', 'Success!', 'Operation completed successfully')}
            >
              Success Toast
            </Button>
            <Button 
              variant="danger" 
              onClick={() => addNotification('error', 'Error!', 'Something went wrong')}
            >
              Error Toast
            </Button>
            <Button 
              variant="warning" 
              onClick={() => addNotification('warning', 'Warning!', 'Please check your input')}
            >
              Warning Toast
            </Button>
            <Button 
              variant="info" 
              onClick={() => addNotification('info', 'Info', 'Here is some information')}
            >
              Info Toast
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Toast Container */}
      <ToastContainer
        notifications={notifications}
        onClose={removeNotification}
        position="top-right"
      />
    </div>
  );
};

export default UIShowcase;