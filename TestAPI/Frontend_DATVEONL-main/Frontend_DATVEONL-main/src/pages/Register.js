import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import { register, checkPhone } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      try{
        const result = await checkPhone(phone);
        if (result.exists) {
          setError('Số điện thoại đã được đăng ký. Vui lòng sử dụng số điện thoại khác.');
          return;
        }
        else{
          sendVerificationCode(phone);
        }
      }
      catch (error) {
        setError('Error checking phone number: ' + error.message);
      }
    } catch (error) {
      setError('Error registering: ' + error.message);
    }
  };


  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth,
        'sign-in-button',
        {
          'size': 'invisible',
          'callback': (response) => {
            console.log('Recaptcha resolved');},
          'expired-callback': () => {
              setError('Recaptcha expired. Please refresh the page');
          }
        }
      );
    }
  };

  const sendVerificationCode = (phoneNumber) => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        
        window.confirmationResult = confirmationResult;
        setIsModalOpen(true);
      }).catch((error) => {
        // Error; SMS not sent
        console.error("Error during signInWithPhoneNumber", error);
        setError('Error sending verification code:' + error.message);
        
      });
  };

  const handleVerifyCode = async () => {
    try {
      window.confirmationResult.confirm(verificationCode);
      // User signed in successfully, now create the account in the database
      const account = { ten: name, email, sdt: phone, password };
      await register(account);
      navigate('/login'); // Điều hướng đến trang đăng nhập sau khi xác minh thành công
    } catch (error) {
      // Error; verification code is incorrect
      console.error("Error during signInWithCredential", error);
      setError('Invalid verification code:' + error.message);
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
  const formattedPhone = phoneNumber.trim();
  if (!/^\+84\d{9}$/.test(formattedPhone)) {
    setError('Invalid phone number format. Please enter in +84XXXXXXXXX format.');
    return false;
  }
  return true;
};

  return (
    <section className="bg-gradient-to-r from-slate-600 via-slate-400 to-slate-500">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng ký tài khoản
            </h1>
            {error && <p className="text-red-500">{error}</p>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Vui lòng nhập theo định dạng +84xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => {
                    if (validatePhoneNumber(phone)) {
                      setError('');
                    }
                  }}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">Tôi đồng ý với <label className="font-medium text-primary-600 hover:underline dark:text-primary-500">điều khoản và dịch vụ</label></label>
                </div>
              </div>
              <button type="submit" id="sign-in-button" className="w-full text-white bg-primary-600 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Đăng ký</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Bạn đã có tài khoản? <label onClick={() => {
                  navigate('/login');
                }} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Đăng nhập</label>
              </p>
            </form>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Xác nhận mã SMS</h2>
            <div id="recaptcha-container"></div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mb-4"
              placeholder="Nhập mã xác nhận"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button
              className="bg-red-500 text-white p-3 rounded-lg"
              onClick={handleVerifyCode}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Register;