import styled from 'styled-components';

export const ButtonContainer = styled.div`
  color: ${props => props.active ? 'teal' : 'black'};
  text-decoration: none;
  padding: ${props => props.padding ?? "12px 8px"};
  border-bottom: ${props => props.active ? '3px solid teal' : 'none'};
  box-sizing: border-box;
`;

export const CenteredContainer = styled.div`
margin: 0 auto;
text-align: center;
vertical-align: middle;
`;

export const CommonPageLayout = styled.div`
  background-color: rgba(239, 239, 239, 0.25);
  color: black !important;
  font-family: Arial !important;
  height: 100vh;
  width: 100vw;
  margin: 0 auto;
`;

export const DetailsText = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: DimGrey;
  cursor: pointer;
  margin-bottom: 6px;
  margin: ${props => props.margin ?? 'initial'};
  &:hover {
    color: teal;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: ${props => props.marginTop ?? "10px"};
  margin-bottom: ${props => props.marginBottom ?? 0};
`;

export const VerticalDivider = styled.div`
  width: 0;
  height: ${props => props.height ?? '100%'};
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  margin: ${props => props.margin ?? '0 10px'};
`;

export const FlexContainer = styled.div`
align-content: ${props => props.alignContent ?? 'center'};
align-items: ${props => props.alignItems ?? "initial"};
background-color: ${props => props.backgroundColor ?? 'initial'};
display: flex;
flex-wrap: ${props => props.flexWrap ?? 'initial'};
height: ${props => props.height ?? 'auto'};
margin: ${props => props.margin ?? 'initial'};
margin-bottom: ${props => props.marginBottom ?? 'initial'};
margin-top: ${props => props.marginTop ?? 'initial'};
max-width: ${props => props.maxWidth ?? 'initial'};
min-width: ${props => props.minWidth ?? 'initial'};
flex-direction: ${props => props.direction ?? 'row'};
justify-content: ${props => props.justify ?? 'center'};
padding-top: ${props => props.paddingTop ?? '0px'};
width: ${props => props.width ?? 'auto'};
overflow: ${props => props.overFlow ?? 'auto'};
`;

export const ScrollableContainer = styled.div`
border-radius: ${props => props.borderRadius ?? "8px"};
border: ${props => props.border ?? "1px solid rgba(0, 0, 0, 0.1)"};
max-height: ${props => props.maxHeight ?? "88px"};
height: ${props => props.height ?? "auto"};
overflow: scroll;
width: ${props => props.width ?? "auto"};
`;

export const PageHeader = styled.h1`
  font-weight: 600;
  font-size: 24px;
  margin: ${props => props.margin ?? "20px 0"};
`;

export const SectionHeadingText = styled.div`
font-size: 16px;
font-weight: 600;
margin-bottom: 8px;
margin: ${props => props.margin ?? 0}
`;

export const BodyText = styled.div`
font-size: 16px;
overflow: hidden;
text-align: left;
text-overflow: ellipsis;
white-space: pre-line;
display: -webkit-box;
-webkit-line-clamp: 5;
-webkit-box-orient: vertical; 
`;

export const ModalStyle = styled.div`
  position: absolute;
  border-radius: 6px;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.07);
  background-color: white;
  width: 100%;
  z-index: 1000;
`;

export const ProfilePictureThumb = styled.img`
  border-radius: 50%;
  height: 32px;
  margin: ${props => props.margin ?? "4px"};
  width: 32px;
`;
