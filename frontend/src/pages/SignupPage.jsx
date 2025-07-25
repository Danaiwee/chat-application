import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from '../components/AuthImagePattern';
import toast from "react-hot-toast";

const SignupPage = () => {
  //use to show password
  const [showPassword, setShowPassword] = useState(false);

  //use to store register data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  //use to show loading when click signup
  const {signup, isSigningUp} = useAuthStore();

  //function for validate signup form
  const validateForm = () => {
    //check datas (fullname, email, password)
    if(!formData.fullName.trim()){
     toast.error("Full name is require");
     return false;
    }  
    if(!formData.email.trim()){
      toast.error("Email is required");
      return false;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if(!formData.password) {
      toast.error("Invalid email format");
      return false;
    }
    if(formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  }

  //function for submit data
  const handleSubmit = (e) => {
    e.preventDefault();

    //receive data from validateForm
    const success = validateForm();

    if(success) signup(formData);
  }



  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/*left side page*/}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* {Logo} */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>
                Create Account
              </h1>
              <p className='text-base-content/60'>
                Get Started with your free account
              </p>
            </div>
          </div>

          {/* {Form} */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>
                  Full Name
                </span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='size-5 text-base-content/40' />
                </div>
                <input 
                  type="text" 
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>
                  Email
                </span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input 
                  type="email" 
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John_Doe@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>
                  Password
                </span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='size-5 text-base-content/40' />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={()=> setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='size-5 text-base-content/40' />
                  ) : (
                    <Eye className='size-5 text-base-content/40' />
                  )}
                </button>
              </div>
            </div>

            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className='text-center'>
              <p className='text-base-content/60'>
                Already have an account?{" "}
                <Link to='/login' className='link link-primary'> 
                  Sign in
                </Link>
              </p>
          </div>
        </div>
      </div>

      {/*right side page*/}
      <AuthImagePattern
        title='Join out community'
        subtitle='Connect with friencs, share moments, and stay in touch with your loved ones'
      />
    </div>
  )
}

export default SignupPage