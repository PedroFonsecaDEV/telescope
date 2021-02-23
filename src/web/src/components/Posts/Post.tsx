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
      fontFamily: 'Spartan',
      padding: 0,
      fontSize: '1.5rem',
      marginBottom: '4em',
      backgroundColor: theme.palette.background.default,
      border: '15px solid gray',
    },
    header: {
      border: '5px solid red',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.secondary,
      padding: '2em 3em 1.5em 3em',
      lineHeight: '1.3',
      zIndex: 1100,
      top: '-1.1em',
      [theme.breakpoints.down(1440)]: {
        paddingTop: '1.6em',
        paddingBottom: '1em',
      },
      [theme.breakpoints.down(1065)]: {
        position: 'static',
      },
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
      fontSize: '3.5em',
      fontWeight: 'bold',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      [theme.breakpoints.between('xs', 'sm')]: {
        fontSize: '2.5em',
      },
    },
    author: {
      fontSize: '2em',
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.down(1440)]: {
        fontSize: '1.2em',
        // alignSelf: 'flex-start',
      },
    },
    published: {
      fontSize: '1.8em',
      textDecoration: 'none',
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.between('xs', 'sm')]: {
        fontSize: '1em',
        // alignSelf: 'flex-end',
      },
    },
    content: {
      overflow: 'auto',
      border: '10px solid blue',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      width: '100%',
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.primary.contrastText,
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
      lineHeight: '1.00',
      fontSize: '1em',
    },
    test: {
      backgroundColor: 'purple',
      color: 'white',
      width: '200px',
      height: '200px',
      float: 'right',
      marginRight: '-24em',
      top: '8em',
      bottom: '100%',
      [theme.breakpoints.down(1440)]: {
        backgroundColor: 'blue',
        display: 'flex',
        // flexDirection: 'row',
        width: '100%',
        height: '2%',
        float: 'none',
        top: '6em',
      },
    },
    authorContainer: {
      backgroundColor: 'green',
      padding: '0.5em',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '4px solid white',
      [theme.breakpoints.down(1440)]: {
        backgroundColor: 'blue',
        flexDirection: 'row',
        borderLeft: 'none',
      },
    },
    authorAvatarContainer: {
      shapeOutside: 'circle(50%) border-box',
      shapeMargin: '1rem',
      borderRadius: '50%',
      float: 'left',
      [theme.breakpoints.down(1440)]: {
        float: 'none',
      },
    },
    circle: {
      display: 'block',
      borderRadius: '50%',
      backgroundColor: 'white',
      width: '8em',
      height: '8em',
      [theme.breakpoints.down(1440)]: {
        margin: '0.5em 0',
      },
    },
  })
);

const formatPublishedDate = (dateString: string) => {
  const date: Date = new Date(dateString);
  const formatted = new Intl.DateTimeFormat('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  return `Last Updated ${formatted}`;
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
      <Box className={classes.root} boxShadow={2}>
        <ListSubheader className={classes.header}>
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
      <Box className={classes.root} boxShadow={2}>
        <ListSubheader className={classes.header}>
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
      <ListSubheader className={classes.header}>
        <AdminButtons />
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
      </ListSubheader>
      <ListSubheader className={classes.test}>
        <div className={classes.authorContainer}>
          <div className={classes.authorAvatarContainer}>
            <div className={classes.circle} />
          </div>
          <div>
            <Typography variant="caption" className={classes.author}>
              <a className={classes.link} href={post.feed.url}>
                {post.feed.author}
              </a>
            </Typography>
          </div>
          <div>
            <a href={post.url} rel="bookmark" className={classes.published}>
              <time className={classes.time} dateTime={post.updated}>
                {` ${formatPublishedDate(post.updated)}`}
              </time>
            </a>
          </div>
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
