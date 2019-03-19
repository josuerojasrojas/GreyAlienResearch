import React from 'react';
import Button from '../Components/Buttons';
import { CheckBox, TextInput } from '../Components/Inputs';
import { Link } from "react-router-dom";
import { hasInput, emailCheck } from '../Helpers/InputsCheck';
import { checkAllInputs, handleOnChange } from '../Helpers/InputFunctions';

export default class SignupForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: {
        val: '',
        hasError: false
      },
      password: {
        val: '',
        hasError: false
      },
      email: {
        val: '',
        hasError: false
      },
      checkbox: false,
    };
    this.checkInput = {
      name: hasInput,
			email: emailCheck,
      password: hasInput,
		};
    this.submitForm = this.submitForm.bind(this);
    this.onInputChange = this.onInputChange.bind(this);

  }

  onInputChange(e, inputKey){
    let inputState = handleOnChange(e, inputKey, this.state, this.checkInput);
    this.setState({
      [inputKey]: inputState
    });
  }

  submitForm(){
    let valuesChange = checkAllInputs(this.checkInput, this.state);
    if(valuesChange || this.state.checkbox ){
      this.setState(valuesChange);
      return false;
    }
    this.props.firebase.auth()
      .createUserWithEmailAndPassword(this.state.email.val, this.state.password.val)
      .catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  render(){
    return(
      <form>
        <TextInput
          title='FULL NAME'
          placeholder='Enter your full name'
          val={this.state.name.val}
          hasError={this.state.name.hasError}
          onChange={(e) => this.onInputChange(e, 'name')}/>
        <TextInput
          type='password'
          title='PASSWORD'
          placeholder='Enter a password'
          val={this.state.password.val}
          hasError={this.state.password.hasError}
          onChange={(e) => this.onInputChange(e, 'password')}/>
        <TextInput
          type='email'
          title='E-MAIL'
          placeholder='Enter your e-mail'
          val={this.state.email.val}
          hasError={this.state.email.hasError}
          onChange={(e) => this.onInputChange(e, 'email')}/>
        <CheckBox
          isChecked={this.state.checkbox}
          onClick={()=>this.setState({ checkbox: !this.state.checkbox })}
          text={<div className='checkbox-text'><span>I agree all statements in <a href='/'>terms and services</a></span></div>}/>
        <Button
          text='Sign Up'
          onClick={this.submitForm}/>
        <div className='extra-link'>
          <Link to='/signin'>
            I'm already a member
          </Link>
        </div>
      </form>
    );
  }
}