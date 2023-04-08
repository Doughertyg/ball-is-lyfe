import React, {useState} from 'react';
import styled from 'styled-components';
import { CardBody, CardContentWrapper, CardWrapper } from '../styled-components/card';
import { BodyText, DetailsText, Divider, FlexContainer, PageHeader, SectionHeadingText } from '../styled-components/common';
import { Button } from '../styled-components/interactive';

const ModalBackground = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalWrapper = styled.div`
  align-items: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  position: absolute;
`;

/**
 * Stepped confirmation modal can show 1 or more prompts
 * with configurable next and cancel.
 * 
 * cancel steps back when the modal is beyond the first step
 * if the modal is on the first step the cancel button calls the onCancel prop
 * 
 * the next button displays the nextLabel and calls the onNext
 * callback and increments the step to the next step
 * 
 * ,-----------------------------------------,
 * |             Prompt Title                |
 * |     Prompt question or description      |
 * | ,------------,           ,------------, |
 * | |   Cancel   |           |    Next    | |
 * | '------------'           '------------' |
 * '-----------------------------------------'
 * 
 * @param steps Array
 * [{
 *   title: prompt title,
 *   text: prompt text,
 *   onNext: on next callback,
 *   nextLabel: next button label text,
 *   preventNext: boolean to prevent going to next
 * }]
 * 
 *
 */
const SteppedConfirmationModal = ({ steps, onCancel, onSubmit }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];

  const onBackOrCancel = () => {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
    } else {
      onCancel();
    }
  }

  const onNext = () => {
    if (step.preventNext) {
      step.onNext?.();
    } else if (stepIdx < steps.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      onSubmit?.();
    }
  }

  const nextLabel = step.preventNext ?
    (step.nextLabel ?? 'Done') :
    stepIdx < steps.length - 1 ?
      'Next' :
      'Confirm';

  return (
    <ModalBackground onClick={onCancel}>
      <ModalWrapper>
        <CardWrapper borderRadius="6px" boxShadow="0 0 5px 5px rgba(0, 0, 0, 0.1)" maxWidth="none">
          <CardContentWrapper onClick={(e) => e.stopPropagation()}>
            <CardBody align="center">
              <FlexContainer alignItems="center" direction="column">
                {step.title && <SectionHeadingText marginBottom="4px">{step.title}</SectionHeadingText>}
                <DetailsText marginBottom="10px" overflow="visible"><SectionHeadingText>{step.text}</SectionHeadingText></DetailsText>
                <FlexContainer justify="flex-end" width="100%">
                  {step.preventNext == null && <Button secondary onClick={onBackOrCancel}>{stepIdx > 0 ? 'Back' : 'Cancel'}</Button>}
                  <Button onClick={onNext} primary>{nextLabel}</Button>
                </FlexContainer>
              </FlexContainer>
            </CardBody>
          </CardContentWrapper>
        </CardWrapper>
      </ModalWrapper>
    </ModalBackground>
  )
}

export default SteppedConfirmationModal;
