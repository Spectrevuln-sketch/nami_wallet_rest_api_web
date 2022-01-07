import React from 'react'

import {
    goBack,
    goTo,
    popToTop,
    Link,
    Router,
    getCurrent,
    getComponentStack,
} from 'react-chrome-extension-router';

import MainApp from './MainApp';



const App = () => {
    return (
        <Router>
            <MainApp />
        </Router>
    )
}

export default App
