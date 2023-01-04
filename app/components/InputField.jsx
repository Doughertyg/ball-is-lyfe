import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from '../styled-components/common';

import {Input, InputError} from '../styled-components/interactive';
import LoadingSpinnerSpin from './LoadingSpinnerSpin.jsx';

const InputWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const ContentWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  margin-left: 8px;
`;

function InputField({
  autoComplete = true,
  errors,
  disabled,
  height,
  name,
  loading,
  minLength,
  maxLength,
  onChange,
  onClick,
  type,
  placeholder,
  width,
  value
}) {

  return (
    <InputWrapper>
      <ContentWrapper>
        <FlexContainer alignItems="center" justify="flex-start" width="100%">
          <Input 
            autoComplete={autoComplete ? 'on' : 'off'}
            type={type ?? "text"}
            id={name ?? "username"}
            errors={errors}
            height={height ?? 'auto'}
            disabled={disabled}
            minLength={minLength ?? "8"}
            maxLength={maxLength ?? "36"}
            onChange={(e) => onChange(e.target.value)}
            onClick={onClick}
            placeholder={placeholder ? placeholder : name ? `Type a ${name}...` : ''}
            width={width ?? 'auto'}
            value={value}
          />
          {loading && <SpinnerWrapper><LoadingSpinnerSpin /></SpinnerWrapper>}
        </FlexContainer>
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
