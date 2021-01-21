import { Component } from 'react'

export class FilterModal extends Component {
    state = {
        filterBy: {
            group: '',
            members: '',
            status: '',
            priority: '',
            timeLine: '',
        }
    }

    filterGroup = (ev, field, value) => {
        ev.stopPropagation();
        var filterBy = { ...this.state.filterBy };
        filterBy[field] = value;
        this.setState({ filterBy }, () => {
            console.log('filtering from modal', filterBy)
            this.props.getGroupsForDisplay(filterBy)
        })
    }

    // getDateRange = () => {
    //     const { groups } = this.props.activeBoard
    //     // console.log('groups is:', groups);
    //     const dateRange = []
    //     groups.map(group => {
    //         const groupsTask = group.tasks.map(task => {
    //             let start = task.dateRange.startDate
    //             let end = task.dateRange.endDate
    //             if (start === end) return start
    //             else return end
    //         })
    //         return dateRange.push(...groupsTask)
    //     })
    // }

    render() {
        const { activeBoard } = this.props
        return (
            <section className="filter-modal flex">
                <div className="column">
                    <h1>Group</h1>
                    <ul className="list groups clean-list">
                        {activeBoard.groups.map(group => {
                            return (
                                <li key={group.id} onClick={(ev) => this.filterGroup(ev, 'group', group.name)}>
                                    {group.name}
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="column">
                    <h1>Members</h1>
                </div>

                <div className="column">
                    <h1>Priority</h1>
                    <ul className="list priorities clean-list">
                        {activeBoard.priority.map((priority, idx) => {
                            return (
                                <li key={idx} className="priority" style={{ background: priority.color }}>
                                    {priority.txt}
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="column">
                    <h1>Status</h1>
                    <ul className="list statuses clean-list">
                        {activeBoard.status.map((status, idx) => {
                            return (
                                <li key={idx} className="status" style={{ background: status.color }}>
                                    {status.txt}
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="column">
                    <h1>TimeLine</h1>
                </div>
            </section>
        )
    }
}
