import { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { AvatarGroup } from '@material-ui/lab';
import { Avatar } from '@material-ui/core';
import Amit from '../../assets/styles/img/Amit.jpeg';
import Tair from '../../assets/styles/img/Tair.jpeg';
import Tamir from '../../assets/styles/img/Tamir.jpeg';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


import { loadBoard, loadBoards, updateBoard, updateBoards } from '../../store/actions/boardAction'
import { GroupList } from '../group/GroupList'
import { taskService } from '../../services/taskService'
import { groupService } from '../../services/groupService'
import { socketService } from '../../services/socketService'
import { GroupFilter } from '../group/GroupFilter';


export class _BoardDetails extends Component {
    state = {
        isFilterShow: false,
        groupForDisplay: null
    }
    componentDidMount() {
        this.loadActiveBoard()

        this.setUpListeners()
    }

    setUpListeners = () => {
        socketService.on('update board', () => {
            this.loadActiveBoard()
        })
        socketService.on('update boards', () => {
            this.props.loadBoards()
            this.loadActiveBoard()
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.boardId !== this.props.match.params.boardId) {
            this.loadActiveBoard()
        }
    }

    loadActiveBoard = () => {
        const { boardId } = this.props.match.params
        this.props.loadBoard(boardId)
    }

    onRemoveTask = (taskId, group) => {
        const { activeBoard } = this.props
        const updatedBoard = taskService.remove(taskId, activeBoard, group)
        this.props.updateBoard(updatedBoard)

    }

    onAddTask = (txt, groupId) => {
        const { activeBoard } = this.props
        const updatedBoard = taskService.add(txt, activeBoard, groupId)
        this.props.updateBoard(updatedBoard)

    }

    onUpdateTask = (task, groupId) => {
        const { activeBoard } = this.props
        const updatedBoard = taskService.update(task, activeBoard, groupId)
        this.props.updateBoard(updatedBoard)


    }

    onAddGroup = (groupName) => {
        const { activeBoard } = this.props
        const updatedBoard = groupService.add(groupName, activeBoard)
        this.props.updateBoard(updatedBoard)

    }

    onRemoveGroup = (ev, groupId) => {
        ev.stopPropagation();
        const { activeBoard } = this.props
        const updatedBoard = groupService.remove(groupId, activeBoard)
        this.props.updateBoard(updatedBoard)
    }

    onUpdateGroup = (group) => {
        const { activeBoard } = this.props
        const updatedBoard = groupService.update(group, activeBoard)
        this.props.updateBoard(updatedBoard)
    }

    onUpdateBoardName = (boardName) => {
        const { activeBoard, boards } = this.props
        const updatedBoard = { ...activeBoard }
        updatedBoard.name = boardName
        this.props.updateBoard(updatedBoard)
        this.props.updateBoards(updatedBoard, boards)
    }

    onUpdateBoardDesc = (description) => {
        const { activeBoard } = this.props
        const updatedBoard = { ...activeBoard }
        updatedBoard.desc = description
        this.props.updateBoard(updatedBoard)

    }

    handleDragEnd = async (res) => {
        const { source, destination, type } = res;
        const { activeBoard } = this.props;
        const updatedBoard = { ...activeBoard };
        if (!destination) return;
        if (destination.droppableId === source.droppableId
            &&
            destination.index === source.index) return;
        if (type === 'group') {
            const newGroups = this._reorder(activeBoard.groups, source.index, destination.index);
            updatedBoard.groups = newGroups;
        } else if (type === 'task') {
            if (destination.droppableId === source.droppableId) {
                var groupIdx = activeBoard.groups.findIndex(group => group.id === source.droppableId)
                const newTasks = this._reorder(activeBoard.groups[groupIdx].tasks, source.index, destination.index);
                updatedBoard.groups[groupIdx].tasks = newTasks;
            } else if (destination.droppableId !== source.droppableId) {
                const sourceGroup = source.droppableId;
                const destinationGroup = destination.droppableId;
                //remove task from source group
                const sourceGroupIdx = activeBoard.groups.findIndex(group => group.id === sourceGroup)
                const sourceGroupItems = Array.from(activeBoard.groups[sourceGroupIdx].tasks)
                const [transferedItem] = sourceGroupItems.splice(source.index, 1);
                //add task to destination group
                const destinationGroupIdx = activeBoard.groups.findIndex(group => group.id === destinationGroup);
                const destinationGroupItems = Array.from(activeBoard.groups[destinationGroupIdx].tasks);
                destinationGroupItems.splice(destination.index, 0, transferedItem);
                //update groups in data
                updatedBoard.groups[sourceGroupIdx].tasks = sourceGroupItems;
                updatedBoard.groups[destinationGroupIdx].tasks = destinationGroupItems;
            }
        }
        await this.props.updateBoard(updatedBoard);
    }

    _reorder = (list, sourceIdx, destIdx) => {
        const items = Array.from(list);
        const [removedItem] = items.splice(sourceIdx, 1);
        items.splice(destIdx, 0, removedItem);

        return items;
    }

    toggleFilter = () => {
        var { isFilterShow } = this.state
        isFilterShow = !isFilterShow
        this.setState({ isFilterShow })
    }
    getGroupForDisplay = (filterBy) => {
        const { activeBoard } = this.props
        if (!filterBy) return this.setState({ groupForDisplay: null })
        const regex = new RegExp(filterBy, 'i')
        const newGroups = []
        activeBoard.groups.forEach(group => {
            if ((regex.test(group.name))) newGroups.push(group)
            else {
                const tasks = group.tasks.filter(task => (regex.test(task.name)))
                if (tasks.length) {
                    var newGroup = { ...group }
                    newGroup.tasks = tasks
                    newGroups.push(newGroup)
                }
            }
        })
        this.setState({ groupForDisplay: newGroups })

    }

    render() {
        const { activeBoard } = this.props
        if (!activeBoard) return <div>Looks Like This Board Does Not Exist...</div>
        return (
            <section className="board-details flex col">
                <div className="board-header-top-container flex col">
                    <div className="board-header-top-left flex">
                        <div
                            className="board-name editable"
                            contentEditable="true"
                            onBlur={(ev) => {
                                this.onUpdateBoardName(ev.target.innerText)
                            }}
                            suppressContentEditableWarning={true}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    ev.target.blur()
                                }
                            }}
                        >
                            {activeBoard.name}
                        </div>
                        <div className="board-header-top-right flex">
                            <span><AvatarGroup>
                                <Avatar className="avatar" alt="Amit" src={Amit} />
                                <Avatar className="avatar" alt="Tair" src={Tair} />
                                <Avatar className="avatar" alt="Tamir" src={Tamir} />
                            </AvatarGroup>
                            </span>
                            <span className="activities">Activities/ 17</span>
                            <MoreHorizIcon />
                        </div>
                    </div>
                    <span
                        className="board-desc editable"
                        contentEditable="true"
                        onBlur={(ev) => {
                            this.onUpdateBoardDesc(ev.target.innerText)
                        }}
                        suppressContentEditableWarning={true}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.target.blur()
                            }
                        }}
                    >
                        {activeBoard.desc}
                    </span>
                    <div className="board-header-bottom-container flex space-between">
                        <div className="board-creator">
                            <span
                                onClick={() => {
                                    this.props.history.push(`/profile/${activeBoard.creator._id}`);
                                }}>
                                Created By: {activeBoard.creator.fullname}
                            </span>
                        </div>
                        <div className="bottom-right-container flex">
                            <button
                                className="btn-add-group"
                                onClick={() => {
                                    this.onAddGroup('new group')
                                }}>
                                New Group
                            </button>
                            <GroupFilter
                                getGroupForDisplay={this.getGroupForDisplay}
                                activeBoard={activeBoard}
                                toggleFilter={this.toggleFilter}
                                isFilterShow={this.state.isFilterShow} />
                            <MoreHorizIcon />
                        </div>
                    </div>
                </div>
                {this.state.isFilterShow &&
                    <div
                        className="screen"
                        onClick={this.toggleFilter}
                    />}

                <GroupList
                    groups={this.state.groupForDisplay || activeBoard.groups}
                    onRemoveTask={this.onRemoveTask}
                    onAddTask={this.onAddTask}
                    onUpdateTask={this.onUpdateTask}
                    onUpdateGroup={this.onUpdateGroup}
                    onRemoveGroup={this.onRemoveGroup}
                    handleDragEnd={this.handleDragEnd}
                    activeBoard={activeBoard}
                />

            </section>
        )
    }
}

const mapGlobalStateToProps = (state) => {
    return {
        activeBoard: state.boardReducer.activeBoard,
        boards: state.boardReducer.boards
    };
};
const mapDispatchToProps = {
    loadBoard,
    loadBoards,
    updateBoard,
    updateBoards
}

export const BoardDetails = connect(
    mapGlobalStateToProps,
    mapDispatchToProps
)(_BoardDetails);