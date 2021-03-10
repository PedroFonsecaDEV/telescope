import { useRef, useState } from 'react';
import useSWR from 'swr';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Grid, Typography, ListSubheader, createStyles } from '@material-ui/core';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import { Post } from '../../interfaces';
import AdminButtons from '../AdminButtons';
import Spinner from '../Spinner';

type Props = {
  postUrl: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      fontSize: '1.5rem',
      marginBottom: '4em',
      backgroundColor: theme.palette.background.default,
    },
    titleContainer: {
      gridArea: 'title',
      backgroundColor: 'yellow',
      color: theme.palette.text.secondary,
      padding: '2em 0 1.5em',
      lineHeight: '1.3',
      top: '-.1em',
      fontSize: '0.9em',
      zIndex: 1000,
      [theme.breakpoints.down(1200)]: {},
    },
    expandHeader: {
      whiteSpace: 'normal',
      cursor: 'pointer',
    },
    collapseHeader: {
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    },
    title: {
      fontSize: '3em',
      fontWeight: 'bold',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      letterSpacing: '-3px',
      [theme.breakpoints.down(1200)]: {},
    },
    author: {
      position: 'absolute',
      borderLeft: '2.5px solid #707070',
      fontSize: '2em',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    published: {
      position: 'absolute',
      fontSize: '1.5em',
      fontWeight: 'lighter',
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    content: {
      overflow: 'auto',
      padding: '1em',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
      width: '95%',
      [theme.breakpoints.down(1024)]: {},
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    time: {
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    spinner: {
      padding: '20px',
    },
    error: {
      lineHeight: '1',
      fontSize: '1em',
    },
    postInfo: {
      display: 'grid',
      gridTemplateAreas: "'title title title''. . avatar''. . author''. . date'",
      [theme.breakpoints.down(1200)]: {},
    },
    authorNameContainer: {
      gridArea: 'author',
      width: 'calc(100% - 2em)',
      [theme.breakpoints.down(1200)]: {},
      [theme.breakpoints.down(1024)]: {},
    },
    publishedDateContainer: {
      gridArea: 'date',
      [theme.breakpoints.down(1200)]: {},
    },
    authorAvatarContainer: {
      gridArea: 'avatar',
      shapeOutside: 'circle(50%) border-box',
      shapeMargin: '1rem',
      borderRadius: '50%',
      paddingBottom: '1em',
      [theme.breakpoints.down(1200)]: {},
    },
    circle: {
      position: 'absolute',
      marginLeft: '10em',
      display: 'block',
      borderRadius: '50%',
      backgroundColor: '#121D59',
      width: '8em',
      height: '8em',
      [theme.breakpoints.down(1200)]: {},
      [theme.breakpoints.down(1024)]: {},
    },
  })
);

const formatPublishedDate = (dateString: string) => {
  const date: Date = new Date(dateString);
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const PostComponent = ({ postUrl }: Props) => {
  const classes = useStyles();
  // We need a ref to our post content, which we inject into a <section> below.
  const sectionEl = useRef<HTMLElement>(null);
  // Grab the post data from our backend so we can render it
  const { data: post, error } = useSWR<Post>(postUrl);
  const [expandHeader, setExpandHeader] = useState(false);

  if (error) {
    console.error(`Error loading post at ${postUrl}`, error);
    return (
      <Box className={classes.root}>
        <ListSubheader className={classes.titleContainer}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            <Grid container className={classes.error}>
              <Grid item>
                <ErrorRoundedIcon className={classes.error} />
              </Grid>{' '}
              - Post Failed to Load
            </Grid>
          </Typography>
        </ListSubheader>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box className={classes.root}>
        <ListSubheader className={classes.titleContainer}>
          <AdminButtons />
          <Typography variant="h1" className={classes.title}>
            Loading Blog...
          </Typography>
        </ListSubheader>

        <Grid container justify="center">
          <Grid item className={classes.spinner}>
            <Spinner />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <ListSubheader className={classes.postInfo}>
        <AdminButtons />
        <div className={classes.titleContainer}>
          <Typography variant="h1" title={post.title} id={post.id} className={classes.title}>
            <span
              role="button"
              tabIndex={0}
              onClick={() => setExpandHeader(!expandHeader)}
              onKeyDown={() => setExpandHeader(!expandHeader)}
              className={expandHeader ? classes.expandHeader : classes.collapseHeader}
            >
              {post.title}
            </span>
          </Typography>
        </div>
        <div className={classes.authorAvatarContainer}>
          <div className={classes.circle} />
        </div>
        <div className={classes.authorNameContainer}>
          <Typography variant="subtitle2" className={classes.author}>
            <a className={classes.link} href={post.feed.link}>
              {post.feed.author}
            </a>
          </Typography>
        </div>
        <div className={classes.publishedDateContainer}>
          <a href={post.url} rel="bookmark" className={classes.published}>
            <time className={classes.time} dateTime={post.updated}>
              {` ${formatPublishedDate(post.updated)}`}
            </time>
          </a>
        </div>
      </ListSubheader>
      <div className={classes.content}>
        <section
          ref={sectionEl}
          className="telescope-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </Box>
  );
};

export default PostComponent;
