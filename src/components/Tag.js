import {InlineMath} from 'react-katex';
import {makeStyles} from '@material-ui/core/styles';
import React from 'react';

export default function Tag(props) {
  const classes = makeStyles(theme => ({
    tag: {
      position: 'relative',
      right: props.right.toString() + 'vw',
      top: props.top.toString() + 'vh',
      height: 0
    }
  }))();

  return (
    <div className={classes.tag}><InlineMath>{'(' + props.children + ')'}</InlineMath></div>
  )
}

