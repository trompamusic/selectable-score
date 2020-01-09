# TROMPA selectable-score React component
This repository contains the selectable-score React component, a wrapper around a [MELD score component](https://github.com/oerc-music/meld-clients-core) that allows for selection of score elements via click-and-drag, built using the [DragSelect](https://github.com/ThibaultJanBeyer/DragSelect) node module. 

The MELD score is itself a wrapper around the [Verovio](https://verovio.org) MEI engraver supporting the incorporation of Linked Data (e.g. Web Annotations). For more information on MELD see the [MELD metarepository](https://github.com/oerc-music/meld) and these papers:

* [ISMIR 2017 paper on distributed annotation of musical score](https://ora.ox.ac.uk/objects/uuid:945287f6-5dd3-4424-940c-b919b8ad2768)

* [DLfM 2019 paper on annotating musicological observations using MELD](https://dl.acm.org/doi/10.1145/3358664.3358669)

This component is intended to serve various score-centric applications of the [TROMPA project](https://trompamusic.eu).

To use the component in your project:

`import SelectableScore from 'selectable-score/dist/selectable-score'`

The `<SelectableScore>` component accepts the following props:

* `vrvOptions` (*optional*): a JSON object containing layout options to pass on to Verovio. If not specified, uses these defaults:

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

[More information on Verovio options here](https://verovio.org/javascript.xhtml).


* `selectionString` (*optional*): specifies the CSS selector used by DragSelect for click-and-drag selections. Any valid CSS selector acceptable; if not specified, defaults to `.note`.

* `onSelectionChange` (*required*): a callback to your application's selection handler. 

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
