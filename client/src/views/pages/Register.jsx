import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../state/authApiSlice'
import { login } from '../../state/authSlice'
import { useRegisterMutation } from '../../state/authApiSlice'
import { useAddExperienceMutation } from '../../state/userApiSlice'
import { IoEye, IoEyeOff } from 'react-icons/io5'

const Register = () => {
  const [credentials, setCredentials] = useState({
    fullName: '',
    email: '',
    password1: '',
    password2: '',
    role: 'jobSeeker',
    experiences: '',
  })
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [authLogin] = useLoginMutation()
  const [register] = useRegisterMutation()
  const [addExperiences] = useAddExperienceMutation()

  const [show, setShow] = useState([false, false])

  const showPassword = (i) => {
    const value = [...show]
    value[i] = !value[i]
    setShow(value)
  }

  const handleChange = (e) => {
    const experience = e.target.value === 'company' ? '' : credentials.experiences
    setCredentials({
      ...credentials,
      experience,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { fullName, email, password1, password2, role, experiences } = credentials
    const newErrors = {}

    if (!fullName) {
      newErrors.fullName = 'Az név megadása kötelező!'
    }
    if (!email) {
      newErrors.email = 'Az e-mail cím megadása kötelező!'
    }
    if (!password1) {
      newErrors.password1 = 'A jelszó megadása kötelező!'
    }
    if (!password2) {
      newErrors.password2 = 'A jelszó megadása kötelező!'
    } else if (password1 && password1 !== password2) {
      newErrors.password2 = 'A megadott jelszavak nem egyeznek!'
    }

    const experienceList = validateExperiences(experiences, (error) => {
      if (!newErrors.experiences.experiences) {
        newErrors.experiences = error
      }
    })

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      await register({
        fullName,
        email,
        password: password1,
        role,
      })

      const data = await authLogin({
        email,
        password: password1,
      }).unwrap()

      dispatch(
        login({
          user: data.user,
          token: data.accessToken,
        })
      )
      
      experienceList.forEach(async (experience) => await addExperiences(experience))      
      navigate('/')
    } catch (error) {
      newErrors.fail = 'Sikertelen regisztráció!'
      setErrors(newErrors)
    }
  }

  const validateExperiences = (experiences, addError) => {
    return experiences
      .split('\n')
      .filter(line => line)
      .map(line => {
        const splitLine = line.split(';').filter(data => data).map(data => data.trim())
        if (splitLine.length!== 3) {
          addError('Hibás formátum!')
          return {}
        }

        const [company, title, interval] = splitLine
        if (!/^\d{4}-(\d{4})?$/.test(interval)) {
          addError('A megadott időszak hibás!')
          return {}
        } else {
          const [start, end] = interval.split('-').map(year => +year)
          const currentYear = new Date().getFullYear()
          if ((end && (start > end || end > currentYear))
            || (!end && start > currentYear)) {
            addError('A megadott időszak hibás!')
            return {}
          }
        }

        return { company, title, interval }
      })
  }


  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-[min(50rem,95%)]">
        <div className="grid grid-cols-2 mt-10 gap-8 wrapgrid">
          <div>
            <label htmlFor="fullName" className="form-control mb-2 text-xl font-medium text-gray-500">Teljes név</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              onChange={handleChange}
              className="input input-bordered w-full h-14 text-xl"
            />
            {errors.fullName && <span className="text-red-500 font-bold">{errors.fullName}</span>}
            <label htmlFor="email" className="form-control mt-5 mb-2 text-xl font-medium text-gray-500">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              className="input input-bordered w-full h-14 text-xl"
            />
            {errors.email && <span className="text-red-500 font-bold">{errors.email}</span>}
            <label htmlFor="password1" className="form-control mt-5 mb-2 text-xl font-medium text-gray-500">Jelszó</label>
            <div className="relative">
              <input
                type={show[0] ? 'text' : 'password'}
                id="password1"
                name="password1"
                onChange={handleChange}
                className="input input-bordered w-full h-14 text-xl"
              />
              <button type="button" onClick={() => showPassword(0)} className="h-14 w-10 absolute right-0" tabIndex={-1}>
                {show[0] ? <IoEyeOff size={25} /> : <IoEye size={25} />}
              </button>
            </div>
            {errors.password1 && <span className="text-red-500 font-bold">{errors.password1}</span>}
            <label htmlFor="password2" className="form-control mt-2 mb-2 text-xl font-medium text-gray-500">Jelszó újra</label>
            <div className="relative">
              <input
                type={show[1] ? 'text' : 'password'}
                id="password2"
                name="password2"
                onChange={handleChange}
                className="input input-bordered w-full h-14 text-xl"
              />
              <button type="button" onClick={() => showPassword(1)} className="h-14 w-10 absolute right-0" tabIndex={-1}>
                {show[1] ? <IoEyeOff size={25} /> : <IoEye size={25} />}
              </button>
            </div>
            {errors.password2 && <span className="text-red-500 font-bold">{errors.password2}</span>}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between wrapflex">
              <div className="flex">
                <input
                  type="radio"
                  name="role"
                  id="jobSeeker"
                  value="jobSeeker"
                  onChange={handleChange}
                  checked={credentials.role === 'jobSeeker'}
                  className="radio radio-primary mt-[0.1rem]"
                />
                <label htmlFor="jobSeeker" className="ml-3 text-xl font-medium text-gray-500">Munkavállaló</label>
              </div>
              <div className="flex">
                <input
                  type="radio"
                  name="role"
                  id="company"
                  value="company"
                  onChange={handleChange}
                  checked={credentials.role === 'company'}
                  className="radio radio-primary mt-[0.1rem]"
                />
                <label htmlFor="company" className="ml-3 text-xl font-medium text-gray-500">Munkáltató</label>
              </div>
            </div>
            {credentials.role === 'jobSeeker' &&
              <>
                <label htmlFor="experiences" className="form-control mt-5 mb-2 text-xl font-medium text-gray-500">Korábbi munkatapasztalat</label>
                <textarea
                  id="experiences"
                  name="experiences"
                  wrap="off"
                  placeholder="munkahely; pozíció; tól-ig (év)&#10;. . ."
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full flex-grow resize-none text-xl"
                >
                </textarea>
                {errors.experiences && <span className="text-red-500 font-bold mt-5 inline-block">{errors.experiences}</span>}
              </>
            }
          </div>
        </div>
        {errors.fail && <span className="text-red-500 font-bold mt-5 inline-block">{errors.fail}</span>}
        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary mt-5 w-72 text-xl">Regisztráció</button>
        </div>
      </form>
    </div>
  )
}

export default Register