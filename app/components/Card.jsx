import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {BodyText, DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText, VerticalDivider} from '../styled-components/common';
import {CardBody, CardContentWrapper, CardWrapper} from '../styled-components/card.js';
import FadeInTransition from './transitions/FadeInTransition.jsx';
import Icon from './Icon.jsx';
import Button from './Button.jsx';

import { AuthContext } from '../context/auth';
import DeleteButton from './DeleteButton.jsx';
import InputField from './InputField.jsx';

function Card({body, onClick, subTitle, title}) {
  return (
    <FadeInTransition>
      <CardWrapper height={'200px'} maxWidth={'200px'} onClick={onClick}>
        <CardContentWrapper>
          <PageHeader margin={'0 0 8px 0'}>{title}</PageHeader>
          <DetailsText>{subTitle}</DetailsText>
          <Divider />
          <CardBody><BodyText>{body}</BodyText></CardBody>
        </CardContentWrapper>
      </CardWrapper>
    </FadeInTransition>
  )
}

export default Card;
