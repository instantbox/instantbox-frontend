import React from "react";
import { withTranslation } from 'react-i18next';

/**
 * Switch between languages
 */
class LanguageSwitcher extends React.Component {

  constructor(props) {
    super(props);
    this.t = props.t;
  }

  changeLanguage(e) {
    e.preventDefault();

    this.props.i18n.changeLanguage(e.target.dataset.locale)
  }

  render() {
    return <div className={this.props.className}>
      <p>
        <span>{this.t('language')} | </span>
        {
          this.t('locale') === 'en'
          ? <a href="?lng=zh" data-locale="zh" onClick={this.changeLanguage.bind(this)}>中文</a>
          : <a href="?lng=en" data-locale="en" onClick={this.changeLanguage.bind(this)}>English</a>
        }
      </p>
    </div>
  }
}

export default withTranslation()(LanguageSwitcher);
