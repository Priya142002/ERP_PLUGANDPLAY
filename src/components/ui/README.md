# UI Component Library

A comprehensive, accessible, and professional UI component library built for the Admin Dashboard ERP system. This library provides all the essential components needed to build modern, responsive admin interfaces with consistent styling and behavior.

## Features

- **Professional ERP Styling**: Clean, modern design following enterprise design patterns
- **Full Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes and keyboard navigation
- **TypeScript Support**: Fully typed components with comprehensive interfaces
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Theme Support**: Professional color schemes with multiple variants
- **Form Integration**: Built-in validation support with Zod schema integration
- **Real-time Feedback**: Toast notifications and loading states
- **Modular Architecture**: Tree-shakeable components for optimal bundle size

## Components

### Form Components

#### Button
Professional button component with multiple variants and states.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'ghost'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `leftIcon`, `rightIcon`: React.ReactNode

#### Input
Enhanced input component with validation styling and accessibility features.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email Address"
  type="email"
  required
  error={errors.email}
  helpText="We'll never share your email"
/>
```

**Props:**
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local'
- `size`: 'sm' | 'md' | 'lg'
- `leftIcon`, `rightIcon`: React.ReactNode
- `error`: string
- `helpText`: string

#### Select
Dropdown select component with option groups and filtering.

```tsx
import { Select } from '@/components/ui';

<Select
  label="Country"
  placeholder="Choose a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]}
/>
```

#### Textarea
Multi-line text input with resize controls.

```tsx
import { Textarea } from '@/components/ui';

<Textarea
  label="Description"
  rows={4}
  resize="vertical"
  maxLength={500}
/>
```

#### Checkbox
Accessible checkbox component with indeterminate state support.

```tsx
import { Checkbox } from '@/components/ui';

<Checkbox
  label="I agree to the terms"
  helpText="Please read our terms carefully"
  required
/>
```

#### Radio
Radio button group component with horizontal/vertical layouts.

```tsx
import { Radio } from '@/components/ui';

<Radio
  label="Payment Method"
  name="payment"
  options={[
    { value: 'card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' }
  ]}
  orientation="horizontal"
/>
```

### Layout Components

#### Card
Flexible card component with header, body, and footer sections.

```tsx
import { Card } from '@/components/ui';

<Card shadow="md" border>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    Card content goes here
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

#### Modal
Accessible modal dialog with focus management and keyboard navigation.

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  size="lg"
  closeOnEscape
  closeOnOverlayClick
>
  Modal content
</Modal>
```

**Features:**
- Focus trapping and management
- Escape key handling
- Overlay click handling
- Body scroll prevention
- Multiple size variants

### Data Display Components

#### DataTable
Comprehensive data table with search, filtering, sorting, and pagination.

```tsx
import { DataTable } from '@/components/ui';

<DataTable
  data={users}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      filterable: true,
      render: (value) => <Badge variant={value === 'active' ? 'success' : 'error'}>{value}</Badge>
    }
  ]}
  searchable
  filterable
  sortable
  paginated
  pageSize={10}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Features:**
- Global search across all columns
- Individual column filtering
- Multi-column sorting
- Pagination with page size options
- Row selection (single/multiple)
- Custom cell rendering
- Action buttons
- Loading states
- Empty states

#### Badge
Status indicator component with multiple variants.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="sm" rounded>
  Active
</Badge>
```

### Feedback Components

#### Toast
Rich notification system with animations and actions.

```tsx
import { Toast, ToastContainer } from '@/components/ui';

// Individual toast
<Toast
  notification={{
    id: '1',
    type: 'success',
    title: 'Success!',
    message: 'Your changes have been saved.',
    action: {
      label: 'Undo',
      onClick: handleUndo
    }
  }}
  onClose={handleClose}
/>

// Toast container for managing multiple toasts
<ToastContainer
  notifications={notifications}
  onClose={removeNotification}
  position="top-right"
  maxToasts={5}
/>
```

#### Spinner & Loading
Loading indicators with multiple sizes and colors.

```tsx
import { Spinner, Loading } from '@/components/ui';

// Simple spinner
<Spinner size="md" color="primary" />

// Loading with text
<Loading 
  size="lg" 
  text="Loading data..." 
  centered 
/>

// Full-screen overlay
<Loading overlay text="Processing..." />
```

### Advanced Components

#### Form
Comprehensive form component with validation integration.

```tsx
import { Form } from '@/components/ui';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email')
});

<Form
  validationSchema={schema}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitText="Save Changes"
>
  {({ values, errors, touched, setValue, setFieldTouched }) => (
    <div className="space-y-4">
      <Input
        label="Name"
        value={values.name || ''}
        onChange={(e) => setValue('name', e.target.value)}
        onBlur={() => setFieldTouched('name')}
        error={touched.name ? errors.name : undefined}
      />
      {/* More form fields */}
    </div>
  )}
</Form>
```

**Features:**
- Zod schema validation
- Real-time field validation
- Form state management
- Submission handling
- Reset functionality
- Loading states

## Styling and Theming

### Color System
The component library uses a comprehensive color system with semantic naming:

- **Primary**: Main brand colors (blue)
- **Success**: Success states (green)
- **Error**: Error states (red)
- **Warning**: Warning states (yellow)
- **Info**: Informational states (cyan)
- **Gray**: Neutral colors for text and backgrounds

### Typography
- **Font Family**: Inter (system fallbacks included)
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl
- **Font Weights**: normal, medium, semibold, bold

### Spacing
Consistent spacing scale based on 0.25rem increments:
- 1 (0.25rem), 2 (0.5rem), 3 (0.75rem), 4 (1rem), 6 (1.5rem), 8 (2rem), 12 (3rem)

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1280px
- **Large Desktop**: > 1280px

## Accessibility Features

### WCAG 2.1 AA Compliance
- Proper color contrast ratios
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA attributes and roles

### Keyboard Navigation
- Tab navigation through interactive elements
- Enter/Space activation for buttons
- Arrow key navigation for radio groups
- Escape key for modals and dropdowns

### Screen Reader Support
- Semantic HTML elements
- Proper labeling and descriptions
- Live regions for dynamic content
- Status announcements

## Usage Examples

### Basic Form
```tsx
import { Input, Select, Button, Card } from '@/components/ui';

function UserForm() {
  return (
    <Card>
      <Card.Header>
        <h2>User Information</h2>
      </Card.Header>
      <Card.Body>
        <div className="space-y-4">
          <Input
            label="Full Name"
            required
            placeholder="Enter your full name"
          />
          <Select
            label="Role"
            placeholder="Select a role"
            options={[
              { value: 'admin', label: 'Administrator' },
              { value: 'user', label: 'User' }
            ]}
          />
          <div className="flex justify-end space-x-3">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
```

### Data Management Interface
```tsx
import { DataTable, Button, Badge, Card } from '@/components/ui';

function UserManagement() {
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      filterable: true,
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'error'}>
          {value}
        </Badge>
      )
    }
  ];

  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between items-center">
          <h2>Users</h2>
          <Button variant="primary">Add User</Button>
        </div>
      </Card.Header>
      <Card.Body>
        <DataTable
          data={users}
          columns={columns}
          searchable
          filterable
          sortable
          paginated
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card.Body>
    </Card>
  );
}
```

## Best Practices

### Component Usage
1. **Always provide labels** for form components
2. **Use semantic HTML** elements when possible
3. **Include error handling** for form validation
4. **Provide loading states** for async operations
5. **Use consistent spacing** with the design system

### Accessibility
1. **Test with keyboard navigation** only
2. **Verify screen reader compatibility**
3. **Ensure proper color contrast**
4. **Provide alternative text** for images and icons
5. **Use ARIA attributes** appropriately

### Performance
1. **Import components individually** for tree shaking
2. **Use React.memo** for expensive components
3. **Implement virtualization** for large data sets
4. **Optimize images** and icons
5. **Minimize re-renders** with proper state management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When adding new components:

1. Follow the existing component structure
2. Include comprehensive TypeScript types
3. Add accessibility features
4. Write documentation and examples
5. Test across supported browsers
6. Ensure responsive design
7. Add proper error handling

## Migration Guide

When upgrading components:

1. Check for breaking changes in props
2. Update TypeScript types if needed
3. Test accessibility features
4. Verify responsive behavior
5. Update documentation