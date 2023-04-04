import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${props => props.primary ? 'lightskyblue' : props.secondary ? 'lightgrey' : 'white'};
  border: ${props => props.border ?? '1px solid rgba(0, 0, 0, 0.1)'};
  border-radius: ${props => props.borderRadius ?? "4px"};
  color: ${props => props.primary || props.secondary ? 'white' : 'black'};
  disabled: ${props => props.disabled ?? 'initial'};
  height: ${props => props.height ?? 'auto'};
  padding: 8px 20px;
  cursor: ${props => props.cursor ?? 'pointer'};
  margin: ${props => props.margin ?? '4px'};
  margin-top: ${props => props.marginTop ?? 0};
  width: ${props => props.width ?? 'auto'};
  box-shadow: ${props => props.boxShadow ?? "0 0 10px rgba(0, 0, 0, 0.07)"};
  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  }
  &:active {
    background-color: teal;
    color: white;
  }
  ${props => props.primary 
    ? '&:hover { background-color: dodgerblue }' 
    : ''
  }
  ${props => props.secondary
    ? '&:hover { background-color: darkgrey }'
    : ''
  }
`;

export const Clickable = styled.div`
border-radius: ${props => props.borderRadius ?? "0"};
cursor: pointer;
&:hover {
  stroke: white;
  fill: black;
}
`;

export const Input = styled.input`
  border-radius: ${props => props.borderRadius ?? "8px"};
  box-sizing: border-box;
  border: ${props => props.errors != null ? "1px solid red" : "1px solid rgba(0, 0, 0, 0.1)"};
  height: ${props => props.height ?? 'auto'};
  width: ${props => props.width ?? '100%'};
  margin: ${props => props.margin ?? 'initial'};
  max-width: ${props => props.maxWidth ?? "400px"};
  line-height: 20px;
  padding: 12px;
  transition: width .24s;
  transition-timing-function: ease-out;
`;

export const InputError = styled.div`
  box-sizing: border-box;
  font-size: 12px;
  color: red;
  padding: 4px;
  max-width: ${props => props.maxWidth ?? "400px"};
`;

export const ErrorList = styled.ul`
  color: red;
  list-style-type: disc;
  text-align: left;
`;

export const ErrorListWrapper = styled.div`  
  background-color: rgba(250, 0, 0, 0.2);
  border: 1px solid red;
  padding: 20px;
  max-width: 300px;
`;

export const TransitionComponent = styled.div`
  transition: ${props => props.property ?? 'width' + props.duration ?? '2s'};
  transition-timing-function: ${props => props.timing ?? 'ease-in'};
`;
