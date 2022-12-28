import React from 'react';

import { DetailsText, FlexContainer, PageHeader} from '../../styled-components/common';

/**
 * Basic landing page for the app
 */
export default function SplashPage() {

  return (
    <FlexContainer alignContent="center" alignItems="center" direction="column" height="100%" justify="start">
      <PageHeader>StreetBall Stats</PageHeader>
      <DetailsText>Get your game on</DetailsText>
    </FlexContainer>
  )
}
