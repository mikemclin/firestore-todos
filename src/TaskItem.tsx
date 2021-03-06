import * as React from 'react';
import * as firebase from 'firebase';

export type Task = {
  title: string,
  done: boolean,
  ref: firebase.firestore.DocumentReference
};

interface Props {
  task: Task;
  onError: (e: string) => void;
}

interface State {
  updating: boolean;
}

class TaskItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      updating: false
    };
  }

  updateTask = (e: React.FormEvent<HTMLInputElement>) => {
    if (!this.state.updating) {
      this.setState({updating: true});
      this.props.task.ref.set(
        {
          done: e.currentTarget.checked
        }, 
        {
          merge: true
        }
      ).catch((err: Error) => {
        this.setState({updating: false});
        this.props.onError(err.toString());
      });
    }
  }

  deleteTask = () => {
    if (!this.state.updating) {
      this.setState({updating: true});
      this.props.task.ref.delete().catch((err: Error) => {
        this.setState({updating: false});
        this.props.onError(err.toString());
      });
    }
  }
  
  render() {
    const task = this.props.task;
    return (
      <li key={task.ref.id}>
        <input
          disabled={this.state.updating}
          onChange={this.updateTask}
          type="checkbox" 
          checked={task.done} 
        />
        {task.title}
        &nbsp;
        <button
          disabled={this.state.updating}
          onClick={this.deleteTask}
        >
          X
        </button>
    </li>
    );
  }
}

export default TaskItem;