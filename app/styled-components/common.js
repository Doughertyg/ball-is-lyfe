import styled from 'styled-components';

export const ButtonContainer = styled.div`
&& {
  color: ${props => props.active ? 'teal' : 'black'};
  text-decoration: none;
  padding: 12px 8px;
  border-bottom: ${props => props.active ? '3px solid teal' : 'none'};
  box-sizing: border-box;
}
`;

export const CenteredContainer = styled.div`
margin: 0 auto;
text-align: center;
vertical-align: middle;
`;

export const CommonPageLayout = styled.div`
  color: black !important;
  font-family: Arial !important;
  max-width: 1000px;
  margin: 0 auto;
`;

export const DetailsText = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: DimGrey;
  cursor: pointer;
  margin-bottom: 6px;
  &:hover {
    color: teal;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  margin-bottom: ${props => props.marginBottom ?? 0};
`;

export const VerticalDivider = styled.div`
  width: 0;
  height: ${props => props.height ?? '100%'};
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  margin: ${props => props.margin ?? '0 10px'};
`;

export const FlexContainer = styled.div`
align-content: center;
display: flex;
margin: ${props => props.margin ?? 'initial'};
margin-bottom: ${props => props.marginBottom ?? 'initial'};
margin-top: ${props => props.marginTop ?? 'initial'};
flex-direction: row;
justify-content: ${props => props.justify ?? 'center'};
padding-top: ${props => props.paddingTop ?? '0px'};
width: ${props => props.width ?? 'auto'};
`;

export const PageHeader = styled.h1`
  font-weight: 600;
  font-size: 24px;
  margin: 20px 0;
`;

export const SectionHeadingText = styled.div`
font-size: 16px;
font-weight: 600;
margin-bottom: 8px;
margin-top: ${props => props.marginTop ?? 0}
`;
