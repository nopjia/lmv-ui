# lmv-ui

Application UI for Autodesk LMV

## Getting Started

### Requirements

- Node.js - used to run JavaScript tools from the command line.
- npm - the node package manager, installed with Node.js and used to install Node.js packages.
- gulp - a Node.js-based build tool.
- bower - a Node.js-based package manager used to install front-end packages (like Polymer).

### Installation

1. Install Node.js at [nodejs.org](https://nodejs.org)
1. Install `gulp` globally

    ```
    npm install -g gulp
    ```

1. Install `bower` globally

    ```
    npm install -g bower
    ```

1. Install local npm dependencies

    ```
    npm install
    ```

1. Install local bower dependencies

    ```
    bower install
    ```

## Development

### Serve / Watch

```
gulp serve
```

Runs server to serve project locally and watches for changes to automatically refresh the browser as changes are made. Also serves to a local IP that can be used on other devices connected to your network.

### Create New Element

```
gulp el -n example-element
```

Creates new `lmv-example-element` with corresponding HTML, Javascript, and SCSS files from a template

### Run Tests

```
gulp test:local
```

This runs the unit tests defined in the `app/test` directory through [web-component-tester](https://github.com/Polymer/web-component-tester).

TODO: This needs to be implemented

### Build

```
gulp
```

Builds project to `dist` directory