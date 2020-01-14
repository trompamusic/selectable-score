# TROMPA selectable-score React component
This repository contains the selectable-score React component, a wrapper around a [MELD score component](https://github.com/oerc-music/meld-clients-core) that allows for selection of score elements via click-and-drag, built using the [DragSelect](https://github.com/ThibaultJanBeyer/DragSelect) node module. 

The MELD score is itself a wrapper around the [Verovio](https://verovio.org) MEI engraver supporting the incorporation of Linked Data (e.g. Web Annotations). 

This component is intended to serve various score-centric applications of the [TROMPA project](https://trompamusic.eu).

To use the component in your project:

`import SelectableScore from 'selectable-score/dist/selectable-score';`

If your application requires paging through the score, additionally import the following:

```
import NextPageButton from 'selectable-score/dist/next-page-button';
import PrevPageButton from 'selectable-score/dist/prev-page-button';
```

### SelectableScore props
The `<SelectableScore>` component accepts the following props:

* `vrvOptions` (*optional*): a JSON object containing layout options to pass on to Verovio. [More information on Verovio options here](https://verovio.org/javascript.xhtml). If not specified, uses these defaults:

```
{ 
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  footer: "none",
  unit: 6
}
```

* `selectionString` (*optional*): specifies the CSS selector used by DragSelect for click-and-drag selections. Any valid CSS selector acceptable; if not specified, defaults to `.note`.

* `onSelectionChange` (*required*): a callback to your application's selection handler. 

### NextPageButton and PrevPageButton props
The `<NextPageButton>` and `<PrevPageButton>` components are simple interaction wrappers that attach a click handler for MELD-score-based paging to any HTML (JSX) elements you care to provide -- typically, "Next page" and "Previous page" buttons. They accept the following props: 
  
* `buttonContent` (*optional*): Your JSX content for the button. This could be as simple as { <span> Next page </span> }. Note that you can attach your own click handlers if your application requires actions beyond the page turn itself to occur on button click (but don't stop the click event's propagation (event.stopPropagation), or the page won't turn). Failure to supply buttonContent will result in an empty component. 

* `uri` (*required*): Your MEI file's URI. 

## Test application

This repository also contains a minimal example React application integrating the selectable-score component. To run it, clone this repository, then:
```
cd selectable-score

npm install

npm start`
```

Now point your web browser at https://localhost:8080. Wait a few moments for Verovio to render the score. 

Click and drag to select MEI elements (in this example, notes); hold down shift or ctrl to select discontinuous regions.

Score layout options and elements to select can be customised; see `src/containers/testApp.js`

## Known issues

Paging is currently very slow. We're working on improving this, through MELD optimisations and potentially by running Verovio as a Web Worker (work in progress!)

## Further reading
For more information on TROMPA see the [TROMPA website](https://trompamusic.eu) and the following paper:

* [DLfM 2019 overview paper on TROMPA](https://dl.acm.org/doi/10.1145/3358664.3358666)


For more information on MELD see the [MELD metarepository](https://github.com/oerc-music/meld) and these papers:

* [ISMIR 2017 paper on distributed annotation of musical score](https://ora.ox.ac.uk/objects/uuid:945287f6-5dd3-4424-940c-b919b8ad2768)

* [DLfM 2018 paper on publishing musicology using MELD](https://dl.acm.org/doi/10.1145/3273024.3273038)

* [DLfM 2019 paper on annotating musicological observations using MELD](https://dl.acm.org/doi/10.1145/3358664.3358669)

