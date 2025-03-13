import { useMutation } from '@apollo/client';
import { ChangeEvent, useState, type FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';



// biome-ignore lint/correctness/noEmptyPattern: <explanation>
const SignupForm = ({}: { handleModalClose: () => void }) => {

  const [ formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    SavedBooks: []
  })

  const [ addProfile, { error }] = useMutation(ADD_USER);

  const handleChange = (event: ChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const handleFormSubmit= async (event: FormEvent) => {
    event.preventDefault();
    console.log(formState)

    try{
      const { data } =await addProfile({
        variables: { 
          "username": formState.username,
          "email": formState.email,
          "password": formState.password
         }
      });
      Auth.login(data.addUser.token);
    }catch(error:any){
      console.error('error:', error)
    }
  }
 
  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleChange}
            value={formState.username || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleChange}
            value={formState.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleChange}
            value={formState.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formState.username && formState.email && formState.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
      {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
      )}
    </>
  );
};

export default SignupForm;
