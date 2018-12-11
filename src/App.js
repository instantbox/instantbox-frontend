import React, { Component } from 'react';
import './App.scss';
import Button from '@material-ui/core/Button';
import Typed from 'typed.js';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import OSList from './components/OSList';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getOSList, getOSUrl } from './util/api';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '@material-ui/core/TextField';

class App extends Component {
  state = {
    open: false,
    expanded: '',
    selectedSystem: 'Arch Linux',
    osList: [],
    selectedVersion: {},
    selectedOS: {},
    timeout: 0,
    cpu: 1,
    memory: 0.5,
    port: 80
  };

  componentDidMount = () => {
    this.getOSList();

    this.typed = new Typed('.app__desc-content', {
      strings: [
        `Want to experiment with something on a Linux distribution? Let's start!`
      ],
      typeSpeed: 50
    });
  };

  getOSList = async () => {
    this.p1 = getOSList();
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      return console.error(err);
    }
    const osList = res;
    if (osList.length) {
      osList[0].selected = true;
    }
    this.setState({ osList });
  };

  handleStartClick = () => {};

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOSSelect = selectedOS => {
    const osList = [...this.state.osList];

    const i = osList.findIndex(os => selectedOS.label === os.label);

    osList.forEach((os, j) => {
      if (i === j) {
        os.selected = false;
      }
      os.selected = i === j;
    });
    this.setState({ osList });
  };

  handleOSVersionSelect = (selectedOS, selectedVersion) => {
    this.setState({
      open: true,
      selectedOS,
      selectedVersion
    });
  };

  handleDialogConfirm = async () => {
    const { timeout, cpu, memory, selectedVersion, port } = this.state;
    const t = Math.floor(new Date().getTime() / 1000) + timeout * 60;
    this.p2 = getOSUrl(selectedVersion.osCode, t, cpu, memory, port);
    if (timeout || cpu || memory) {
      let res;
      try {
        res = await this.p2.promise;
      } catch (err) {
        return console.error(err);
      }
      window.open(res.shareUrl);
      this.setState({ timeout: 0, cpu: 1, memory: 0.5, port: 80 });
    }
  };

  handleTextFieldChange = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value });
  };

  render() {
    const {
      open,
      selectedSystem,
      expanded,
      osList,
      selectedOS,
      selectedVersion,
      timeout,
      cpu,
      memory,
      port
    } = this.state;
    return (
      <div className="app">
        <h1 className="app__title">super inspire</h1>
        <div className="app__desc">
          <div className="app__text-editor-wrap">
            <div className="app__title-bar">
              Arch
              Linux/Debian/CentOS/Defora/Ubuntu/Ubuntu衍生版/Deepin/LineageOS/openSUSE
            </div>
            <div className="app__text-body">
              <span style={{ marginRight: 10 }}>$</span>
              <span className="app__desc-content" />
            </div>
          </div>
        </div>
        <div className="app__start">
          <Button
            size="large"
            color="default"
            variant="outlined"
            onClick={this.handleStartClick}
          >
            ↓ 开始 ↓
          </Button>
        </div>

        <div className="app__os-list">
          <OSList
            osList={osList}
            onSelectOS={this.handleOSSelect}
            onSelectVersion={this.handleOSVersionSelect}
          />
        </div>

        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {selectedOS.label} {selectedVersion.label}
          </DialogTitle>
          <DialogContent>
            <TextField
              className="app__text-field"
              fullWidth
              value={port}
              disabled
              label="端口号"
              type="number"
            />
            <TextField
              className="app__text-field"
              label="使用时间"
              type="number"
              fullWidth
              value={timeout}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">分</InputAdornment>
                )
              }}
              required
              onChange={e => this.handleTextFieldChange(e, 'timeout')}
            />
            <TextField
              className="app__text-field"
              label="CPU 核数"
              type="number"
              fullWidth
              value={cpu}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">核</InputAdornment>
                )
              }}
              required
              onChange={e => this.handleTextFieldChange(e, 'cpu')}
            />
            <TextField
              className="app__text-field"
              label="空间大小"
              type="number"
              fullWidth
              value={memory}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">GB</InputAdornment>
                )
              }}
              required
              onChange={e => this.handleTextFieldChange(e, 'memory')}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ open: false })}
              color="primary"
            >
              取消
            </Button>
            <Button onClick={this.handleDialogConfirm} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
