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
        marginTop="4px"
        width={'165px'}
        onClick={onClick}>
        <CardContentWrapper>
          <PageHeader margin={'0 0 8px 0'}>{title}</PageHeader>
          <DetailsText>{subTitle}</DetailsText>
          <Divider />
          <CardBody>
            {bodyTitle && <DetailsText><SectionHeadingText>{bodyTitle}</SectionHeadingText></DetailsText>}
            {bodySubTitle && <DetailsText>{bodySubTitle}</DetailsText>}
            <BodyText marginTop={(bodyTitle || bodySubTitle) ? "8px" : "0"}>{body}</BodyText>
          </CardBody>
        </CardContentWrapper>
      </CardWrapper>
    </FadeInTransition>
  )
}

export default Card;
