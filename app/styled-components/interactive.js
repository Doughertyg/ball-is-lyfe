import styled from 'styled-components';

export const Button = styled.button`
  background-color: white;
  border: ${props => props.border ?? '1px solid dimgrey'};
  border-radius: 0;
  height: ${props => props.height ?? 'auto'};
  padding: 8px 20px;
  margin: ${props => props.margin ?? '4px'};
  margin-top: ${props => props.marginTop ?? 0};
  width: ${props => props.width ?? 'auto'};
  &:hover {
    background-color: teal;
    color: white;
  }
  &:active {
    color: black;
    background-color: white;
  }
`;

export const Clickable = styled.div`
&:hover {
  background-color: teal;
  color: white;
}
`;

export const Input = styled.input`
  border-radius: 8px;
  box-sizing: border-box;
  border: ${props => props.errors != null ? "1px solid red" : "1px solid rgba(0, 0, 0, 0.1)"};
  height: ${props => props.height ?? 'auto'};
  width:${props => props.width ?? '100%'};
  max-width: ${props => props.maxWidth ?? "400px"};
  line-height: 20px;
  padding: 12px;
`;

export const InputError = styled.div`
  border: 1px solid red;
  border-top: none;
  box-sizing: border-box;
  background-color: rgba(250, 0, 0, 0.04);
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
