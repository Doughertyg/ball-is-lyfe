import styled from 'styled-components';

export const CardBody = styled.div`
  align-items: ${props => props.align ?? 'flex-start'};
  background-color: white;
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding-top: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

export const CardContentWrapper = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.alignItems ?? 'flex-start'};
  height: ${props => props.height ?? 'auto'};
  width: ${props => props.width ?? 'auto'};
`;

export const CardWrapper = styled.div`
max-width: ${props => props.maxWidth ?? '400px'};
background-color: ${props => props.isDisabled ? 'lightgrey' : 'white'};
border: ${props => props.border ?? '1px solid rgba(0, 0, 0, 0.1)'};
border-radius: ${props => props.borderRadius ?? '8px'};
box-shadow: ${props => props.boxShadow ?? 'none'};
box-sizing: border-box;
cursor: ${props => props.onClick != null ? 'pointer' : 'default'};
height: ${props => props.height ?? 'auto'};
padding: ${props => props.padding ?? '16px'};
margin-bottom: 4px;
margin-right: ${props => props.marginRight ?? "0"};
margin-top: ${props => props.marginTop ?? "0"};
margin: ${props => props.margin ?? '0'};
width: ${props => props.width ?? 'auto'};
${props => props.onClick ?
  '&:hover {box-shadow: 0 0 15px rgba(0, 0, 0, 0.1)}'
  : ''
}
`;


