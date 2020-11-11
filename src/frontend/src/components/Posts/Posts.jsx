import React, { useContext, useRef } from 'react';
import { useSWRInfinite } from 'swr';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useBoundingclientrect from '@rooks/use-boundingclientrect';
import Timeline from './Timeline.jsx';
import useSiteMetaData from '../../hooks/use-site-metadata';
import { PostStateContext, PostStateDispatch } from '../../contexts/Post/PostContext';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    maxWidth: '785px',
  },
}));

const REFRESH_INTERVAL = 5 * 60 * 1000; /* refresh data every 5 minutes */

const Posts = () => {
  // ----------START -------
  const myRef = useRef();
  const getBoundingClientRect = useBoundingclientrect(myRef);
  const displayString = JSON.stringify(getBoundingClientRect, null, 2);

  const postsTop = useContext(PostStateContext);
  const setPostsTop = useContext(PostStateDispatch);

  // ----------END ---------
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetaData();
  const { data, size, setSize, error } = useSWRInfinite(
    (index) => `${telescopeUrl}/posts?page=${index + 1}`,
    (url) => fetch(url).then((r) => r.json()),
    {
      refreshInterval: REFRESH_INTERVAL,
    }
  );

  // TODO: need proper error handling
  if (error) {
    console.error('Error loading post data', error);
    return null;
  }

  return (
    <Container ref={myRef} className={classes.root}>
      <h1>{displayString}</h1>
      <Timeline pages={data} nextPage={() => setSize(size + 1)} />
    </Container>
  );
};

export default Posts;
