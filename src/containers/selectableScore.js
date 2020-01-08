import Score from 'meld-clients-core/src/containers/score';

const defaultVrvOptions = {
  | scale: 45,
  | adjustPageHeight: 1,
  | pageHeight: 2500,
  | pageWidth: 2200,
  | noFooter: 1,
  | unit: 6
}

const defaultSelectors = [ '.note', '.measure' ]

class SelectableScore extends Component {
  constructor(props) { 
    super(props);
    this.state = { 
      vrvOptions: vrvOptions in this.props 
        ? this.props.vrvOptions 
        : defaultVrvOptions
      selectors: selectors in this.props 
        ? this.props.selectors
        : defaultSelectors
    }
  }

  enableSelector() {
  | if(!Object.keys(this.props.score.SVG).length) {
  | ¦ return; // no MEI loaded yet
  | }
  | if (typeof this.state.selector !== "undefined") {
  | ¦ ┆ this.state.selector.stop();
  | }
  | let selector = new DragSelect({
  | ¦ ┆ selectables: document.querySelectorAll(this.state.selectorString),
  | ¦ ┆ area: document.getElementsByClassName('score')[0],
  | ¦ ┆ selectedClass: 'selected',
  | ¦ ┆ onDragStartBegin: () => {
  | ¦ ┆ ┊ | document.body.classList.add('s-noselect');
  | ¦ ┆ },
  | ¦ ┆ callback: (elements) => {
  | ¦ ┆ ┊ | document.body.classList.remove('s-noselect');
  | ¦ ┆ ┊ | this.handleSelectionChange(elements);
  | ¦ ┆ }
  | });
  | console.log("About to set selector: ", selector);
  | this.setState({selector: selector});
  }

  render() { 
    return(
      <div>
        <Score 
          uri={ this.props.uri }
          key={ this.props.uri }
          options={ this.state.vrvOptions }
        />
      </div>
    )
  }
          

