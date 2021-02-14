import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DataUpload from './Components/DataUpload'
import ContentEditor from './Components/Editor'

function App () {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={DataUpload} />
          <Route
            path='/mail'
            component={ContentEditor}
          />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
