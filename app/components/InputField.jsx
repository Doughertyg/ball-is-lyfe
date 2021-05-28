import React from 'react';
import styled from 'styled-components';

import {Input, InputError} from '../styled-components/interactive';

const InputWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

function InputField({
  errors,
  disabled,
  name,
  minLength,
  maxLength,
  onChange,
  type,
  placeholder,
  value
}) {

  return (
    <InputWrapper>
      <ContentWrapper>
        <Input 
          type={type ?? "text"}
          id={name ?? "username"}
          errors={errors}
          disabled={disabled}
          minLength={minLength ?? "8"}
          maxLength={maxLength ?? "16"}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Type a username..."}
          value={value}
        />
        {errors != null ? (
          <InputError>
            <p>{errors}</p>
          </InputError>
        ) : null}
      </ContentWrapper>
    </InputWrapper>
  );
};

export default InputField;
