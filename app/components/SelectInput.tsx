import React from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';

export const SelectInput: React.FC<any> = ({
  name,
  control,
  label,
  options,
}: {
  name: string;
  control: any;
  label?: string;
  options: string[];
}) => {
  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ref } }) => (
          <Form.Select
            aria-label={name}
            onChange={onChange}
            value={value}
            ref={ref}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        )}
      />
    </Form.Group>
  );
};
