import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DataUpload from './Components/DataUpload/DataUpload'
import ContentEditor from './Components/Editor/Editor'
import Landing from './Components/Landing/Landing'
import Login from './Components/Login/Login'
// import Footer from './Components/Footer/Footer'
// import Register from './Components/Register/Register'
import DnDEnditor from './Components/DnDEditor/DnDEditor'

function App () {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path='/login'>
            <Login />
          </Route>
          {/* <Route exact path='/register'>
            <Register />
          </Route> */}
          <Route exact path='/csv'>
            <DataUpload />
          </Route>
          <Route exact path='/mail'>
            <ContentEditor />
          </Route>
          <Route path='/dnd'>
            <DnDEnditor />
          </Route>
          {/* <Route path='/footer'>
            <Footer />
          </Route> */}
          <Route path='/'>
            <Landing />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
