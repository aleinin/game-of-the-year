import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './components/App'
import reportWebVitals from './reportWebVitals'
import { configService } from './api/configService'
import axios from 'axios'

configService.getConfig().then((constants) => {
  axios.defaults.baseURL = constants.baseUrl ?? 'http://localhost:8080'
  if (axios.defaults.headers) {
    ;(axios.defaults.headers.common as any)['Accept'] = 'application/json'
    ;(axios.defaults.headers.post as any)['Content-Type'] = 'application/json'
  }
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
