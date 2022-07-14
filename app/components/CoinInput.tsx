import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';

export const CoinInput: React.FC<any> = ({
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
  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState({ ticker: '' });

  // handle input change event
  const handleInputChange = (value) => {
    setValue(value);
  };

  // handle selection
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  const loadOptions = async (inputValue) => {
    const url = window.location.origin;
    const response = await fetch(
      `${url}/api/tickers/?ticker=${inputValue}&exchange=FTX`,
      {
        method: 'GET',
      }
    );
    return response.json().then((data) => data);
  };

  const debouncedLoadOptions = debounce(async (inputValue) => {
    const url = window.location.origin;
    const response = await fetch(
      `${url}/api/tickers/?ticker=${inputValue}&exchange=FTX`,
      {
        method: 'GET',
      }
    );
    const d = response.json().then((data) => data);
    console.log(d);
    return d;
  }, 200);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value, ref } }) => (
        <AsyncSelect
          placeholder={placeholder}
          ref={ref}
          getOptionLabel={(e) => e.ticker}
          getOptionValue={(e) => e.ticker}
          loadOptions={debouncedLoadOptions}
          onInputChange={handleInputChange}
          onChange={onChange}
          value={value}
        />
      )}
    />
  );
};
