import { Button } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';

import { Component } from 'react'
import { CommentList } from './comment/CommentList'


export class TaskDetails extends Component {
    state = {
        clickedInput: false,
        comment: {
            text: '',
            by: {
                _id: 'as2d12',
                fullname: 'Tair Bitan',
                imgUrl: ''
            }
        }
    }
    componentDidMount() {
    }


    toggleShowTextArea = () => {
        this.setState({ clickedInput: !this.state.clickedInput })
    }

    onSubmitComment = (ev) => {
        ev.preventDefault()
        this.toggleShowTextArea()
        this.props.onAddComment(this.state.comment)
        const commentCopy = { ...this.state.comment }
        commentCopy.text = ''
        this.setState({ comment: commentCopy })
    }

    handleChange = (ev) => {
        const { value } = ev.target
        const commentCopy = { ...this.state.comment }
        commentCopy.text = value
        this.setState({ comment: commentCopy })
    }

    render() {
        const { clickedInput, comment } = this.state
        const { task, closeModal } = this.props
        return (
            <section className="task-details" onClick={(ev) => ev.stopPropagation()} >
                <CloseIcon className="close-icon" onClick={closeModal} />
                <div className="task-name-container">
                    <span>{task.name}</span>
                </div>
                {!clickedInput &&
                    <input type="text" onFocus={this.toggleShowTextArea} placeholder="write something..." />}
                {clickedInput &&
                    <form
                        className="comment-wrapper flex col"
                        onSubmit={(ev) => {
                            this.onSubmitComment(ev)
                        }}>
                        <textarea
                            autoFocus={true}
                            value={comment.text}
                            onChange={(ev) => this.handleChange(ev)}
                            required
                        />
                        <Button
                            className="update-btn"
                            type="submit"
                            variant="contained">
                            update
                        </Button>
                    </form>}
                <CommentList comments={task.comments} />
            </section>
        )
    }
}