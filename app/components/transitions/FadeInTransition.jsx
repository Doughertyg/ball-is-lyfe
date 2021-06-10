import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Transition = styled.div`
  opacity: ${props => props.opacity ?? 0};
  transition: opacity 2s;
`;

function FadeInTransition({ children, opacity: opacityProp }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    console.log('setting opacity to 1', opacity, 'opacity prop: ', opacityProp);
    setOpacity(opacityProp ?? '100%');
    
    return () => {
      setOpacity(0);
    }
  }, []);

  return (
    <Transition opacity={opacity}>
      {children}
    </Transition>
  )
}

export default FadeInTransition;
