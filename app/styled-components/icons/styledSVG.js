import styled from 'styled-components';

const StyledSVG = styled.svg`
  fill: ${props => props.fill ?? 'black'};
  height: ${props => props.height ?? "24px"};
  margin: ${props => props.margin ?? "4px"};
  width: ${props => props.width ?? "24px"};
`;

export default StyledSVG;
