import React from 'react';

import {BodyText, DetailsText, Divider, PageHeader, SectionHeadingText} from '../styled-components/common';
import {CardBody, CardContentWrapper, CardWrapper} from '../styled-components/card.js';
import FadeInTransition from './transitions/FadeInTransition.jsx';

function Card({body, bodyTitle, bodySubTitle, margin, onClick, subTitle, title}) {
  return (
    <FadeInTransition>
      <CardWrapper
        boxShadow="0 0 10px rgba(0, 0, 0, 0.07)"
        height={'200px'}
        margin={margin}
        width={'165px'}
        onClick={onClick}>
        <CardContentWrapper>
          <PageHeader margin="0">{title}</PageHeader>
          {bodyTitle && <DetailsText overflow="hidden"><SectionHeadingText>{bodyTitle}</SectionHeadingText></DetailsText>}
          {bodySubTitle && <DetailsText marginBottom="4px" overflow="hidden">{bodySubTitle}</DetailsText>}
          <DetailsText overflow="hidden">{subTitle}</DetailsText>
          <Divider />
          <CardBody>
            <BodyText>{body}</BodyText>
          </CardBody>
        </CardContentWrapper>
      </CardWrapper>
    </FadeInTransition>
  )
}

export default Card;
