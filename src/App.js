import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DataUpload from './Components/DataUpload/DataUpload'
import ContentEditor from './Components/Editor/Editor'
import Footer from './Components/Footer/Footer'
import Landing from './Components/Landing/Landing'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import DnDEnditor from './Components/DnDEditor/DnDEditor'

function App () {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <Landing />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/register'>
            <Register />
          </Route>
          <Route path='/csv'>
            <DataUpload />
          </Route>
          <Route path='/mail'>
            <ContentEditor />
          </Route>
          <Route path='/dnd' render={(props) => <DnDEnditor {...props} />} />
          <Route path='/footer'>
            <Footer />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
