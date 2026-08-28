"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Check, ChevronDown, X } from "lucide-react";

type BaseProps = {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  id?: string;
};

type FieldProps = BaseProps & {
  children: ReactNode;
};

type ControlProps = {
  className?: string;
};

export function Input({
  label,
  hint,
  error,
  required,
  id,
  className,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const isCheckable = props.type === "checkbox" || props.type === "radio";
  const defaultClass = isCheckable ? "" : "form-input";
  const control = (
    <input
      id={id}
      className={`${defaultClass}${className ? ` ${className}` : ""}`}
      required={required}
      {...props}
    />
  );
  return label || hint || error ? (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      id={id}
    >
      {control}
    </FormField>
  ) : (
    control
  );
}

export function Textarea({
  label,
  hint,
  error,
  required,
  id,
  className,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const control = (
    <textarea
      id={id}
      className={`form-textarea${className ? ` ${className}` : ""}`}
      required={required}
      {...props}
    />
  );
  return label || hint || error ? (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      id={id}
    >
      {control}
    </FormField>
  ) : (
    control
  );
}

export function Select({
  label,
  hint,
  error,
  required,
  id,
  className,
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const control = (
    <select
      id={id}
      className={`form-select${className ? ` ${className}` : ""}`}
      required={required}
      {...props}
    />
  );
  return label || hint || error ? (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      id={id}
    >
      {control}
    </FormField>
  ) : (
    control
  );
}

export function FormField({
  label,
  hint,
  error,
  required,
  id,
  children,
}: FieldProps) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <div className="form-error">{error}</div>
      ) : hint ? (
        <div className="form-hint">{hint}</div>
      ) : null}
    </div>
  );
}

export function TextInput(
  props: BaseProps & InputHTMLAttributes<HTMLInputElement>,
) {
  const { label, hint, error, required, id, className, ...inputProps } = props;
  return (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      id={id}
    >
      <input
        id={id}
        className={`form-input${className ? ` ${className}` : ""}`}
        required={required}
        {...inputProps}
      />
    </FormField>
  );
}

export function TextArea(
  props: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { label, hint, error, required, id, className, ...textareaProps } =
    props;
  return (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      id={id}
    >
      <textarea
        id={id}
        className={`form-textarea${className ? ` ${className}` : ""}`}
        required={required}
        {...textareaProps}
      />
    </FormField>
  );
}

export function SelectField(
  props: BaseProps & SelectHTMLAttributes<HTMLSelectElement>,
) {
  const {
    label,
    hint,
    error,
    required,
    id,
    className,
    children,
    ...selectProps
  } = props;
  return (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      id={id}
    >
      <select
        id={id}
        className={`form-select${className ? ` ${className}` : ""}`}
        required={required}
        {...selectProps}
      >
        {children}
      </select>
    </FormField>
  );
}

type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = BaseProps & {
  value: string[];
  options: MultiSelectOption[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function MultiSelect({
  label,
  hint,
  error,
  required,
  value,
  options,
  onChange,
  placeholder = "Select options",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selectedOptions = value
    .map((item) => options.find((option) => option.value === item))
    .filter((option): option is MultiSelectOption => Boolean(option));

  const toggle = (optionValue: string) => {
    onChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  };

  return (
    <FormField label={label} hint={hint} error={error} required={required}>
      <div className={`multi-select ${open ? "is-open" : ""}`} ref={rootRef}>
        <button
          type="button"
          className="multi-select-trigger"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
        >
          <span
            className={selectedOptions.length ? "" : "multi-select-placeholder"}
          >
            {selectedOptions.length
              ? `${selectedOptions.length} selected`
              : placeholder}
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
        {selectedOptions.length > 0 && (
          <div className="multi-select-values">
            {selectedOptions.map((option) => (
              <span className="multi-select-chip" key={option.value}>
                {option.label}
                <button
                  type="button"
                  aria-label={`Remove ${option.label}`}
                  onClick={() => toggle(option.value)}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
        {open && (
          <div
            className="multi-select-menu"
            role="listbox"
            aria-multiselectable="true"
          >
            {options.length === 0 ? (
              <div className="multi-select-empty">No options available</div>
            ) : (
              options.map((option) => {
                const selected = value.includes(option.value);
                return (
                  <button
                    type="button"
                    className={`multi-select-option ${selected ? "is-selected" : ""}`}
                    role="option"
                    aria-selected={selected}
                    key={option.value}
                    onClick={() => toggle(option.value)}
                  >
                    <span>{option.label}</span>
                    {selected && <Check size={15} aria-hidden="true" />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}

export type MultiSelectChangeEvent = ChangeEvent<HTMLSelectElement>;
