import styled from 'styled-components';

export const CardBody = styled.div`
  align-items: ${props => props.align ?? 'flex-start'};
  background-color: white;
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 16px;
  padding-left: 0;
  width: 100%;
`;

export const CardContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: ${props => props.height ?? 'auto'};
  width: ${props => props.width ?? 'auto'};
`;

export const CardWrapper = styled.div`
max-width: 400px;
border: ${props => props.border ?? '1px solid rgba(0, 0, 0, 0.1)'};
border-radius: 8px;
height: ${props => props.height ?? 'auto'};
padding: 16px;
margin: 0 auto;
margin-bottom: 4px;
margin-top: ${props => props.marginTop ?? 0};
`;


