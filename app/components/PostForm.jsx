import React, {useState} from 'react';
import { CardContentWrapper, CardWrapper } from '../styled-components/card';
import { ButtonContainer, Divider } from '../styled-components/common';
import { Button } from '../styled-components/interactive';
import InputField from './InputField.jsx';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body 
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body 
        username
        createdAt
      }
    }
  }
`;

function PostForm() {
  const [ postText, setPostText ] = useState('');
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: { body: postText },
    update(_, result) {
      console.log(result);
      setPostText('');
    }
  })

  return (
    <CardWrapper height="300px" marginTop="64px">
      <CardContentWrapper width="400px">
        <h2>New Post</h2>
        <Divider marginBottom="10px" />
        <InputField
          height="200px"
          maxLength={256}
          minLength={1}
          name="New Post"
          onChange={setPostText}
          placeholder="Create a new post..."
          width="400px"
          value={postText}
        />
        <Divider />
        <ButtonContainer>
          <Button onClick={createPost}>Post</Button>
        </ButtonContainer>
      </CardContentWrapper>
    </CardWrapper>
  )
}

export default PostForm;
