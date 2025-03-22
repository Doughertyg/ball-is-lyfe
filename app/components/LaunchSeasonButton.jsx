import React from 'react';
import { ButtonTW } from './Button.jsx';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import dayjs from 'dayjs';

const LAUNCH_SEASON_MUTATION = gql`
  mutation launchSeasonMutation(
    $seasonID: ID!
  ) {
    launchSeason(
      seasonID: $seasonID
    ) {
      id
      name
      status
    }
  }
`;

/**
 * Launch season button for launching a season that is confirmed
 * - renders a simple button if season is confirmed and user is admin
 * - allows admin to launch season
 */
const LaunchSeasonButton = ({ onComplete, onError, seasonEnd, seasonID, seasonStart, variant = 'flat' }) => {
  const [launchSeason, {isSubmitting}] = useMutation(LAUNCH_SEASON_MUTATION, {
    onCompleted: res => {
      onComplete?.(res.launchSeason);
    },
    onError: error => {
      console.log('stringified error on mutation:  ', JSON.stringify(error, null, 2));
      onError?.(error.message ?? 'Error launching season, please try again.');
    }
  })

  const onSubmit = () => {
    onError(null);
    launchSeason({
      variables: {
        seasonID
      }
    });
  }

  const start = dayjs(seasonStart).format('MMM YYYY');
  const end = dayjs(seasonEnd).format('MMM YYYY');

  const isDisabled = dayjs().isAfter(end) || dayjs().isBefore(start);

  return (
    <ButtonTW
      isDisabled={isDisabled}
      isLoading={isSubmitting}
      label="Launch"
      onClick={onSubmit}
      variant={variant}
      tooltip={isDisabled && !isSubmitting ? 'Season cannot be launched outside of the season start and end dates' : null}
    />
  )
}

export default LaunchSeasonButton;
