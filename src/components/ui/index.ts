// UI Components
export { default as Button } from "./Button";
export { Container } from "./Container";
export { Card } from "./Card";
export { Icon } from "./Icon";
export { Section } from "./Section";

// Form Components
export { TextArea } from "./TextArea";

// New unified form components
export { Input, PasswordInput } from "./Input";
export { FormField, FormFields, FormActions, FormDivider } from "./FormField";
export { FormContainer, FormHeader } from "./FormContainer";
export { SocialButton } from "./SocialButton";

// Re-export types for convenience
export type {
  ButtonProps,
  ContainerProps,
  CardProps,
  IconProps,
  SectionProps,
} from "@/types";

export type { TextAreaProps } from "./TextArea";
export type { InputProps, PasswordInputProps } from "./Input";
export type { FormFieldProps, FormFieldsProps, FormActionsProps, FormDividerProps } from "./FormField";
export type { FormContainerProps, FormHeaderProps, FormImageSectionProps } from "./FormContainer";
export type { SocialButtonProps } from "./SocialButton";