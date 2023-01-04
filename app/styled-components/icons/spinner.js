import styled from 'styled-components';

const Spinner = styled.svg`
  fill: ${props => props.fill ?? 'rgba(85, 82, 219, 1)'};
  height: ${props => props.height ?? '24px'};
  width: ${props => props.width ?? '24px'};
  margin: ${props => props.margin ?? '4px'};
  transform: ${props => props.transform ?? 'none'};
  transition: transform 1s;
  transition-timing-function: ease-out;
`;

export default Spinner;
