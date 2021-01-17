import { Component } from 'react'
import { Link } from 'react-router-dom'
const dateFormat = require('dateformat')

export class TaskToWeek extends Component {
    state = {
        board: {},
        userActive: '',
        userTasks: []
    }

    componentDidMount() {
        const { board } = this.props
        this.setState({ board }, () => {
            this.findTasksPerUser('2h3j5b')
        })
    }

    findTasksPerUser = (userId) => {
        const { board } = this.state
        const { groups } = board
        const userTasks = []
        groups.forEach(group => {
            let tasks = group.tasks.filter(task => task.members.find(member => member._id === userId))
            if (tasks.length) {
                tasks = tasks.map(task => {
                    task.groupName = group.name
                    task.boardName = board.name
                    return task;
                })
                userTasks.push(...tasks)
            }
        })
        this.setState({ userTasks: userTasks })
    }

    changeDate = (date) => {
        const localDate = dateFormat(date, "dd-mm-yyyy");
        return localDate
    }
    render() {
        const { userTasks } = this.state
        return (
            <div>
                {userTasks.map(task => {
                    return <div className="tasks-user flex space-between">
                        <div className="left flex col">
                            <h3>{task.name}</h3>
                            <Link to="/board">{`At: ${task.boardName} < ${task.groupName}`}</Link>
                        </div>
                        <div className="right flex">
                            {/* {task.dueDate} */}
                            {this.changeDate(task.dueDate)}
                        </div>
                    </div>
                })}
            </div>
        )
    }
}
