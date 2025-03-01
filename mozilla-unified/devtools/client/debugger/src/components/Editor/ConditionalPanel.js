/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import { PureComponent } from "devtools/client/shared/vendor/react";
import {
  div,
  textarea,
} from "devtools/client/shared/vendor/react-dom-factories";
import ReactDOM from "devtools/client/shared/vendor/react-dom";
import PropTypes from "devtools/client/shared/vendor/react-prop-types";
import { connect } from "devtools/client/shared/vendor/react-redux";
import { toEditorLine } from "../../utils/editor/index";
import { createEditor } from "../../utils/editor/create-editor";
import { prefs, features } from "../../utils/prefs";
import actions from "../../actions/index";
import { markerTypes } from "../../constants";

import {
  getClosestBreakpoint,
  getConditionalPanelLocation,
  getLogPointStatus,
} from "../../selectors/index";

const classnames = require("resource://devtools/client/shared/classnames.js");

export class ConditionalPanel extends PureComponent {
  cbPanel;
  input;
  codeMirror;
  panelNode;
  scrollParent;

  constructor() {
    super();
    this.cbPanel = null;
  }

  static get propTypes() {
    return {
      breakpoint: PropTypes.object,
      closeConditionalPanel: PropTypes.func.isRequired,
      editor: PropTypes.object.isRequired,
      location: PropTypes.any.isRequired,
      log: PropTypes.bool.isRequired,
      openConditionalPanel: PropTypes.func.isRequired,
      setBreakpointOptions: PropTypes.func.isRequired,
      selectedSource: PropTypes.object.isRequired,
    };
  }

  keepFocusOnInput() {
    if (this.input) {
      this.input.focus();
    }
  }

  saveAndClose = () => {
    if (this.input) {
      this.setBreakpoint(this.input.value.trim());
    }

    this.props.closeConditionalPanel();
  };

  onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      this.saveAndClose();
    } else if (e.key === "Escape") {
      this.props.closeConditionalPanel();
    }
  };

  setBreakpoint(value) {
    const { log, breakpoint } = this.props;
    // If breakpoint is `pending`, props will not contain a breakpoint.
    // If source is a URL without location, breakpoint will contain no generatedLocation.
    const location =
      breakpoint && breakpoint.generatedLocation
        ? breakpoint.generatedLocation
        : this.props.location;
    const options = breakpoint ? breakpoint.options : {};
    const type = log ? "logValue" : "condition";
    return this.props.setBreakpointOptions(location, {
      ...options,
      [type]: value,
    });
  }

  clearConditionalPanel() {
    if (this.cbPanel) {
      this.cbPanel.clear();
      this.cbPanel = null;
    }
    if (this.scrollParent) {
      this.scrollParent.removeEventListener("scroll", this.repositionOnScroll);
    }
  }

  repositionOnScroll = () => {
    if (this.panelNode && this.scrollParent) {
      const { scrollLeft } = this.scrollParent;
      this.panelNode.style.transform = `translateX(${scrollLeft}px)`;
    }
  };

  showConditionalPanel(prevProps) {
    const { location, editor, breakpoint, selectedSource } = this.props;
    if (!selectedSource || !location) {
      return;
    }
    // When breakpoint is removed
    if (prevProps?.breakpoint && !breakpoint) {
      editor.removeLineContentMarker(markerTypes.CONDITIONAL_BP_MARKER);
      return;
    }
    if (selectedSource.id !== location.source.id) {
      editor.removeLineContentMarker(markerTypes.CONDITIONAL_BP_MARKER);
      return;
    }
    const line = toEditorLine(location.source.id, location.line || 0);
    editor.setLineContentMarker({
      id: markerTypes.CONDITIONAL_BP_MARKER,
      lines: [{ line }],
      renderAsBlock: true,
      createLineElementNode: () => {
        // Create a Codemirror 5 editor for the breakpoint panel
        // TODO: Switch to use Codemirror 6 version Bug 1890205
        const breakpointPanelEditor = createEditor();
        breakpointPanelEditor.appendToLocalElement(
          document.createElement("div")
        );
        return this.renderConditionalPanel(this.props, breakpointPanelEditor);
      },
    });
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillMount() {
    if (features.codemirrorNext) {
      this.showConditionalPanel();
    } else {
      this.renderToWidget(this.props);
    }
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillUpdate() {
    if (!features.codemirrorNext) {
      this.clearConditionalPanel();
    }
  }

  componentDidUpdate(prevProps) {
    if (features.codemirrorNext) {
      this.showConditionalPanel(prevProps);
    }
    this.keepFocusOnInput();
  }

  componentWillUnmount() {
    // This is called if CodeMirror is re-initializing itself before the
    // user closes the conditional panel. Clear the widget, and re-render it
    // as soon as this component gets remounted
    const { editor } = this.props;
    if (features.codemirrorNext) {
      editor.removeLineContentMarker(markerTypes.CONDITIONAL_BP_MARKER);
    } else {
      this.clearConditionalPanel();
    }
  }

  renderToWidget(props) {
    if (this.cbPanel) {
      this.clearConditionalPanel();
    }
    const { location, editor } = props;
    if (!location) {
      return;
    }

    const editorLine = toEditorLine(location.source.id, location.line || 0);
    this.cbPanel = editor.codeMirror.addLineWidget(
      editorLine,
      this.renderConditionalPanel(props, editor),
      {
        coverGutter: true,
        noHScroll: true,
      }
    );

    if (this.input) {
      let parent = this.input.parentNode;
      while (parent) {
        if (
          parent instanceof HTMLElement &&
          parent.classList.contains("CodeMirror-scroll")
        ) {
          this.scrollParent = parent;
          break;
        }
        parent = parent.parentNode;
      }

      if (this.scrollParent) {
        this.scrollParent.addEventListener("scroll", this.repositionOnScroll);
        this.repositionOnScroll();
      }
    }
  }

  createEditor = (input, editor) => {
    const { log, closeConditionalPanel } = this.props;
    const codeMirror = editor.CodeMirror.fromTextArea(input, {
      mode: "javascript",
      theme: "mozilla",
      placeholder: L10N.getStr(
        log
          ? "editor.conditionalPanel.logPoint.placeholder2"
          : "editor.conditionalPanel.placeholder2"
      ),
      cursorBlinkRate: prefs.cursorBlinkRate,
    });

    codeMirror.on("keydown", (cm, e) => {
      if (e.key === "Enter") {
        e.codemirrorIgnore = true;
      }
    });

    codeMirror.on("blur", (cm, e) => {
      if (
        // if there is no event
        // or if the focus is the conditional panel
        // do not close the conditional panel
        !e ||
        (e?.relatedTarget &&
          e.relatedTarget.closest(".conditional-breakpoint-panel"))
      ) {
        return;
      }

      closeConditionalPanel();
    });

    const codeMirrorWrapper = codeMirror.getWrapperElement();

    codeMirrorWrapper.addEventListener("keydown", e => {
      codeMirror.save();
      this.onKey(e);
    });

    this.input = input;
    this.codeMirror = codeMirror;
    codeMirror.focus();
    codeMirror.setCursor(codeMirror.lineCount(), 0);
  };

  getDefaultValue() {
    const { breakpoint, log } = this.props;
    const options = breakpoint?.options || {};
    return log ? options.logValue : options.condition;
  }

  renderConditionalPanel(props, editor) {
    const { log } = props;
    const defaultValue = this.getDefaultValue();

    const panel = document.createElement("div");
    // CodeMirror6 can't have margin on a block widget, so we need to wrap the actual
    // panel inside a container which won't have any margin
    const reactElPanel = div(
      { className: "conditional-breakpoint-panel-container" },
      div(
        {
          className: classnames("conditional-breakpoint-panel", {
            "log-point": log,
          }),
          onClick: () => this.keepFocusOnInput(),
          ref: node => (this.panelNode = node),
        },
        div(
          {
            className: "prompt",
          },
          "»"
        ),
        textarea({
          defaultValue,
          ref: input => this.createEditor(input, editor),
        })
      )
    );

    ReactDOM.render(reactElPanel, panel);
    return panel;
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  const location = getConditionalPanelLocation(state);

  if (!location) {
    return {};
  }

  const breakpoint = getClosestBreakpoint(state, location);

  return {
    breakpoint,
    location,
    log: getLogPointStatus(state),
  };
};

const { setBreakpointOptions, openConditionalPanel, closeConditionalPanel } =
  actions;

const mapDispatchToProps = {
  setBreakpointOptions,
  openConditionalPanel,
  closeConditionalPanel,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConditionalPanel);
