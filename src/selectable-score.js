import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import Score from 'meld-clients-core/lib/containers/score';
import DragSelect from "dragselect/dist/DragSelect";
import ReactDOM from 'react-dom';
import auth from 'solid-auth-client';

const CONTAINS = "http://www.w3.org/ns/ldp#contains"

const defaultVrvOptions = {
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  footer: "none",
  unit: 6
}

const defaultSelectorString = '.note'; 

class SelectableScore extends Component {
  constructor(props) { 
    super(props);
    this.state = { 
      vrvOptions: "vrvOptions" in this.props 
        ? this.props.vrvOptions 
        : defaultVrvOptions,
      selectorString: "selectorString" in this.props 
        ? this.props.selectorString
        : defaultSelectorString,
      scoreComponentLoaded: false,
      annotationContainerContentToRetrieve: []
    }
    this.enableSelector = this.enableSelector.bind(this);
    this.scoreComponent = React.createRef();
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.observer = new MutationObserver(this.handleScoreUpdate); 
  }

  handleScoreUpdate() { 
    typeof this.props.onScoreUpdate === "function" &&
      this.props.onScoreUpdate (
        ReactDOM.findDOMNode(this.scoreComponent.current).querySelector("svg")
      );
  }

  enableSelector() {
    if(!Object.keys(this.props.score.SVG).length) {
      console.log("Enable selector called before MEI has loaded!");
      return; // no MEI loaded yet
    }
    if (typeof this.state.selector !== "undefined") {
      this.state.selector.stop();
    }
    let selector;
    if(this.state.selectorString) { 
      selector = new DragSelect({
        selectables: document.querySelectorAll(this.state.selectorString),
        area: document.getElementsByClassName('score')[0],
        selectedClass: 'selected',
        onDragStartBegin: () => {
          document.body.classList.add('s-noselect');
        },
        callback: (elements) => {
          document.body.classList.remove('s-noselect');
          this.props.onSelectionChange(elements);
        }
      });
    }
    // undefined if no selector string specified, otherwise a new DragSelect
    this.setState({selector: selector}); 
  }

  fetchAnnotationContainer() { 
    auth.fetch(this.props.annotationContainerUri, {
      mode: 'cors',
      headers: { 'Accept': 'application/ld+json' }
    })
    .then( response => response.json())
    .then( (data) => { 
      // fetch any contents of the container
      let uri = this.props.annotationContainerUri;
      // ensure uri ends with slash
      uri = uri.charAt(uri.length-1) === "/" ? uri : uri + "/"
      // find json-ld description of the container itself
      const container = data.filter( x => x["@id"] === uri )[0]
      if(CONTAINS in container) {
        const contentUris = container[CONTAINS].map( contentItem => contentItem["@id"]).filter(uri => !uri.endsWith(".lock/")) // skip SOLID lock files
        this.setState({ annotationContainerContentToRetrieve: contentUris }, 
          () => { this.fetchAnnotationContainerContent() }
        )
      } else { this.props.onReceiveAnnotationContainerContent({}) }; // report empty container
    })
    .catch( err => console.log("Error: ", err))
  }

  fetchAnnotationContainerContent() { 
    console.log("Attempting iteration", this.state.annotationContainerContentToRetrieve)
    Promise.all(this.state.annotationContainerContentToRetrieve.map( uri => 
        auth.fetch(uri, {
          mode: 'cors',
          headers: { 'Accept': 'application/ld+json' }
        })
    )).then( responses => {
       Promise.all(
         responses.map( response => response.json())
       ).then( content => { 
         // inject content URIs into JSON-LD objects
         content.forEach( (c, ix) => { 
           c["@id"] = this.state.annotationContainerContentToRetrieve[ix]
         });
         // and callback to the application
         this.props.onReceiveAnnotationContainerContent(content)
       }).catch( err => console.error("Error extracting response json: ", err))
    }).catch( err => console.log("Error retrieving content: ", err));
  }
        
  
  componentDidMount() { 
    // horrible hack to allow SVG to be loaded into DOM first
    // TODO fix using Mutation Observers
    setTimeout(() => {
      this.enableSelector();
    }, 1000);
    // handle fetching of annotation container contents
    if(this.props.annotationContainerUri && this.props.toggleAnnotationRetrieval) { 
      if(this.props.onReceiveAnnotationContainerContent) { 
        this.fetchAnnotationContainer()
      } else { 
        console.error("Specified annotation container URI without onReceiveAnnotationContainerContent callback");
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.annotationContainerUri && !prevProps.toggleAnnotationRetrieval && this.props.toggleAnnotationRetrieval) { 
      if(this.props.onReceiveAnnotationContainerContent) { 
        // update annotation container flag toggled on, clear state and refetch
        this.setState({ 
          annotationContainerContentToRetrieve: []
        }, this.fetchAnnotationContainer());
      } else { 
        console.error("Specified annotation container URI without onReceiveAnnotationContainerContent callback");
      }
    }

    if(!prevState.scoreComponentLoaded && this.scoreComponent.current) { 
      // first load of score component - start observing for DOM changes
      this.setState({ "scoreComponentLoaded": true }, () => { 
        this.observer.observe(ReactDOM.findDOMNode(this.scoreComponent.current).querySelector(".score"), {"childList": true});
      })
    }
    if(prevProps.score.latestRenderedPageNum !== this.props.score.latestRenderedPageNum) { 
      // page turned, re-initialise selectors 
        this.enableSelector();
    }
    if(prevProps.selectorString !== this.props.selectorString) { 
      // selector changed (e.g. from .note to .measure), re-initialise selectors
        this.setState({"selectorString": this.props.selectorString}, () => {
          this.enableSelector();
        });
    }
  }

  render() { 
    console.log("Attempting to render score with uri: ", this.props.uri);
    return(
      <Score 
        uri={ this.props.uri }
        key={ this.props.uri }
        options={ this.state.vrvOptions }
        ref = { this.scoreComponent }
      />
    )
  }
}

function mapStateToProps({ score }) {
  return { score }
}


export default connect(mapStateToProps,)(SelectableScore);
