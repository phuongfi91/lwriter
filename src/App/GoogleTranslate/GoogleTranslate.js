import React, { Component } from 'react';
import Axios from 'axios';
import Switch from 'react-switch';
import './GoogleTranslate.css';
import Helper from '../Helper';
import LangCode from '../Language';

const TargetLanguage = Helper.getTargetLanguage();
const ApiKey = process.env.REACT_APP_GTRANSLATE_API_KEY;

class GoogleTranslate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      output: '',
      isLiveUpdateEnabled: true
    };
  }

  handleInputChange(newInputValue) {
    this.setState({
        input: newInputValue
      }
    );

    if (this.state.isLiveUpdateEnabled) {
      this.handleDetectAndTranslate(newInputValue);
    }
  }

  handleOutputChange(data) {
    const decoder = document.createElement('textarea');
    const translations = data.data.data.translations;

    var translatedText = '';
    translations.forEach(t => {
      decoder.innerHTML = t.translatedText;
      translatedText += decoder.value + '\n';
    });

    this.setState({
        output: translatedText
      }
    );
  }

  handleDetectAndTranslate(textToTranslate) {
    if (textToTranslate === '') return;

    console.log('DETECT LANGUAGE request sent for: ', textToTranslate);
    const detectUrl = 'https://translation.googleapis.com/language/translate/v2/detect?key=';

    Axios.post(detectUrl + ApiKey, {
      q: textToTranslate
    })
      .then((response) => {
        let languagePair = this.getLanguagePair(response.data.data.detections[0][0]);
        this.setState({
          inputLang: languagePair[0],
          outputLang: languagePair[1]
        }, () => {
          this.handleTranslate(textToTranslate);
        });
      })
      .catch(reason => {
        console.log(reason);
      });
  }

  handleTranslate(textToTranslate) {
    console.log('TRANSLATE request sent for: ', textToTranslate);
    const translateUrl = 'https://translation.googleapis.com/language/translate/v2?key=';

    Axios.post(translateUrl + ApiKey, {
      source: this.state.inputLang,
      target: this.state.outputLang,
      q: textToTranslate.split('\n')
    })
      .then((response) => this.handleOutputChange(response))
      .catch(function (reason) {
        console.log(reason);
      });
  }

  getLanguagePair(detection) {
    console.log('Detected language: ', detection);
    if (detection.language !== LangCode.English) {
      return [TargetLanguage, LangCode.English];
    }
    return [LangCode.English, TargetLanguage];
  }

  handleSelection(event) {
    const getSelectedText = (target) => {
      return target.value.slice(target.selectionStart, target.selectionEnd);
    };

    const getLanguageCode = (target) => {
      return target.id === 'input' ? this.state.inputLang : this.state.outputLang;
    };

    this.props.onSelectionChange({
      text: getSelectedText(event.target),
      language: getLanguageCode(event.target)
    });
  }

  handleLiveUpdateOption(value) {
    this.setState({
      isLiveUpdateEnabled: value
    }, () => {
      if (this.state.isLiveUpdateEnabled) {
        this.handleDetectAndTranslate(this.state.input);
      }
    });
  }

  renderToggleButtonText(text, isEnableState) {
    var paddingLeftValue = isEnableState ? 100 : 0;
    var paddingRightValue = isEnableState ? 0 : 100;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontSize: 30,
          color: 'white',
          paddingLeft: paddingLeftValue,
          paddingRight: paddingRightValue,
          fontWeight: 'bold',
        }}
      >
        {text}
      </div>
    );
  }

  render() {
    return (
      <div>
        <form className='Google-translate'>
          <div className='label-and-text-area'>
            <label>IN:</label>
            <textarea id='input' lang={this.state.inputLang} rows="5"
                      value={this.state.input}
                      onChange={(e) => this.handleInputChange(e.target.value)}
                      onSelectCapture={(e) => this.handleSelection(e)} />
          </div>
          <div className="label-and-text-area">
            <label>OUT:</label>
            <textarea id='output' lang={this.state.outputLang} readOnly={true} rows="5"
                      value={this.state.output}
                      onSelectCapture={(e) => this.handleSelection(e)} />
          </div>
          <div className='toggle-switch'>
            <Switch checked={this.state.isLiveUpdateEnabled}
                    width={224} height={56}
                    onColor='#1d81ff'
                    boxShadow="1px 1px 20px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    checkedIcon={this.renderToggleButtonText('AUTO', true)}
                    uncheckedIcon={this.renderToggleButtonText('MANUAL', false)}
                    onChange={(value) => this.handleLiveUpdateOption(value)} />
          </div>
          <input type="button" value="TRANSLATE" className='button'
                 onClick={(e) => this.handleDetectAndTranslate(this.state.input)} />

          <div className='history-navigation'>
            <button
              className='button'
              disabled={this.props.currentHistoryIndex <= 0}
              onClick={event => this.props.onClickBack(event)}>Back
            </button>
            <button
              className='button'
              disabled={this.props.currentHistoryIndex >= this.props.historyLength - 1}
              onClick={event => this.props.onClickForward(event)}>Forward
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default GoogleTranslate;
