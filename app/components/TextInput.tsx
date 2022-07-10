import React from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';

export const TextInput: React.FC<any> = ({
  name,
  control,
  rules,
  label,
  errorMessage,
  placeholder,
}: {
  name: string;
  control: any;
  label?: string;
  rules?: any;
  errorMessage?: string;
  placeholder?: string;
}) => {
  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value, ref } }) => (
          <Form.Control
            type="text"
            onChange={onChange}
            value={value}
            ref={ref}
            placeholder={placeholder}
            isInvalid={!!errorMessage}
          />
        )}
      />
      {errorMessage && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
