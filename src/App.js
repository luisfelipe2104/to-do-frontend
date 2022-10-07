import React from 'react';
import './App.css';
import axios from "axios"


class App extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null,
          title:'',
          complete:false,
        },
        editing:false,
      }
      this.fetchTasks = this.fetchTasks.bind(this)
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)

      this.startEdit = this.startEdit.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
      this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };



  componentWillMount(){
    this.fetchTasks()
  }

// ----------------------------------------------------------------------
  // gets the data of the django database
  async fetchTasks(){
    console.log('Fetching...')
    try{
      const res = await axios.get("https://odd-jade-armadillo-belt.cyclic.app/tasks")
      console.log(res)
      this.setState({
        todoList: res.data
      })
    }catch(err){
      console.log(err)
    }

  }

  // ----------------------------------------------------------------------
  // handles changes in the input
  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

// ----------------------------------------------------------------------
// Handle Submit
  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)


    var url = 'https://odd-jade-armadillo-belt.cyclic.app/create-task'

// ----------------------------------------------------------------------
// edits the item
    if(this.state.editing === true){
      url = `https://odd-jade-armadillo-belt.cyclic.app/update/${ this.state.activeItem.id }/`
      this.setState({
        editing: false
      })

      console.log(this.state.editing)
    }

// adds the item
    fetch(url, {
        method:'POST',
        headers:{
            'Content-type':'application/json',
        },
        body:JSON.stringify(this.state.activeItem)
    }).then(response => {
        this.fetchTasks()
        this.setState({
            activeItem:{
                id:null,
                title:'',
                complete:false,
              }
        }).catch(function(error){
            console.log('ERROR:', error)
        })
    })

  }

// ----------------------------------------------------------------------
// edits the item
  startEdit(task){
    this.setState({
      activeItem:task,
      editing:true
    })
    console.log(this.state.editing)
  }

// ----------------------------------------------------------------------
// deletes an item
  deleteItem(task){

    fetch(`https://odd-jade-armadillo-belt.cyclic.app/delete/${ task.id }/`, {
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
    },
    }).then(response =>{
      this.fetchTasks()
    })
  }

// ----------------------------------------------------------------------
// sets an item to completed and uncompleted
  strikeUnstrike(task){
    task.complete = !task.complete

    var url = `https://odd-jade-armadillo-belt.cyclic.app/update/${ task.id }/`
    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
    },
    body:JSON.stringify({complete:task.complete, 'title':task.title})
    }).then(() => {
      this.fetchTasks()
    })

    console.log('TASK:', task.complete)
  }

// ----------------------------------------------------------------------
// display the data

  render(){
    var tasks = this.state.todoList
    var self = this
    return(
        <div className="container">

          <div id="task-container">
              <div  id="form-wrapper">
                 <form onSubmit={this.handleSubmit}  id="form">
                    <div className="flex-wrapper">
                        <div style={{flex: 6}}>
                            <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
                         </div>

                         <div style={{flex: 1}}>
                            <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                          </div>
                      </div>
                </form>

              </div>

              <div  id="list-wrapper">
                    {tasks.map(function(task, index){
                      return(
                          <div key={index} className="task-wrapper flex-wrapper">

                            <div onClick={() => self.strikeUnstrike(task)} style={{flex:7}}>

                              {task.complete === 0 ?(
                                <span>{task.title}</span>
                              ) : (
                                <span><del>{task.title}</del></span>
                              )}

                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                            </div>

                            <div style={{flex:1}}>
                                <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                            </div>

                          </div>
                        )
                    })}
              </div>
          </div>

        </div>
      )
  }
}

export default App;
