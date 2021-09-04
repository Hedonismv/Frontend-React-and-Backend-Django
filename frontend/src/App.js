import React, {Component} from 'react';
import './App.css';
import CustomModal from './components/Modal';
import { Modal } from 'reactstrap';
import axios from 'axios';



class App extends Component {
  state = {
    modal: false,
    viewCompleted: false,
    taskList: [],
    activeItem: {
      title: "",
      description: "",
      completed: false
    },
    todolist: []
  }

  componentDidMount() {
    this.refreshList()
  }

  refreshList = () => {
    axios.get('http://localhost:8000/api/tasks/')
      .then(res => this.setState({todolist: res.data}))
      .catch(err => console.log(err))
  }



  displayCompleted = (status) => {
    if (status) {
      return this.setState({viewCompleted: true})
    } else {
      return this.setState({viewCompleted: false})
    }
  }

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}>
            Completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}>
            Incompleted
        </span>
      </div>
    )
  }

  renderItems = () => {
    const {viewCompleted} = this.state;
    const newItems = this.state.todolist.filter(
      item => item.completed === viewCompleted
    );

    return newItems.map(item => (
      <li 
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center">
          <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}
            title={item.title}>
            {item.title}
          </span>
          <span>
            <button className="btn btn-info mr-2" onClick={() => this.editItem(item)}>Edit</button>
            <button className="btn btn-danger mr-2" onClick={() => this.handleDelete(item)}>Delete</button>
          </span>
      </li>
    ))
  }

  toggle = () => {
    this.setState({modal: !this.state.modal})
  }

  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      console.log(item.id)
      axios.put(`http://localhost:8000/api/tasks/${item.id}/`, item)
      .then(res => this.refreshList())
    }else {
      axios.post("http://localhost:8000/api/tasks/", item)
      .then(res => this.refreshList())
    }

  }

  handleDelete = item => {
    axios.delete(`http://localhost:8000/api/tasks/${item.id}/`)
    .then(res => this.refreshList())
  }

  createItem = () => {
    const item = {title: "", modal: !this.state.modal};
    this.setState({activeItem: item, modal: !this.state.modal})
  }

  editItem = (item) => {
    this.setState({activeItem: item, modal: !this.state.modal})
  }


  render() {
    return (
      <main className="content p-3 mb-2 bg-info">
        <h1 className="text-black text-uppercase text-center my-4">Task manager</h1>
        <div className="row">
          <div className="col-md-6 col-sma-10 mx-auto p-0">
            <div className="card p-3">
              <div>
                <button className="btn btn-warning" onClick={this.toggle}>Add task</button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-5 mb-2 bg-info text-white text-center">Copy 2021</footer>
        {this.state.modal ? (
          <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit}/>
        ) : null}
      </main>
    )
  }
}

export default App;
