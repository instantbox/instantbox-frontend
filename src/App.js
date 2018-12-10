import React, { Component } from 'react';
import './App.css';
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

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const systemList = [
  {
    label: 'Arch Linux',
    value: 'Arch Linux',
    subList: [
      {
        label: '2018.12.01 (x86_64, CLI-only)'
      }
    ]
  },
  {
    label: 'Debian',
    value: 'Debian',
    subList: [
      {
        label: '9.6.0 (amd64, CD installer with xfce)'
      },
      {
        label: '9.6.0 (i386, CD installer with xfce)'
      },
      {
        label: '9.6.0 (amd64, DVD installer (Part 3)) 1'
      },
      {
        label: '9.6.0 (amd64, DVD installer (Part 3)) 2'
      },
      {
        label: '9.6.0 (amd64, DVD installer (Part 2))'
      },
      {
        label: '9.6.0 (amd64, DVD installer (Part 1))'
      },
      {
        label: '9.6.0 (i386, DVD installer (Part 3))'
      },
      {
        label: '9.6.0 (i386, DVD installer (Part 2))'
      },
      {
        label: '9.6.0 (i386, DVD installer (Part 1))'
      },
      {
        label: '9.6.0 (amd64, Live CD with xfce)'
      },
      {
        label: '9.6.0 (amd64, Live CD with mate)'
      },
      {
        label: '9.6.0 (amd64, Live CD with lxde)'
      },
      {
        label: '9.6.0 (amd64, Live CD with kde)'
      },
      {
        label: '9.6.0 (amd64, Live CD with gnome)'
      },
      {
        label: '9.6.0 (amd64, Live CD with cinnamon)'
      },
      {
        label: '9.6.0 (i386, Live CD with xfce)'
      },
      {
        label: '9.6.0 (i386, Live CD with mate)'
      },
      {
        label: '9.6.0 (i386, Live CD with lxde)'
      },
      {
        label: '9.6.0 (i386, Live CD with kde)'
      },
      {
        label: '9.6.0 (i386, Live CD with gnome)'
      },
      {
        label: '9.6.0 (i386, Live CD with cinnamon)'
      }
    ]
  },
  {
    label: 'CentOS',
    value: 'CentOS',
    subList: [
      {
        label: '7 (x86_64, NetInstall) 1'
      },
      {
        label: '7 (x86_64, NetInstall) 2'
      },
      {
        label: '7 (x86_64, Minimal) 1'
      },
      {
        label: '7 (x86_64, Minimal) 2'
      },
      {
        label: '7 (x86_64, LiveKDE) 1'
      },
      {
        label: '7 (x86_64, LiveKDE) 2'
      },
      {
        label: '7 (x86_64, LiveGNOME) 1'
      },
      {
        label: '7 (x86_64, LiveGNOME) 2'
      },
      {
        label: '7 (x86_64, Everything) 1'
      },
      {
        label: '7 (x86_64, Everything) 2'
      },
      {
        label: '7 (x86_64, DVD) 1'
      },
      {
        label: '7 (x86_64, DVD) 2'
      },
      {
        label: '6.10 (x86_64, netinstall)'
      },
      {
        label: '6.10 (x86_64, minimal)'
      },
      {
        label: '6.10 (x86_64, bin-DVD2)'
      },
      {
        label: '6.10 (x86_64, bin-DVD1)'
      },
      {
        label: '6.10 (x86_64, bin-DVD)'
      },
      {
        label: '6.10 (i386, netinstall)'
      },
      {
        label: '6.10 (i386, minimal)'
      },
      {
        label: '6.10 (i386, bin-DVD2)'
      },
      {
        label: '6.10 (i386, bin-DVD1)'
      },
      {
        label: '6.10 (i386, bin-DVD)'
      }
    ]
  },
  {
    label: 'Fedora',
    value: 'Fedora',
    subList: [
      {
        label: '29 (x86_64, Workstation)'
      },
      {
        label: '29 (x86_64, KDE)'
      },
      {
        label: '28 (x86_64, Xfce)'
      },
      {
        label: '28 (x86_64, Workstation)'
      },
      {
        label: '28 (x86_64, KDE)'
      }
    ]
  },
  {
    label: 'Ubuntu',
    value: 'Ubuntu',
    subList: [
      {
        label: '18.10 (amd64, Desktop LiveDVD)'
      },
      {
        label: '18.04.1 (amd64, Desktop LiveDVD)'
      },
      {
        label: '16.04.5 (amd64, Desktop LiveDVD)'
      },
      {
        label: '16.04.5 (i386, Desktop LiveDVD)'
      },
      {
        label: '14.04.5 (amd64, Desktop LiveDVD)'
      },
      {
        label: '14.04.5 (i386, Desktop LiveDVD)'
      },
      {
        label: '18.10 (amd64, Server)'
      },
      {
        label: '18.04.1.0 (amd64, Server)'
      },
      {
        label: '18.04.1 (amd64, Server)'
      },
      {
        label: '16.04.5 (amd64, Server)'
      },
      {
        label: '16.04.5 (i386, Server)'
      },
      {
        label: '14.04.5 (amd64, Server)'
      },
      {
        label: '14.04.5 (i386, Server)'
      },
      {
        label: '12.04.5 (amd64, Server)'
      },
      {
        label: '12.04.5 (i386, Server)'
      }
    ]
  },
  {
    label: 'Ubuntu 衍生版',
    value: 'Ubuntu 衍生版',
    subList: [
      {
        label: 'Ubuntu Kylin 18.10 (amd64)'
      },
      {
        label: 'Kubuntu 18.10 (amd64)'
      },
      {
        label: 'Lubuntu 18.10 (amd64)'
      },
      {
        label: 'Lubuntu 18.10 (i386)'
      },
      {
        label: 'Xubuntu 18.10 (amd64)'
      },
      {
        label: 'Xubuntu 18.10 (i386)'
      },
      {
        label: 'Ubuntu Gnome 16.04.5 (amd64)'
      },
      {
        label: 'Ubuntu Gnome 16.04.5 (i386)'
      },
      {
        label: 'Ubuntu Mate 18.10 (amd64)'
      }
    ]
  },
  {
    label: 'Deepin',
    value: 'Deepin',
    subList: [
      {
        label: '15.8 (amd64)'
      }
    ]
  },
  {
    label: 'LineageOS',
    value: 'LineageOS',
    subList: [
      {
        label: '20181126 (otus, 14.1)'
      },
      {
        label: '20181130 (bardockpro, 15.1)'
      },
      {
        label: '20181129 (r5, 15.1)'
      },
      {
        label: '20181110 (pme, 14.1)'
      },
      {
        label: '20181111 (v1awifi, 14.1) 1'
      },
      {
        label: '20181111 (v1awifi, 14.1) 2'
      },
      {
        label: '20181031 (d850, 14.1)'
      },
      {
        label: '20181130 (angler, 15.1)'
      },
      {
        label: '20181107 (addison, 14.1)'
      },
      {
        label: '20181129 (santoni, 15.1)'
      }
    ]
  },
  {
    label: 'openSUSE',
    value: 'openSUSE',
    subList: [
      {
        label: '42.3 (x86_64)'
      },
      {
        label: '42.2 (x86_64)'
      },
      {
        label: '15.0 (x86_64)'
      },
      {
        label: 'Tumbleweed (x86_64, KDE-Live)'
      },
      {
        label: 'Tumbleweed (x86_64, GNOME-Live)'
      },
      {
        label: 'Tumbleweed (x86_64, DVD)'
      },
      {
        label: 'Tumbleweed (i686, KDE-Live)'
      },
      {
        label: 'Tumbleweed (i686, GNOME-Live)'
      },
      {
        label: 'Tumbleweed (i586, DVD)'
      }
    ]
  }
];

class App extends Component {
  state = {
    open: false,
    expanded: '',
    selectedSystem: 'Arch Linux'
  };

  componentDidMount = () => {
    this.typed = new Typed('.app__desc-content', {
      strings: [
        `Want to experiment with something on a Linux distribution? Let's start!`
      ],
      typeSpeed: 50
    });
  };

  handleStartClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSystemChange = e => {
    console.log('e:', e);
  };

  render() {
    const { open, selectedSystem, expanded } = this.state;
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
            start!
          </Button>
        </div>

        <div className="app__choose-system-modal">
          <Modal open={open} onClose={this.handleClose}>
            <div className="app__system-wrap">
              <h2 className="app__system-wrap-title">
                Select operating system
              </h2>
              <div className="app__system-wrap-body">
                {systemList.map(system => {
                  return (
                    <ExpansionPanel
                      key={system.value}
                      expanded={expanded === system.label}
                      onChange={() =>
                        this.setState({
                          expanded:
                            expanded && expanded === system.label
                              ? ''
                              : system.label
                        })
                      }
                    >
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{system.label}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <ul>
                          {system.subList.map(subItem => (
                            <li key={subItem.label}>{subItem.label}</li>
                          ))}
                        </ul>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                })}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
