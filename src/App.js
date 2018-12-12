import React, { Component } from 'react';
import './App.scss';
import Button from '@material-ui/core/Button';
import Typed from 'typed.js';

import OSList from './components/OSList';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getOSList, getOSUrl } from './util/api';
import InputAdornment from '@material-ui/core/InputAdornment';

import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/lab/Slider';
import InputLabel from '@material-ui/core/InputLabel';

class App extends Component {
  state = {
    open: false,
    osList: [],
    selectedVersion: {},
    selectedOS: {},
    timeout: 24,
    cpu: 1,
    memory: 512,
    port: 80,
    containers: []
  };

  componentDidMount = () => {
    this.getOSList();
    this.subscribeEvent();

    this.typed = new Typed('.app__desc-content', {
      strings: [
        `Want to experiment with something on a Linux distribution? Let's start!`
      ],
      typeSpeed: 50
    });
  };

  componentWillUnmount = () => {};

  subscribeEvent = () => {
    window.onbeforeunload = function() {
      const container = this.state.containers[0];
      var xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        `http://115.238.228.39:65500/v1/superspire/rmOS?containerId=${
          container.containerId
        }&shareUrl=${container.shareUrl}&timestamp=${Math.floor(
          new Date().getTime() / 1000
        )}`,
        false
      );
      xhr.onload = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log(xhr.responseText);
          } else {
            console.error(xhr.statusText);
          }
        }
      };
      xhr.onerror = function(e) {
        console.error(xhr.statusText);
      };
      xhr.send(null);
      return '1111';
    };
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
    const t = Math.floor(new Date().getTime() / 1000) + timeout * 60 * 60;
    this.p2 = getOSUrl(selectedVersion.osCode, t, cpu, memory, port);
    if (timeout || cpu || memory) {
      let res;
      try {
        res = await this.p2.promise;
      } catch (err) {
        return console.error(err);
      }
      this.setState({
        open: false,
        containers: [...this.state.containers, res]
      });
      window.open(res.shareUrl);
    }
  };

  handleTextFieldChange = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value });
  };

  render() {
    const {
      open,
      osList,
      selectedOS,
      selectedVersion,
      timeout,
      cpu,
      memory
    } = this.state;
    return (
      <div className="app">
        <h1 className="app__title">
          <span className="app__title-span">
            Super Inspire
            {/* <span className="app__title-icon" /> */}
          </span>
        </h1>
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
            {/* <TextField
              className="app__text-field"
              fullWidth
              value={port}
              disabled
              label="端口号"
              type="number"
            /> */}
            <div>
              <InputLabel style={{ fontSize: 12 }}>使用时间</InputLabel>
              <div>
                <div style={{ padding: '8px 0' }}>
                  <Slider
                    value={timeout}
                    aria-labelledby="label"
                    onChange={(e, value) => {
                      this.setState({ timeout: value });
                    }}
                    max={24}
                    min={1}
                    step={1}
                  />
                </div>

                <div
                  style={{
                    borderBottom: '1px dotted #949494',
                    paddingBottom: 8
                  }}
                >
                  <span style={{ color: '#9f9f9f', fontSize: 12 }}>小时</span>
                  <span style={{ marginLeft: 16 }}>{timeout}</span>
                </div>
              </div>
            </div>

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
              disabled
              // onChange={e => this.handleTextFieldChange(e, 'cpu')}
            />
            <TextField
              className="app__text-field"
              label="空间大小"
              type="number"
              fullWidth
              value={memory}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">MB</InputAdornment>
                )
              }}
              disabled
              // onChange={e => this.handleTextFieldChange(e, 'memory')}
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
