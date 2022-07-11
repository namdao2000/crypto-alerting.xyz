import React from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';

type Option = {
  key: string;
  value: any;
};
export const SelectInput: React.FC<any> = ({
  name,
  control,
  label,
  options,
}: {
  name: string;
  control: any;
  label?: string;
  options: Option[];
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
              <option key={option.key} value={option.value}>
                {option.key}
              </option>
            ))}
          </Form.Select>
        )}
      />
    </Form.Group>
  );
};
