import React from 'react';
import { Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import styles from './CoinInput.module.css';

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
  // handle input change event
  const debouncedLoadOptions = debounce(async (inputValue) => {
    const url = window.location.origin;
    const response = await fetch(
      `${url}/api/tickers/?ticker=${inputValue}&exchange=FTX`,
      {
        method: 'GET',
      }
    );
    const d = response.json().then((data) => data);
    return d;
  }, 200);

  const formatOptionLabel = ({ ticker, price }) => {
    return (
      <div className={styles.OptionBox}>
        <div>{ticker}</div>
        {!!price && <div>${price}</div>}
      </div>
    );
  };

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value, ref } }) => (
          <AsyncSelect
            isClearable={true}
            placeholder={placeholder}
            ref={ref}
            getOptionLabel={(e) => e.ticker}
            getOptionValue={(e) => e.ticker}
            loadOptions={debouncedLoadOptions}
            value={value}
            formatOptionLabel={formatOptionLabel}
            onChange={onChange}
          />
        )}
      />
      {errorMessage && <p className={styles.ErrorMessage}>{errorMessage}</p>}
    </Form.Group>
  );
};
