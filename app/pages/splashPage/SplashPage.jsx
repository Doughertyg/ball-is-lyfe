import React from 'react';

import { DetailsText, FlexContainer, PageHeader} from '../../styled-components/common';

/**
 * Basic landing page for the app
 */
export default function SplashPage() {

  return (
    <FlexContainer alignContent="center" alignItems="center" direction="column" justify="flex-start">
      <PageHeader>StreetBall Stats</PageHeader>
      <DetailsText>Get your game on</DetailsText>
    </FlexContainer>
  )
}
