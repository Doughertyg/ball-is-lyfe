import React, {useState} from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import Button from './Button.jsx';
import Icon from './Icon.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import { FETCH_POSTS_QUERY } from '../../graphql/queries/graphql.js';

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: String!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

function DeleteButton({ commentId, postId, navigateBackCallback }) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrComment, { loading }] = useMutation(mutation, {
    update(proxy) {
      setConfirmModalOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
        const newPosts = data.getPosts.filter((post) => post.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: newPosts} });
      }
      
      navigateBackCallback && navigateBackCallback();
    },
    onError(err) {
      console.log('error deleting: ', {err});
    },
    variables: {
      postId: postId,
      commentId
    }
  })

  return (
    <>
      <Button
        border="none"
        margin="0"
        onClick={() => setConfirmModalOpen(true)} width="100%">
        <Icon icon="trash" />
      </Button>
      {confirmModalOpen && (
        <ConfirmationModal
          isLoading={loading}
          label={"Are you sure you want to delete this " + (commentId != null ? "comment?" : "post?")}
          onCancel={() => setConfirmModalOpen(false)}
          onConfirm={() => deletePostOrComment()}
        />
      )}
    </>
  )
}

export default DeleteButton;
