import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import './OSList.scss';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

/**
 * os list 组件
 */
export class OSList extends PureComponent {
  static propTypes = {
    /**
     * OS 列表
     */
    osList: PropTypes.array
  };
  static defaultProps = {
    osList: []
  };

  render() {
    const { osList, onSelectOS, onSelectVersion } = this.props;

    if (!osList.length) {
      return <div>获取镜像中...</div>;
    }

    const selectedOS = osList.find(os => os.selected);
    console.log('selectedOS:', selectedOS);

    return (
      <div className="os-list">
        <div className="os-list__os">
          <List>
            {osList.map(os => (
              <Fragment key={os.label}>
                <ListItem
                  button
                  key={os.label}
                  className={classNames({
                    'os-list__os-btn--selected': os.selected
                  })}
                  onClick={() => onSelectOS(os)}
                >
                  <ListItemText primary={os.label} />
                </ListItem>
                <Divider />
              </Fragment>
            ))}
          </List>
        </div>
        <div className="os-list__version">
          <ul>
            {selectedOS.subList.map(version => (
              <div
                key={version.label}
                className="os-list__version--item"
                onClick={() => onSelectVersion(selectedOS, version)}
              >
                <Button color="primary">{version.label}</Button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default OSList;
