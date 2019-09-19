import {InlineMath} from 'react-katex';
import {makeStyles} from '@material-ui/core/styles';
import React from 'react';

export default function Tag(props) {
  const classes = makeStyles(theme => ({
    tag: {
      position: 'absolute',
      right: props.right.toString() + 'rem',
      top: props.top.toString() + 'rem'
    }
  }))();

  return (
    <div className={classes.tag}><InlineMath>{'(' + props.children + ')'}</InlineMath></div>
  )
}

