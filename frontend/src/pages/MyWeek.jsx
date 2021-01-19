import React, { Component } from 'react'
import { connect } from 'react-redux'

import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'

import { loadBoards } from '../store/actions/boardAction'
import { AppHeader } from '../cmps/AppHeader'
import { ListMyWeek } from '../cmps/ListMyWeek'
import Calendar from '../assets/styles/img/calendar.png'

export class _MyWeek extends Component {
    state = {
        boardsForDisplay: null,
        isTaskShown: true,
        filterBy: {
            txt: ''
        }
    }
    componentDidMount() {
        this.loadBoards()
        const { boards } = this.props
        if (!boards || !boards.length) {
            return
        }
    }

    loadBoards = () => {
        this.props.loadBoards()
    }

    toggleTasksMode = () => {
        this.setState({ isTaskShown: !this.state.isTaskShown })
    }

    render() {
        const { boards } = this.props
        const { isTaskShown } = this.state
        return (
            <React.Fragment>
                <AppHeader />
                <section className="my-week">
                    <div className="top flex space-around align-center">
                        <img src={Calendar} alt="" />
                        <h2>Hey Amit ,You have 4 assignments this week</h2>
                    </div>
                    <Input type="text"
                        type="text"
                        name="name"
                        autoComplete="off"
                        placeholder="Search"
                        onChange={this.handleChange}
                    // value={filterBy.txt} 
                    />
                    <div className="bottom">
                        <div className="flex space-between">
                            <p>Tasks For You:</p>
                            <Button onClick={this.toggleTasksMode}>{(isTaskShown) ? 'Close tasks' : 'Open tasks'}</Button>
                        </div>
                        {isTaskShown && <ListMyWeek boards={boards} username={'2h3j5b'} />}
                    </div>
                </section>
            </React.Fragment >
        )
    }
}
const mapGlobalStateToProps = (state) => {
    return {
        boards: state.boardReducer.boards,
        activeBoard: state.boardReducer.activeBoard
    };
};
const mapDispatchToProps = {
    loadBoards,

}

export const MyWeek = connect(
    mapGlobalStateToProps,
    mapDispatchToProps
)(_MyWeek);