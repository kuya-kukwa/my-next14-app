# NextFlix Forms Documentation

## 📋 Overview

Complete form system for your NextFlix movie streaming app built with React Hook Form.

## 🎯 What's Included

### Form Components (`src/components/forms/`)
- ✅ **SignUpForm** - User registration with validation
- ✅ **SignInForm** - User authentication
- ✅ **ContactForm** - Contact us form with success message

### Input Components (`src/components/ui/`)
- ✅ **TextInput** - Text, email, tel, url inputs
- ✅ **PasswordInput** - Password with show/hide toggle
- ✅ **TextArea** - Multi-line text input
- ✅ **EmailInput** - Email input with clear button (already existed)

### Pages (`src/pages/`)
- ✅ `/signup` - Sign up page
- ✅ `/signin` - Sign in page
- ✅ `/contact` - Contact us page

## 🚀 Usage

### Import and Use Forms

```tsx
import { SignUpForm, SignInForm, ContactForm } from '@/components/forms';

// In your component
<SignUpForm onSubmit={handleSignUp} />
```

### Import Individual Inputs

```tsx
import { TextInput, PasswordInput, TextArea } from '@/components/ui';

````markdown
# NextFlix Forms Documentation

## 📋 Overview

Complete form system for your NextFlix movie streaming app built with React Hook Form.

## 🎯 What's Included

### Form Components (`src/components/forms/`)
- ✅ **SignUpForm** - User registration with validation
- ✅ **SignInForm** - User authentication
- ✅ **ContactForm** - Contact us form with success message

### Input Components (`src/components/ui/`)
- ✅ **TextInput** - Text, email, tel, url inputs
- ✅ **PasswordInput** - Password with show/hide toggle
- ✅ **TextArea** - Multi-line text input
- ✅ **EmailInput** - Email input with clear button (already existed)

### Pages (`src/pages/`)
- ✅ `/signup` - Sign up page
- ✅ `/signin` - Sign in page
- ✅ `/contact` - Contact us page

## 🚀 Usage

### Import and Use Forms

```tsx
import { SignUpForm, SignInForm, ContactForm } from '@/components/forms';

// In your component
<SignUpForm onSubmit={handleSignUp} />
```

### Import Individual Inputs

```tsx
import { TextInput, PasswordInput, TextArea } from '@/components/ui';

// In your form
<TextInput
  label="Full Name"
  placeholder="John Doe"
  error={errors.name?.message}
  required
/>
```

## 📖 Examples

### Sign Up Form
```tsx
const handleSignUp = async (data) => {
  // data: { name, email, password, confirmPassword }
  await fetch('/api/signup', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

<SignUpForm onSubmit={handleSignUp} />
```

### Sign In Form
```tsx
const handleSignIn = async (data) => {
  // data: { email, password, rememberMe }
  await fetch('/api/signin', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

<SignInForm onSubmit={handleSignIn} />
```

### Contact Form
```tsx
const handleContact = async (data) => {
  // data: { name, email, subject, message }
  await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

<ContactForm onSubmit={handleContact} />
```

## 🎨 Styling

All forms use your existing NextFlix theme:
- Glassmorphism effects (`bg-white/10`, `backdrop-blur-md`)
- Red primary color for focus states
- Responsive design (mobile-first)
- Smooth transitions and animations

## ✅ Validation

Built-in validation rules:

**Sign Up:**
- Name: Min 2 characters
- Email: Valid email format
- Password: Min 8 chars, must contain uppercase, lowercase, and number
- Confirm Password: Must match password

**Sign In:**
- Email: Valid email format
- Password: Required

**Contact:**
- Name: Min 2 characters
- Email: Valid email format
- Subject: Min 3 characters
- Message: Min 10 characters

## 🔗 Navigation

Add these links to your Layout/Navigation:

```tsx
<Link href="/signup">Sign Up</Link>
<Link href="/signin">Sign In</Link>
<Link href="/contact">Contact</Link>
```

## 🎯 Next Steps

1. **Test the forms**: Visit `/signup`and `/signin`
2. **Add API integration**: Replace console.log with actual API calls
3. **Add authentication**: Implement JWT or session-based auth
4. **Add validation feedback**: Customize error messages
5. **Add success redirects**: Redirect users after successful form submission

## 📱 Try It Now

- Visit: `http://localhost:3000/signup`
- Visit: `http://localhost:3000/signin`

## 🛠 Customization

### Change form styling:
Edit individual form components in `src/components/forms/`

### Add new inputs:
Create new components in `src/components/ui/` following the existing pattern

### Modify validation:
Update the validation rules in each form component's `register()` calls

## 📦 Dependencies

- `react-hook-form` - Form state management and validation (already installed ✅)

---

**🎬 Your forms are ready to use! Start collecting user data for NextFlix!**

````
