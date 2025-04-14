import React from 'react';
import styled from 'styled-components';

import { DetailsText, FlexContainer, PageHeader} from '../../styled-components/common';

const Wrapper = styled.img`
  height: calc(100vh - 44px);
`;

/**
 * Basic landing page for the app
 */
export default function SplashPage() {

  return (
    <FlexContainer alignContent="center" alignItems="center" direction="column" height="100%" justify="start">
      <Wrapper src="./logo-soft-level.png" />
    </FlexContainer>
  )
}
