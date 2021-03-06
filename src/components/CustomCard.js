import {Card, CardContent, CardHeader, Collapse, IconButton, Typography} from '@material-ui/core';
import classNames from 'classnames';
import {ExpandMore} from '@material-ui/icons';
import React from 'react';

export default function CustomCard(props) {
  const [expanded, setExpanded] = React.useState(props.expanded);

  function handleExpandClick() {
    setExpanded(!expanded);
  }
  return (
    <Card className={props.className}>
      <CardHeader
        className={'card__header'}
        disableTypography={true}
        title={
          <div className={'card__header__content'}>
            <Typography variant={'h5'} className={'card__header__title'}>
              {props.title}
            </Typography>
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              className={classNames('card__header__expand', expanded ? 'card__header__expand--open' : '')}
            >
              <ExpandMore />
            </IconButton>
          </div>
        }
        avatar={props.avatar}
      />
      <Collapse in={expanded}>
        <CardContent>{props.children}</CardContent>
      </Collapse>
    </Card>
  );
}
