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

  render()
    {
    	if (this.t('locale') === 'en') {
    		return (
        		<div className={this.props.className}> 
        			<p>
        				<span>{this.t('language')}
        					<a> | </a>
        					<a href="?lng=fr" data-locale="fr" onClick={this.changeLanguage.bind(this)}>Français</a>
        					<a> | </a>
        					<a href="?lng=zh" data-locale="zh" onClick={this.changeLanguage.bind(this)}>中文</a>
        				</span>
        			</p>
        	    </div>
        	);
       	}

        else if (this.t('locale') === 'fr') {
    		return (
        		<div className={this.props.className}> 
        			<p>
        				<span>{this.t('language')}
        					<a> | </a>
        					<a href="?lng=en" data-locale="en" onClick={this.changeLanguage.bind(this)}>English</a>
        					<a> | </a>
        					<a href="?lng=zh" data-locale="zh" onClick={this.changeLanguage.bind(this)}>中文</a>
        				</span>
        			</p>
        	    </div>
        	);
        }

        else if (this.t('locale') === 'zh') {
    		return (
        		<div className={this.props.className}> 
        			<p>
        				<span>{this.t('language')}
        					<a> | </a>
        					<a href="?lng=en" data-locale="en" onClick={this.changeLanguage.bind(this)}>English</a>
        					<a> | </a>
        					<a href="?lng=fr" data-locale="fr" onClick={this.changeLanguage.bind(this)}>Français</a>
        				</span>
        			</p>
        	    </div>
        	);
        }
    }
}
export default withTranslation()(LanguageSwitcher);
