import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import Option from "../Option/Option";
import Spinner from "../Spinner/Spinner";
import "./mediabutton.css";

import { ReactMediaLibrary } from "../MediaLibrary";
import { Input, Button, Label } from "@windmill/react-ui";

class LayoutComponent extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    doCollapse: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  state = {
    imgSrc: "",
    dragEnter: false,
    uploadHighlighted:
      this.props.config.uploadEnabled && !!this.props.config.uploadCallback,
    showImageLoading: false,
    height: this.props.config.defaultSize.height,
    width: this.props.config.defaultSize.width,
    alt: "",
  };

  componentDidUpdate(prevProps) {
    const { config } = this.props;
    if (prevProps.expanded && !this.props.expanded) {
      this.setState({
        imgSrc: "",
        dragEnter: false,
        uploadHighlighted: config.uploadEnabled && !!config.uploadCallback,
        showImageLoading: false,
        height: config.defaultSize.height,
        width: config.defaultSize.width,
        alt: "",
      });
    } else if (
      config.uploadCallback !== prevProps.config.uploadCallback ||
      config.uploadEnabled !== prevProps.config.uploadEnabled
    ) {
      this.setState({
        uploadHighlighted: config.uploadEnabled && !!config.uploadCallback,
      });
    }
  }

  addImageFromState = () => {
    const { imgSrc, alt } = this.state;
    let { height, width } = this.state;
    const { onChange } = this.props;
    if (!isNaN(height)) {
      height += "px";
    }
    if (!isNaN(width)) {
      width += "px";
    }
    onChange(imgSrc, height, width, alt);
  };

  toggleShowImageLoading = () => {
    const showImageLoading = !this.state.showImageLoading;
    this.setState({
      showImageLoading,
    });
  };

  updateValue = (event) => {
    this.setState({
      [`${event.target.name}`]: event.target.value,
    });
  };

  selectImage = (image) => {
    this.setState({
      showImageLoading: false,
      dragEnter: false,
      imgSrc: image.thumbnailUrl,
    });
  };

  uploadImage = (fileBlob, fileMeta) => {
    this.toggleShowImageLoading();
    const { fileUploadCallback } = this.props;

    return fileUploadCallback(fileBlob, fileMeta)
      .then((url) => {
        this.setState({
          showImageLoading: false,
          dragEnter: false,
          imgSrc: url,
        });
        this.fileUpload = false;

        return true;
      })
      .catch(() => {
        this.setState({
          showImageLoading: false,
          dragEnter: false,
        });

        return false;
      });
  };

  renderAddImageModal() {
    const { imgSrc, showImageLoading, height, width, alt } = this.state;
    const {
      config: { previewImage, inputAccept, alt: altConf },
      doCollapse,
      translations,
      fileLibraryList,
      fileDeleteCallback,
    } = this.props;

    const self = this;

    const additionalTabs = [
      {
        name: translations["components.controls.image.byURL"],
        component: function (props) {
          return (
            <div className="my-8 rdw-image-modal-url-section">
              <Input
                placeholder="Enter URL"
                name="imgSrc"
                onChange={self.updateValue}
                onBlur={self.updateValue}
                value={imgSrc}
              />
              <span className="rdw-image-mandatory-sign">*</span>
            </div>
          );
        },
      },
    ];

    return (
      <ReactMediaLibrary
        show={true}
        onHide={doCollapse}
        additionalTabs={additionalTabs}
        fileLibraryList={fileLibraryList}
        fileUploadCallback={this.uploadImage}
        fileSelectCallback={this.selectImage}
        fileDeleteCallback={fileDeleteCallback}
      >
        <div className="grid gap-4 grid-cols-2 mb-6">
          <div>
            {previewImage && imgSrc ? (
              <img
                src={imgSrc}
                alt={imgSrc}
                className="rdw-image-modal-upload-option-image-preview"
              />
            ) : (
              "No image is selected"
            )}
          </div>
          <div className="flex flex-col">
            {altConf.present && (
              <div className="rdw-image-modal-size">
                <span className="rdw-image-modal-alt-lbl">Alt Text</span>
                <Input
                  onChange={this.updateValue}
                  onBlur={this.updateValue}
                  value={alt}
                  name="alt"
                  placeholder="alt"
                />
                <span className="rdw-image-mandatory-sign">
                  {altConf.mandatory && "*"}
                </span>
              </div>
            )}
            <div className="rdw-image-modal-size">
              <span className="w-4 mr-4">&#8597;</span>
              <Input
                onChange={this.updateValue}
                onBlur={this.updateValue}
                value={height}
                name="height"
                placeholder="Height"
              />
              <span className="rdw-image-mandatory-sign">*</span>
            </div>
            <div className="rdw-image-modal-size">
              <span className="w-4 mr-4">&#8596;</span>
              <Input
                onChange={this.updateValue}
                onBlur={this.updateValue}
                value={width}
                name="width"
                placeholder="Width"
              />
              <span className="rdw-image-mandatory-sign">*</span>
            </div>
          </div>
        </div>
        <span className="my-2">
          <Button
            className="mr-4"
            onClick={this.addImageFromState}
            disabled={
              !imgSrc || !height || !width || (altConf.mandatory && !alt)
            }
          >
            {translations["generic.add"]}
          </Button>
          <Button onClick={doCollapse} layout="outline">
            {translations["generic.cancel"]}
          </Button>
        </span>
        {showImageLoading ? (
          <div className="rdw-image-modal-spinner">
            <Spinner />
          </div>
        ) : undefined}
      </ReactMediaLibrary>
    );
  }

  render() {
    const {
      config: { icon, className, title },
      expanded,
      onExpandEvent,
      translations,
    } = this.props;

    return (
      <div
        className="rdw-image-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-image-control"
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={onExpandEvent}
          title={title || translations["components.controls.image.image"]}
        >
          <img src={icon} alt="" />
        </Option>
        {expanded ? this.renderAddImageModal() : undefined}
      </div>
    );
  }
}

export default LayoutComponent;
