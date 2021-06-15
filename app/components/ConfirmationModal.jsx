import React from 'react';
import styled from 'styled-components';
import { CardBody, CardContentWrapper, CardWrapper } from '../styled-components/card';
import { Divider } from '../styled-components/common';
import Button from './Button.jsx';

const ModalBackground = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;


function ConfirmationModal({ isLoading, label, onCancel, onConfirm }) {

  return (
    <ModalBackground onClick={onCancel}>
      <CardWrapper border="none">
        <CardContentWrapper onClick={(e) => e.stopPropagation()}>
          <CardBody align="center">
            {label}
            <Divider />
            <ButtonWrapper>
              <Button onClick={onCancel} label="Cancel" isDisabled={isLoading} />
              <Button onClick={onConfirm} label="Delete" isDisabled={isLoading} isLoading={isLoading} />
            </ButtonWrapper>
          </CardBody>
        </CardContentWrapper>
      </CardWrapper>
    </ModalBackground>

  )

}

export default ConfirmationModal;
