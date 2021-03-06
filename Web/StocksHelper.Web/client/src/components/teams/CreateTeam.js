import React, { Component } from 'react';
import notifications from '../../infrastructure/notifications';

export default class CreateTeam extends Component {
  constructor(props) {
    super(props);

    this.suggestionsContainer = React.createRef();

    this.state = {
      members: [],
      focusedSuggestion: 0,
      name: '',
      memberInput: '',
      isMemberInputFocused: false
    };
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
    this.props.createTeamClosed();
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.props.createTeamOpened();
  }

  createTeam = (ev) => {
    ev.preventDefault();

    var model = {
      Members: this.state.members,
      Name: this.state.name
    }

    const modelState = this.validateModel(model);
    if (!modelState.isValid)
      return notifications.warning(modelState.errors.join(' </br>'));

    this.props.createTeam(model);
  }

  validateModel = (model) => {
    let errors = [],
      isValid = true;

    if (model.Name.length < 3) {
      errors.push('The team name should be at least 3 symbols.');
      isValid = false;
    }

    if (model.Members.length < 1) {
      errors.push('You must add at least one member.');
      isValid = false;
    }

    return { errors, isValid }
  }

  handleMemberInput = (ev) => {
    let memberInput = ev.target.value

    if (memberInput.length === 0)
      return this.props.clearSuggestions();

    if (ev.keyCode === 13) {
      return this.selectSuggestion(this.props.memberSuggestions[this.state.focusedSuggestion]);
    }

    if (ev.keyCode === 27)
      return this.props.clearSuggestions();

    if (ev.keyCode === 40) {
      let focusedSuggestion = this.props.memberSuggestions.length - 1 === this.state.focusedSuggestion ? 0 : this.state.focusedSuggestion + 1;

      this.setState({ focusedSuggestion });
    }

    if (ev.keyCode === 38) {
      let focusedSuggestion = this.state.focusedSuggestion === 0 ? this.props.memberSuggestions.length - 1 : this.state.focusedSuggestion - 1;
      this.setState({ focusedSuggestion });
    }

    this.props.suggestMembers(memberInput);
  }


  handleClickOutside = (event) => {
    if (this.suggestionsContainer && !this.suggestionsContainer.current.contains(event.target)) {
      this.props.clearSuggestions();
    }
  }

  selectSuggestion = (member) => {
    if (this.state.members.some(m => m.id === member.id))
      return notifications.alert('Your team already has this member.');

    this.setState(prevState => ({
      members: prevState.members.concat(member),
      focusedSuggestion: 0,
      memberInput: ''
    }));
    this.props.clearSuggestions();
  }

  handleInputChange = (ev) => {
    const { name, value } = ev.target;
    this.setState({ [name]: value });
  }

  handleFormKeyPress = (ev) => {
    if (ev.which === 13) {
      ev.preventDefault();
    }
  }

  removeMember = (member) => {
    let members = this.state.members
    for (let i = 0; i < members.length; i++) {
      if (members[i].id === member.id) {
        members.splice(i, 1);
        break;
      }
    }
    
    this.setState({ members });
  }

  render() {
    return (
      <div className="col-md-8 float-left">
        <div className='border border-primary create-team'>
          <div>
            <h2>Create team</h2>
          </div>
          <div>
            <form onSubmit={this.createTeam} onKeyPress={this.handleFormKeyPress}>
              <div className="form-group">
                <input type="text" className='form-control' name='name' onChange={this.handleInputChange} value={this.state.name} placeholder='Team name' />
              </div>
              <div className="form-group members-input-wrapper">
                <h4>Add members</h4>
                <div ref={this.suggestionsContainer}>
                  <input type="text" autoComplete='off' name='memberInput' id='memberInput' className="form-control member-input" onKeyUp={this.handleMemberInput}
                    onChange={this.handleInputChange} value={this.state.memberInput} placeholder='Type member name' />
                  <div className="member-suggestions">
                    {this.props.memberSuggestions.map((member, index) => (
                      <div className={`suggestion ${this.state.focusedSuggestion === index ? 'active' : ''}`} key={member.id} onClick={() => this.selectSuggestion(member)}>{member.userName}</div>
                    ))}
                  </div>
                </div>
                <div className="form-control members-container">
                  {this.state.members.length > 0 ?
                    this.state.members.map(member => (
                      <span key={member.id} className="badge badge-primary">{member.userName} <i className="fas fa-times" onClick={() => this.removeMember(member)}></i></span>
                    )) :
                    <div><small><i>Your team has no members.</i></small></div>}
                </div>
              </div>
              <div className="form-group text-right">
                <input type="submit" className='btn btn-outline-success' value='Done' />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}